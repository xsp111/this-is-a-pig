import { useStore } from "zustand";
import cardStore from "../../store/cardStore";
import Card from "../card";
import { twx } from "../../utils";

const clickedCardAreaStyle = {
  box: "w-full h-full",
  display: "flex items-center",
};
export default function ClickedCardArea() {
  const clickedCardList = useStore(cardStore, (state) => state.clickedCardList);

  return (
    <div className={twx(clickedCardAreaStyle)}>
      {clickedCardList.map(
        (card, index) =>
          (card.status === "clicked" || card.status === "moveAway") && (
            <Card key={card.id} card={card} index={index} />
          ),
      )}
    </div>
  );
}
