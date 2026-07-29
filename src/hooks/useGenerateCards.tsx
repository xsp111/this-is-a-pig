import { useStore } from "zustand";
import gameStore from "@store/gameStore";
import { useEffect } from "react";
import { cardConfig } from "@const";
import { generateCard, getRandom } from "@utils";

export default function useGenerateCards(isRandom: boolean = true) {
  const setCardList = useStore(gameStore, (state) => state.setCardList);
  const clearClickedCardList = useStore(
    gameStore,
    (state) => state.clearClickedCardList,
  );
  const gameStatus = useStore(gameStore, (state) => state.gameStatus);
  const setGameStatus = useStore(gameStore, (state) => state.setGameStatus);

  useEffect(() => {
    if (gameStatus === "playing" && isRandom) {
      const { cardType, groupCount, groupSize } = cardConfig;

      let id = 0;
      const generateCardGroup = () => {
        const type = cardType[getRandom(0, cardType.length)];
        return Array.from({ length: groupSize }, () =>
          generateCard(type, id++),
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
