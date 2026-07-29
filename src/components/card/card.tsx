import { useStore } from 'zustand';
import cardStore, { type Card } from '../../store/cardStore';
import { useEffect, useRef } from 'react';

import './card.css';
import { getOrignalPos, twx } from '../../utils';
import { boardConfig } from '../../const';

const cardStyle = {
	box: 'border border-gray-300 bg-red-300 rounded-md shadow-sm',
	font: 'font-bold text-white text-[12px]',
	display: 'flex items-center justify-center',
	cursor: 'cursor-pointer',
};
export default function Card({ card, index }: { card: Card; index?: number }) {
	const {
		id,
		pos: { x, y },
		status,
		type,
	} = card;
	const cardRef = useRef<HTMLDivElement>(null);
	const onClick = useStore(cardStore, (state) => state.onClick);
	const { boardWidth, boardHeight, cardSize, gridSize } = boardConfig;

	useEffect(() => {
		if (status === 'clicked' && cardRef.current) {
			cardRef.current.classList.add('card-clicked-animation');
			const { top, left } = getOrignalPos(x, y, index || 0);
			cardRef.current.style.setProperty('--top', `${top}px`);
			cardRef.current.style.setProperty('--left', `${left}px`);
		}
	}, []);

	return (
		<div
			ref={cardRef}
			style={{
				width: `${cardSize}px`,
				height: `${cardSize}px`,
				top: `${(y * gridSize) % boardHeight}px`,
				left: `${(x * gridSize) % boardWidth}px`,
			}}
			className={twx(
				cardStyle,
				status === 'pending' ? 'absolute' : 'mr-2',
			)}
			onClick={() => onClick(id)}
		>
			{type}
		</div>
	);
}
