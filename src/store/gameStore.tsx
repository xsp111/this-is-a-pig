import { create } from "zustand";
import { getMatchPos } from "@utils";
import { cardConfig } from "@const";

export type Card = {
  type: number;
  status: "pending" | "clicked" | "matched";

  // 在 pending 数组中的位置跟渲染坐标
  id: number;
  pos: {
    x: number;
    y: number;
  };

  // 在 clicked 数组中的位置
  clickedPos?: number;

  toDisappear?: () => void;
};

export type PendingCardList = Array<Card | undefined>;

export type GameStatus = "playing" | "won" | "lost";

interface GameState {
  cardList: PendingCardList;
  clickedCardList: Card[];
  gameStatus: GameStatus;
  setGameStatus: (gameStatus: GameStatus) => void;

  // card method
  setCardList: (cardList: PendingCardList) => void;
  clearClickedCardList: () => void;
  onClick: (id: Card["id"]) => void;
  setClickedCardPos: (id: Card["id"], pos: number) => void;
  checkIsMatched: (index: number) => void;
}

const gameStore = create<GameState>((_set, _get) => ({
  cardList: Array.from(
    { length: cardConfig.groupSize * cardConfig.groupCount },
    () => undefined,
  ),
  clickedCardList: [],
  gameStatus: "playing",

  setGameStatus: (gameStatus: GameStatus) => _set({ gameStatus }),

  // card method
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

    const card = cardList[id];
    if (card) {
      const newCardList = [...cardList];
      newCardList[id] = undefined;
      const pos = getMatchPos(card.type, clickedCardList);
      const newClickedCardList = clickedCardList.toSpliced(pos + 1, 0, {
        ...card,
        status: "clicked",
        clickedPos: pos + 1,
      });
      _set({
        cardList: newCardList,
        clickedCardList: newClickedCardList,
      });
    }
  },
  setClickedCardPos: (id, pos) => {
    const { clickedCardList } = _get();

    const index = clickedCardList.findIndex((card) => card.id === id);
    clickedCardList[index].clickedPos = pos;

    _set({
      clickedCardList: [...clickedCardList],
    });
  },
  checkIsMatched: (index) => {
    const { cardList, clickedCardList, setGameStatus } = _get();
    if (index < 2) return;
    const currentType = clickedCardList[index]?.type;
    if (!currentType) return;
    if (
      currentType === clickedCardList?.[index - 1]?.type &&
      currentType === clickedCardList?.[index - 2]?.type
    ) {
      [
        clickedCardList[index - 2],
        clickedCardList[index - 1],
        clickedCardList[index],
      ].forEach((card) => {
        card.toDisappear = () =>
          _set({
            clickedCardList: [
              ...clickedCardList.slice(0, index - 2),
              ...clickedCardList.slice(index + 1),
            ],
          });
      });
      _set({
        clickedCardList: [...clickedCardList],
      });
      if (cardList.length === 0) setGameStatus("won");
    } else if (clickedCardList.length >= 7) {
      setGameStatus("lost");
    }
  },
}));
export default gameStore;
