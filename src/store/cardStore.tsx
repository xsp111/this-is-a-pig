import { create } from 'zustand';

export type Card = {
	id: string;
	pos: {
		x: number;
		y: number;
	};
	status?: 'pending' | 'moving' | 'completed';
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
		if (clickedCardList.length >= 7) return;
		const card = cardList.find((item) => item.id === id);
		if (card) {
			_set((state) => {
				return {
					cardList: [
						...state.cardList.filter((item) => item.id !== card.id),
					],
					clickedCardList: [
						...state.clickedCardList,
						{
							...card,
							status: 'completed',
						},
					],
				};
			});
		}
	},
}));
export default cardStore;
