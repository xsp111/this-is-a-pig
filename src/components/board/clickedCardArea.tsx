import { useStore } from "zustand";
import gameStore from "@store/gameStore";
import Card from "@components/card";
import { twx } from "@utils";
import { useEffect } from "react";

const clickedCardAreaStyle = {
  box: "w-full h-full",
  display: "flex items-center",
};
export default function ClickedCardArea() {
  const clickedCardList = useStore(gameStore, (state) => state.clickedCardList);
  const checkMatched = useStore(gameStore, (state) => state.checkMatched);

  useEffect(() => {
    checkMatched();
  }, [clickedCardList.length]);

  return (
    <div className={twx(clickedCardAreaStyle)}>
      <div className={twx(clickedCardAreaStyle, "gap-2", "relative")}>
        {clickedCardList.map(
          (card, index) =>
            card.status !== "pending" && (
              <Card key={card.id} card={card} index={index} />
            ),
        )}
      </div>
    </div>
  );
}
