import { useStore } from "zustand";
import gameStore, { type Card } from "@store/gameStore";

import { twx } from "@utils";
import { boardConfig } from "@const";
import useAnimation from "./useAnimate";

const cardStyle = {
  layoutStyle: {
    box: "bg-transparent",
    display: "flex items-center justify-center",
    cursor: "cursor-pointer",
  },
  visionStyle: {
    box: "w-full h-full border border-gray-300 bg-red-300 rounded-md shadow-sm",
    font: "font-bold text-white text-[12px]",
    display: "flex items-center justify-center",
    cursor: "cursor-pointer",
  },
};
export default function Card({ card, index }: { card: Card; index?: number }) {
  const {
    id,
    pos: { x, y },
    status,
    type,
  } = card;
  const isPending = status === "pending";
  const onClick = useStore(gameStore, (state) => state.onClick);
  const viewRef = useAnimation(card, index);

  const { boardWidth, boardHeight, cardSize, gridSize } = boardConfig;
  const style = {
    width: `${cardSize}px`,
    height: `${cardSize}px`,
  };

  return (
    <div
      style={{
        ...style,
        ...(isPending && {
          top: `${(y * gridSize) % boardHeight}px`,
          left: `${(x * gridSize) % boardWidth}px`,
        }),
      }}
      className={twx(cardStyle.layoutStyle, isPending && "absolute")}
      onClick={() => onClick(id)}
    >
      <div
        style={{
          ...style,
          ...(!isPending && {
            left: `${-gridSize}px`,
          }),
        }}
        ref={viewRef}
        className={twx(cardStyle.visionStyle, !isPending && "absolute")}
      >
        {type}
      </div>
    </div>
  );
}
