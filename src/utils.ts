import { twMerge } from "tailwind-merge";
import { boardConfig } from "@const";
import type { Card } from "@store/gameStore";

export function getOriginalPos(x: number, y: number, index: number) {
  const { boardHeight, gridSize } = boardConfig;

  return {
    top: -10 - (boardHeight - y * gridSize),
    left: (x - index) * gridSize,
  };
}

export function twx(
  defaultConfig: Record<string, string>,
  ...classNames: string[]
) {
  return twMerge(...Object.values(defaultConfig), ...classNames);
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
