export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  isMuted: boolean;
}
