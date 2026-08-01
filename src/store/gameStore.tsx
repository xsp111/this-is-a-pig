import { create } from "zustand";
import { findMatched, getMatchPos } from "@utils";
import { boardConfig, cardConfig } from "@const";

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

  toDisappear?: (animate: (onfinish: () => void) => void) => void;
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
  checkMatched: () => void;
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
    if (index === -1) return;
    clickedCardList[index].clickedPos = pos;
    _set({
      clickedCardList: [...clickedCardList],
    });
  },
  checkMatched: () => {
    const { cardList, clickedCardList, setGameStatus } = _get();
    const len = clickedCardList.length;
    if (len > boardConfig.col) return setGameStatus("lost");
    const index = findMatched(clickedCardList);
    const { clickedAnimationDuration, groupSize } = cardConfig;
    if (index !== undefined) {
      const toDisappearCards = clickedCardList.slice(index, index + 3).map(
        (card, i) =>
          ({
            ...card,
            status: "matched",
            toDisappear: (animate) => {
              if (i === 2) {
                animate(() => {
                  _set((state) => ({
                    clickedCardList: state.clickedCardList.filter(
                      ({ id }) =>
                        !toDisappearCards.some(
                          ({ id: toDisappearId }) => toDisappearId === id,
                        ),
                    ),
                  }));
                });
              } else {
                setTimeout(animate, clickedAnimationDuration);
              }
            },
          }) satisfies Card,
      );

      _set({
        clickedCardList: [
          ...clickedCardList.slice(0, index),
          ...toDisappearCards,
          ...clickedCardList.slice(index + 3),
        ],
      });
      if (!cardList.some((card) => card !== undefined)) {
        setTimeout(() => setGameStatus("won"), clickedAnimationDuration);
      }
    } else if (len === boardConfig.col) {
      setTimeout(() => setGameStatus("lost"), clickedAnimationDuration);
    }
  },
}));
export default gameStore;
