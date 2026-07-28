import { useStore } from 'zustand';
import cardStore, { type Card } from '../store/cardStore';
import { useEffect } from 'react';
import { boardConfig } from '../const';
import gameStatusStore from '../store/gameStatusStore';

export default function useGenerateCards(isRandom: boolean = true) {
	const setCardList = useStore(cardStore, (state) => state.setCardList);
	const clearClickedCardList = useStore(
		cardStore,
		(state) => state.clearClickedCardList,
	);
	const gameStatus = useStore(gameStatusStore, (state) => state.gameStatus);
	const setGameStatus = useStore(
		gameStatusStore,
		(state) => state.setGameStatus,
	);

	const { col, line } = boardConfig;

	useEffect(() => {
		if (isRandom) {
			const cardList = Array.from({ length: 50 }, (_, i) => {
				const x = Math.floor(Math.random() * col);
				const y = Math.floor(Math.random() * line);
				return {
					id: `${i}`,
					pos: {
						x: x % col,
						y: y % line,
					},
					status: 'pending',
				};
			}) as Card[];
			clearClickedCardList();
			setCardList(cardList);
		}
	}, [gameStatus]);

	return { gameStatus, setGameStatus };
}
