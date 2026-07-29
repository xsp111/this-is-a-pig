import { useStore } from "zustand";
import cardStore, { type Card } from "../../store/cardStore";
import { useEffect, useRef } from "react";

import { getOriginalPos, twx } from "../../utils";
import { boardConfig } from "../../const";

const cardStyle = {
  box: "border border-gray-300 bg-red-300 rounded-md shadow-sm",
  font: "font-bold text-white text-[12px]",
  display: "flex items-center justify-center",
  cursor: "cursor-pointer",
};
export default function Card({ card, index }: { card: Card; index: number }) {
  const {
    id,
    pos: { x, y },
    status,
    type,
  } = card;
  const cardRef = useRef<HTMLDivElement>(null);
  const onClick = useStore(cardStore, (state) => state.onClick);
  const setCardStatus = useStore(cardStore, (state) => state.setCardStatus);
  const checkIsMatched = useStore(cardStore, (state) => state.checkIsMatched);

  const { boardWidth, boardHeight, cardSize, gridSize } = boardConfig;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (status === "clicked") {
      const { top, left } = getOriginalPos(x, y, index || 0);
      card.animate(
        [
          {
            transform: `translateY(${top}px) translateX(${left}px)`,
          },
          {
            transform: "",
          },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
        },
      ).onfinish = () => {
        checkIsMatched(index);
      };
    }
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (status === "moveAway") {
      card.animate(
        [
          {
            transform: `translateX(${-gridSize}px)`,
          },
          {
            transform: "",
          },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
        },
      ).onfinish = () => {
        setCardStatus(id, "clicked");
      };
    }
  }, [status]);

  return (
    <div
      ref={cardRef}
      style={{
        width: `${cardSize}px`,
        height: `${cardSize}px`,
        top: `${(y * gridSize) % boardHeight}px`,
        left: `${(x * gridSize) % boardWidth}px`,
      }}
      className={twx(cardStyle, status === "pending" ? "absolute" : "mr-2")}
      onClick={() => onClick(id)}
    >
      {type}
    </div>
  );
}
