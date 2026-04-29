import { useState, useEffect, useRef, useCallback } from "react";
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from "../constants";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Props {
  externalMuted?: boolean;
  onMuteToggle?: () => void;
}

export default function SnakeGame({ externalMuted = false }: Props) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  
  const { playEatSound, playGameOverSound, playMoveSound } = useSoundEffects();

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(s => s.x === newFood?.x && s.y === newFood?.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp": if (direction !== "DOWN") setNextDirection("UP"); break;
      case "ArrowDown": if (direction !== "UP") setNextDirection("DOWN"); break;
      case "ArrowLeft": if (direction !== "RIGHT") setNextDirection("LEFT"); break;
      case "ArrowRight": if (direction !== "LEFT") setNextDirection("RIGHT"); break;
      case " ": e.preventDefault(); setIsPaused(prev => !prev); break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const update = useCallback(() => {
    if (isGameOver || isPaused) return;

    setDirection(nextDirection);
    
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      
      switch (nextDirection) {
        case "UP": head.y -= 1; break;
        case "DOWN": head.y += 1; break;
        case "LEFT": head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        playEatSound(externalMuted);
      } else {
        newSnake.pop();
        playMoveSound(externalMuted);
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, externalMuted, nextDirection, generateFood, playEatSound, playMoveSound]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPaused(true);
    playGameOverSound(externalMuted);
    if (score > highScore) setHighScore(score);
  };

  const gameLoop = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;

    if (deltaTime > speed) {
      update();
      lastTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [speed, update]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = "#0c0c0e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw radial dots (subtle)
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        ctx.beginPath();
        ctx.arc(x * size + size / 2, y * size + size / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#00f3ff" : `rgba(0, 243, 255, ${1 - index / snake.length * 0.7})`;
      
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = "#00f3ff";
      
      const x = segment.x * size + 2;
      const y = segment.y * size + 2;
      const w = size - 4;
      const h = size - 4;
      const r = 3;
      
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = "#ff00ff";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ff00ff";
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group p-4" id="snake-game-container">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#00f3ff] via-[#ff00ff] to-[#39ff14] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />
      
      <div className="relative w-[500px] h-[500px] bg-[#0c0c0e] border-4 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full"
        />

        {/* Overlay HUD */}
        <div className="absolute top-8 left-8 flex flex-col gap-0 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Current Score</span>
          <span className="text-5xl font-black font-mono text-[#39ff14] tabular-nums tracking-tighter">
            {score.toString().padStart(5, "0")}
          </span>
        </div>
        
        <div className="absolute bottom-8 right-8 flex flex-col items-end gap-0 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">High Score</span>
          <span className="text-2xl font-black font-mono text-white/90 tabular-nums tracking-tighter">
            {highScore.toString().padStart(5, "0")}
          </span>
        </div>

        {/* Game State Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <h2 className={`text-6xl font-black italic tracking-tighter uppercase mb-6 ${isGameOver ? 'text-[#ff00ff]' : 'text-[#00f3ff]'}`}>
                  {isGameOver ? "GameOver" : "Paused"}
                </h2>
                
                <div className="flex gap-4">
                  {isGameOver ? (
                    <button 
                      onClick={resetGame}
                      className="px-8 py-3 bg-[#ff00ff] text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_#ff00ff66]"
                    >
                      <RotateCcw className="w-5 h-5" /> REBOOT
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="px-10 py-4 bg-[#00f3ff] text-black rounded-xl font-black uppercase italic hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_25px_#00f3ff88]"
                    >
                      <Play className="w-6 h-6 fill-black" /> Resume
                    </button>
                  )}
                </div>
                {!isGameOver && (
                  <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono">
                    Press SPACE to cycle system
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
