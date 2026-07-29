import { create } from "zustand";
import { getMatchPos } from "../utils";

export type Card = {
  id: string;
  type: number;
  pos: {
    x: number;
    y: number;
  };
  status: "pending" | "clicked" | "moveAway" | "matched";
};

export type GameStatus = "playing" | "won" | "lost";

interface GameState {
  cardList: Card[];
  clickedCardList: Card[];
  gameStatus: GameStatus;
  setGameStatus: (gameStatus: GameStatus) => void;

  // card method
  pushCard: (card: Card) => void;
  setCardList: (cardList: Card[]) => void;
  clearClickedCardList: () => void;
  onClick: (id: string) => void;
  setCardStatus: (id: Card["id"], status: Card["status"]) => void;
  checkIsMatched: (index: number) => void;
}

const cardStore = create<GameState>((_set, _get) => ({
  cardList: [],
  clickedCardList: [],
  gameStatus: "playing",

  setGameStatus: (gameStatus: GameStatus) => _set({ gameStatus }),

  // card method
  pushCard: (card: Card) => {
    _set((state) => ({
      cardList: [...state.cardList, card],
    }));
  },
  setCardList: (cardList) => {
    _set({
      cardList,
    });
  },
  clearClickedCardList: () => {
    _set({
      clickedCardList: [],
    });
  },
  onClick: (id) => {
    const { cardList, clickedCardList } = _get();
    // 已点击区域满了后无法点击
    if (clickedCardList.length >= 7) return;

    const card = cardList.find((item) => item.id === id);
    if (card) {
      const pos = getMatchPos(card.type, clickedCardList);
      if (typeof pos === "number") {
        const moveFromCurPos = clickedCardList.slice(pos + 1).map((card) => {
          return {
            ...card,
            status: "moveAway",
          };
        }) satisfies Card[];
        _set((state) => ({
          cardList: [...state.cardList.filter((item) => item.id !== card.id)],
          clickedCardList: [
            ...clickedCardList.slice(0, pos + 1),
            {
              ...card,
              status: "clicked",
            },
            ...moveFromCurPos,
          ],
        }));
        return;
      }

      _set((state) => {
        return {
          cardList: [...state.cardList.filter((item) => item.id !== card.id)],
          clickedCardList: [
            ...state.clickedCardList,
            {
              ...card,
              status: "clicked",
            },
          ],
        };
      });
    }
  },
  setCardStatus: (id, status) => {
    const { clickedCardList } = _get();

    const index = clickedCardList.findIndex((card) => card.id === id);

    _set({
      clickedCardList: [
        ...clickedCardList.slice(0, index),
        {
          ...clickedCardList[index],
          status: status,
        },
        ...clickedCardList.slice(index + 1),
      ],
    });
  },
  checkIsMatched: (index) => {
    const { cardList, clickedCardList, setGameStatus } = _get();
    if (index < 2) return;
    const currentType = clickedCardList[index]?.type;
    if (!currentType) return;
    if (
      currentType === clickedCardList[index - 1].type &&
      currentType === clickedCardList[index - 2].type
    ) {
      _set({
        clickedCardList: [
          ...clickedCardList.slice(0, index - 2),
          ...clickedCardList.slice(index + 1),
        ],
      });
      if (cardList.length === 0) {
        setGameStatus("won");
      }
    } else if (clickedCardList.length >= 7) {
      setGameStatus("lost");
    }
  },
}));
export default cardStore;
