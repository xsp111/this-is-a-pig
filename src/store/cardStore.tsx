import { create } from 'zustand';
import { getMatchPos } from '../utils';

export type Card = {
	id: string;
	type: number;
	pos: {
		x: number;
		y: number;
	};
	status: 'pending' | 'moving' | 'clicked' | 'matched';
};

interface CardState {
	cardList: Card[];
	clickedCardList: Card[];
	pushCard: (card: Card) => void;
	setCardList: (cardList: Card[]) => void;
	clearClickedCardList: () => void;
	onClick: (id: string) => void;
}

const cardStore = create<CardState>((_set, _get) => ({
	cardList: [],
	clickedCardList: [],
	pushCard: (card: Card) => {
		_set((state) => ({
			cardList: [...state.cardList, card],
		}));
	},
	setCardList: (cardList: Card[]) => {
		_set({
			cardList,
		});
	},
	clearClickedCardList: () => {
		_set({
			clickedCardList: [],
		});
	},
	onClick: (id: string) => {
		const { cardList, clickedCardList } = _get();
		// 失败后无法点击其他卡片
		if (clickedCardList.length >= 7) return;

		const card = cardList.find((item) => item.id === id);
		if (card) {
			const pos = getMatchPos(card.type, clickedCardList);
			console.log({ pos, clickedCardList });
			if (pos) {
				_set((state) => ({
					cardList: [
						...state.cardList.filter((item) => item.id !== card.id),
					],
					clickedCardList: [
						...clickedCardList.slice(0, pos + 1),
						{
							...card,
							status: 'clicked',
						},
						...clickedCardList.slice(pos + 1),
					],
				}));
				return;
			}

			_set((state) => {
				return {
					cardList: [
						...state.cardList.filter((item) => item.id !== card.id),
					],
					clickedCardList: [
						...state.clickedCardList,
						{
							...card,
							status: 'clicked',
						},
					],
				};
			});
		}
	},
}));
export default cardStore;
