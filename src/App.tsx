/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Music, Gamepad2, Zap, Wifi } from "lucide-react";
import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { TRACKS } from "./constants";
import { motion } from "motion/react";
import { useState } from "react";

export default function App() {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative selection:bg-[#ff00ff]/30">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f3ff]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#39ff14]/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#00f3ff] to-[#ff00ff] rounded-lg rotate-12 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic neon-gradient-text">
            SynthSnake v1.0
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/40">System Status</span>
            <span className="text-sm font-mono text-[#39ff14] flex items-center gap-2">
              CONNECTED // 124ms
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
            <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse shadow-[0_0_8px_#39ff14]"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex p-6 gap-6 items-stretch justify-center z-10 overflow-hidden">
        
        {/* Left Column: Playlist & SFX */}
        <div className="w-72 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00f3ff] mb-4 flex items-center gap-2">
               <Music className="w-3 h-3" /> Playlist
            </h3>
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {TRACKS.map((track) => (
                <div key={track.id} className="p-3 rounded-xl hover:bg-white/5 border border-transparent transition-all flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-xl overflow-hidden">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{track.title}</p>
                    <p className="text-[10px] text-white/40 uppercase truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* SFX Toggle Card */}
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Game SFX</p>
              <p className="text-[10px] text-white/40">Immersive Audio</p>
            </div>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isMuted ? 'bg-white/10' : 'bg-[#39ff14]'}`}
            >
              <motion.div 
                animate={{ x: isMuted ? 4 : 24 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </div>

        {/* Center Column: Snake Game */}
        <div className="flex-grow flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            <SnakeGame externalMuted={isMuted} onMuteToggle={() => setIsMuted(!isMuted)} />
          </motion.div>
        </div>

        {/* Right Column: Leaderboard & Info */}
        <div className="w-72 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ff00ff] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff00ff]" /> Global Highscores
            </h3>
            <div className="space-y-4">
              {[
                { name: "CYBER_PUNK", score: "45,290", rank: "01" },
                { name: "NEO_GEO", score: "38,100", rank: "02" },
                { name: "SNAKE_EYES", score: "31,050", rank: "03" }
              ].map((entry) => (
                <div key={entry.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/30 italic group-hover:text-[#ff00ff] transition-colors">{entry.rank}</span>
                    <span className="text-sm font-medium tracking-tight whitespace-nowrap">{entry.name}</span>
                  </div>
                  <span className="text-sm font-mono text-[#ff00ff]">{entry.score}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto p-4 border border-white/5 rounded-xl bg-black/20">
              <p className="text-[10px] uppercase text-center tracking-tighter text-white/40 mb-3">Control Deck</p>
              <div className="grid grid-cols-3 gap-1.5 max-w-[120px] mx-auto">
                 <div />
                 <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs border border-white/5 hover:bg-white/20 transition-colors cursor-default">↑</div>
                 <div />
                 <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs border border-white/5 hover:bg-white/20 transition-colors cursor-default">←</div>
                 <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs border border-white/5 hover:bg-white/20 transition-colors cursor-default">↓</div>
                 <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs border border-white/5 hover:bg-white/20 transition-colors cursor-default">→</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Music Player Footer */}
      <MusicPlayer />
    </div>
  );
}
