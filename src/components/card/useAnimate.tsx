import { useStore } from "zustand";
import gameStore, { type Card } from "@store/gameStore";
import { useEffect, useRef } from "react";
import { getAnimatedPos, queueAnimate } from "@utils";
import { boardConfig } from "@const";

export default function useAnimation(card: Card, index?: number) {
  const {
    id,
    pos: { x, y },
    status,
    clickedPos,
    toDisappear,
  } = card;
  const viewRef = useRef<HTMLDivElement>(null);
  const setClickedCardPos = useStore(
    gameStore,
    (state) => state.setClickedCardPos,
  );
  const { gridSize } = boardConfig;

  // 点击时
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (status === "clicked") {
      const { top, left, bias } = getAnimatedPos(x, y, clickedPos);
      view.animate(
        [
          {
            transform: `translateY(${top}px) translateX(${left}px)`,
          },
          {
            transform: `translateX(${bias}px)`,
          },
        ],
        {
          duration: 700,
          easing: "ease-in-out",
          fill: "forwards",
        },
      );
    }
  }, [status]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (
      index !== undefined &&
      clickedPos !== undefined &&
      index !== clickedPos
    ) {
      queueAnimate(
        view,
        [
          {},
          {
            transform: `translateX(${(index + 1) * gridSize}px)`,
          },
        ],
        {
          duration: 300,
          easing: "ease-in-out",
          fill: "forwards",
        },
      ).onfinish = () => {
        setClickedCardPos(id, index);
      };
    }
  }, [index]);

  useEffect(() => {
    if (toDisappear) {
      const view = viewRef.current;
      if (!view) return;
      toDisappear((onfinish) => {
        queueAnimate(
          view,
          [
            {},
            {
              scale: 0.5,
              opacity: 0,
            },
          ],
          {
            duration: 200,
            easing: "ease-in-out",
            fill: "forwards",
          },
        ).onfinish = onfinish;
      });
    }
  }, [toDisappear]);
  return viewRef;
}
