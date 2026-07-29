import { useStore } from "zustand";
import gameStore, { type Card } from "@store/gameStore";
import { useEffect, useRef } from "react";

import { getOriginalPos, twx } from "@utils";
import { boardConfig } from "@const";

const cardStyle = {
  box: "border border-gray-300 bg-red-300 rounded-md shadow-sm",
  font: "font-bold text-white text-[12px]",
  display: "flex items-center justify-center",
  cursor: "cursor-pointer",
};
export default function Card({ card, index }: { card: Card; index?: number }) {
  const {
    id,
    pos: { x, y },
    status,
    type,
    clickedPos,
    toDisappear,
  } = card;
  const isPending = status === "pending";
  const cardRef = useRef<HTMLDivElement>(null);
  const onClick = useStore(gameStore, (state) => state.onClick);
  const setClickedCardPos = useStore(
    gameStore,
    (state) => state.setClickedCardPos,
  );
  const checkIsMatched = useStore(gameStore, (state) => state.checkIsMatched);

  const { boardWidth, boardHeight, cardSize, gridSize } = boardConfig;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (status === "clicked") {
      const { top, left } = getOriginalPos(x, y, index || 0);
      const animation = card.animate(
        [
          {
            transform: `translateY(${top}px) translateX(${left}px)`,
          },
          {
            transform: "",
          },
        ],
        {
          duration: 3000,
          easing: "ease-in-out",
        },
      );
      animation.onfinish = () => {
        console.log("click finish", { type });
        if (index !== undefined) checkIsMatched(index);
      };
      animation.oncancel = () => {
        console.log("cancel");
        // setClickedCardPos(id, clickedPos);
      };
      animation.onremove = () => {
        console.log("remove");
        // setClickedCardPos(id, clickedPos);
      };
    }
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (
      index !== undefined &&
      clickedPos !== undefined &&
      index !== clickedPos
    ) {
      const animation = card.animate(
        [
          {
            transform: `translateX(${-gridSize * (index - clickedPos)}px)`,
          },
          {
            transform: "",
          },
        ],
        {
          duration: 3000,
          easing: "ease-in-out",
        },
      );
      animation.onfinish = () => {
        console.log("move finish", { type });
        setClickedCardPos(id, index);
      };
      animation.oncancel = () => {
        console.log("cancel");
        // setClickedCardPos(id, clickedPos);
      };
      animation.onremove = () => {
        console.log("remove");
        // setClickedCardPos(id, clickedPos);
      };
    }
  }, [index]);

  useEffect(() => {
    if (toDisappear) {
      const card = cardRef.current;
      if (!card) return;
      card.animate(
        [
          {},
          {
            scale: 0.5,
            opacity: 0.2,
          },
        ],
        {
          duration: 3000,
          easing: "ease-in-out",
        },
      ).onfinish = toDisappear;
    }
  }, [toDisappear]);

  return (
    <div
      ref={cardRef}
      style={{
        width: `${cardSize}px`,
        height: `${cardSize}px`,
        ...(isPending && {
          top: `${(y * gridSize) % boardHeight}px`,
          left: `${(x * gridSize) % boardWidth}px`,
        }),
      }}
      className={twx(cardStyle, isPending ? "absolute" : "mr-2")}
      onClick={() => onClick(id)}
    >
      {type}
    </div>
  );
}
