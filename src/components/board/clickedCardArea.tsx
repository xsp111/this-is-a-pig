import { useStore } from "zustand";
import gameStore from "@store/gameStore";
import Card from "@components/card";
import { twx } from "@utils";

const clickedCardAreaStyle = {
  box: "w-full h-full",
  display: "flex items-center",
};
export default function ClickedCardArea() {
  const clickedCardList = useStore(gameStore, (state) => state.clickedCardList);

  return (
    <div className={twx(clickedCardAreaStyle)}>
      {clickedCardList.map(
        (card, index) =>
          (card?.status === "clicked" || card?.status === "moveAway") && (
            <Card key={card.id} card={card} index={index} />
          ),
      )}
    </div>
  );
}
