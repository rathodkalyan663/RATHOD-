import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Music as MusicIcon } from "lucide-react";
import { TRACKS } from "../constants";
import { motion } from "motion/react";

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * TRACKS.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  return (
    <footer className="h-24 bg-black/80 border-t border-white/10 flex items-center px-12 z-30">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      {/* Left: Track Info */}
      <div className="w-1/3 flex items-center gap-4">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-14 h-14 bg-gradient-to-br from-[#00f3ff] to-[#ff00ff] rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-[#ff00ff]/20 overflow-hidden"
        >
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover opacity-80" />
        </motion.div>
        <div>
          <p className="font-bold text-lg leading-tight truncate max-w-[200px]">{currentTrack.title}</p>
          <p className="text-sm text-white/50 truncate max-w-[200px]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="w-1/3 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
          </button>
          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        
        <div className="w-full max-w-md h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#00f3ff] to-[#ff00ff]"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Right: Volume & Extra */}
      <div className="w-1/3 flex justify-end items-center gap-6">
        <div className="flex items-center gap-3 group">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">VOL</span>
          <div className="w-24 h-1 bg-white/20 rounded-full relative">
            <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${volume * 100}%` }} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <button 
          onClick={() => setIsShuffle(!isShuffle)}
          className={`w-10 h-10 border border-white/10 rounded-full flex items-center justify-center transition-all ${isShuffle ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'hover:bg-white/5 text-white/40'}`}
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
