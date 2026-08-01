import { twMerge } from "tailwind-merge";
import { boardConfig, cardConfig } from "@const";
import type { Card } from "@store/gameStore";

export function getAnimatedPos(x: number, y: number, pos: number | undefined) {
  const { boardHeight, gridSize } = boardConfig;

  return {
    top: -10 - (boardHeight - y * gridSize),
    left: (x + 1) * gridSize,
    bias: ((pos || 0) + 1) * gridSize,
  };
}

export function twx(
  defaultConfig: Record<string, string>,
  ...classNames: (string | false)[]
) {
  return twMerge(
    ...Object.values(defaultConfig),
    ...classNames.filter((className) => className),
  );
}

// get int [min, max)
export function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateCard(type: number, id: number): Card {
  const { col, line } = boardConfig;
  return {
    id,
    pos: {
      x: getRandom(0, col),
      y: getRandom(0, line),
    },
    type,
    status: "pending",
  };
}

export function getMatchPos(type: number, list: Card[]): number {
  const index = list.findLastIndex((item) => item?.type === type);
  return index !== -1 ? index : list.length - 1;
}

export function findMatched(arr: Card[]) {
  const i = arr.findIndex(
    (card, i) =>
      i <= arr.length - cardConfig.groupSize &&
      card.status !== "matched" &&
      card.type === arr[i + 1].type &&
      card.type === arr[i + 2].type,
  );
  return i === -1 ? undefined : i;
}

export function queueAnimate(
  el: HTMLDivElement,
  ...animateParams: Parameters<Animatable["animate"]>
): Animation {
  const keyFrame = new KeyframeEffect(el, ...animateParams);
  const animation = new Animation(keyFrame);
  const startCurAnimate = () => {
    animation.timeline = document.timeline;
    animation.play();
  };
  const existAnimations = el.getAnimations();
  const lastAnimation = existAnimations[existAnimations.length - 1];

  if (
    existAnimations.length > 0 &&
    // 如果已有动画 finished 了，就不用关心了
    lastAnimation.playState !== "finished"
  ) {
    const originalOnfinish = lastAnimation.onfinish;
    lastAnimation.onfinish = (ev) => {
      originalOnfinish?.call(lastAnimation, ev);
      startCurAnimate();
    };
  } else {
    startCurAnimate();
  }
  return animation;
}
