import { create } from 'zustand';

export type GameStatus = 'playing' | 'won' | 'lost';

type GameStatusState = {
	gameStatus: GameStatus;
	setGameStatus: (gameStatus: GameStatus) => void;
};

const gameStatusStore = create<GameStatusState>((set) => ({
	gameStatus: 'playing',
	setGameStatus: (gameStatus: GameStatus) => set({ gameStatus }),
}));
export default gameStatusStore;
