import Board from "./components/board";
import Modal from "./components/modal";
import useGenerateCards from "./hooks/useGenerateCards";
import { twx } from "./utils";

const appStyles = {
  box: "w-screen h-screen p-4",
  color: "bg-gray-200",
  display: "flex flex-col items-center",
};

export default function App() {
  const { gameStatus, setGameStatus } = useGenerateCards();
  return (
    <>
      <div className={twx(appStyles)}>
        <Board />
      </div>
      <Modal
        onClose={() => setGameStatus("playing")}
        open={gameStatus !== "playing"}
      >
        {gameStatus === "won" && (
          <div>
            <h1>Congratulations!</h1>
            <p>You won the game!</p>
          </div>
        )}
        {gameStatus === "lost" && (
          <div className="text-red-400 font-bold">
            <h1>Sorry</h1>
            <p>You lost the game!</p>
          </div>
        )}
      </Modal>
    </>
  );
}
