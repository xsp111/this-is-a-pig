import { useStore } from 'zustand';
import cardStore from '../store/cardStore';
import { useEffect } from 'react';
import { cardConfig } from '../const';
import gameStatusStore from '../store/gameStatusStore';
import { generateCard, getRandom } from '../utils';

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

	useEffect(() => {
		if (gameStatus === 'playing' && isRandom) {
			const { cardType, groupCount, groupSize } = cardConfig;

			const generateCardGroup = () => {
				const type = cardType[getRandom(0, cardType.length)];
				return Array.from({ length: groupSize }, () =>
					generateCard(type),
				);
			};

			const cardList = Array.from({ length: groupCount }, () =>
				generateCardGroup(),
			).flat();

			clearClickedCardList();
			setCardList(cardList);
		}
	}, [gameStatus]);

	return { gameStatus, setGameStatus };
}
