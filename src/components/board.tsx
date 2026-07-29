import { useStore } from 'zustand';
import cardStore from '../store/cardStore';
import Card from './card/card';
import { useEffect } from 'react';
import { twx } from '../utils';
import gameStatusStore from '../store/gameStatusStore';

export default function Board() {
	const cardList = useStore(cardStore, (state) => state.cardList);

	return (
		<div className='w-[400px] h-[800px] bg-white rounded-xl shadow-lg p-4 flex flex-col items-center'>
			<div data-content className='w-[358px] h-[600px] pt-[8px] pl-[8px]'>
				<div className='w-full h-full relative'>
					{cardList.map(
						(card) =>
							card.status === 'pending' && (
								<Card key={card.id} card={card} />
							),
					)}
				</div>
			</div>
			<div className='mt-[10px] w-[358px] h-[58px] py-[8px] pl-[8px] bg-blue-200 rounded-md shadow-md'>
				<ClickedCardArea />
			</div>
		</div>
	);
}

const clickedCardAreaStyle = {
	box: 'w-full h-full',
	display: 'flex items-center',
};
function ClickedCardArea() {
	const clickedCardList = useStore(
		cardStore,
		(state) => state.clickedCardList,
	);
	const setGameStatus = useStore(
		gameStatusStore,
		(state) => state.setGameStatus,
	);
	const gameStatus = useStore(gameStatusStore, (state) => state.gameStatus);
	const isFailed = gameStatus === 'lost';

	useEffect(() => {
		if (clickedCardList.length === 7) {
			setTimeout(() => {
				setGameStatus('lost');
			}, 500);
		}
	}, [clickedCardList.length]);

	if (isFailed) {
		return (
			<div className='w-full h-full flex items-center justify-center'>
				<span className='text-xl text-red-500'>失败</span>
			</div>
		);
	}

	return (
		<div className={twx(clickedCardAreaStyle)}>
			{clickedCardList.map(
				(card, index) =>
					card.status === 'clicked' && (
						<Card key={card.id} card={card} index={index} />
					),
			)}
		</div>
	);
}
