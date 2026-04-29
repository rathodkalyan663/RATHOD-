import { useCallback, useRef } from "react";

export function useSoundEffects() {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playOscillator = useCallback((freq: number, type: OscillatorType, duration: number, volume: number) => {
    initAudio();
    if (!audioCtx.current) return;

    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(volume, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  }, []);

  const playEatSound = useCallback((muted: boolean) => {
    if (muted) return;
    playOscillator(523.25, 'triangle', 0.1, 0.1); // C5
    setTimeout(() => playOscillator(659.25, 'triangle', 0.1, 0.1), 50); // E5
  }, [playOscillator]);

  const playGameOverSound = useCallback((muted: boolean) => {
    if (muted) return;
    playOscillator(196.00, 'sawtooth', 0.3, 0.1); // G3
    setTimeout(() => playOscillator(146.83, 'sawtooth', 0.3, 0.1), 150); // D3
    setTimeout(() => playOscillator(130.81, 'sawtooth', 0.5, 0.1), 300); // C3
  }, [playOscillator]);

  const playMoveSound = useCallback((muted: boolean) => {
    if (muted) return;
    playOscillator(150, 'sine', 0.05, 0.02);
  }, [playOscillator]);

  return { playEatSound, playGameOverSound, playMoveSound };
}
