import { Track } from "./types";

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Neon Nights",
    artist: "AI Gen: SynthWave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon/400/400"
  },
  {
    id: "2",
    title: "Digital Rain",
    artist: "AI Gen: Ambient",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/digital/400/400"
  },
  {
    id: "3",
    title: "Glitch Pulse",
    artist: "AI Gen: Techno",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/glitch/400/400"
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;
