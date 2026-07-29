import { useStore } from "zustand";
import gameStore from "@store/gameStore";
import Card from "@components/card";
import ClickedCardArea from "./clickedCardArea";

export default function Board() {
  const cardList = useStore(gameStore, (state) => state.cardList);

  return (
    <div className="w-[400px] h-[800px] bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
      <div data-content className="w-[358px] h-[600px] pt-[8px] pl-[8px]">
        <div className="w-full h-full relative">
          {cardList.map((card) => card && <Card key={card.id} card={card} />)}
        </div>
      </div>
      <div className="mt-[10px] w-[358px] h-[58px] py-[8px] pl-[8px] bg-blue-200 rounded-md shadow-md">
        <ClickedCardArea />
      </div>
    </div>
  );
}
