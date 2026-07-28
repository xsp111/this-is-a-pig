import { twMerge } from 'tailwind-merge';
import { boardConfig } from './const';

export function getOrignalPos(x: number, y: number, index: number) {
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
