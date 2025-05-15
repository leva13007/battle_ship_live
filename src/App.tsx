import { useRef, useState } from "react";
import { PlayerBoard } from "./PlayerBoard";
import "./App.css";
import { fireAt, setFleetToBoard } from "./service";
import { JapanFleet, UsaFleet } from "./service/fleets";

function App() {
  let playerOne = setFleetToBoard(JapanFleet);
  let playerTwo = setFleetToBoard(UsaFleet);

  const [currentTurn, setCurrentTurn] = useState<"player1" | "player2" | "bot">(
    "player1"
  );
  const isGameOver = useRef(false);
  const winner = useRef<"player1" | "player2" | null>(null);

  const leftFleetRef = useRef(playerOne.fleet);
  const rightFleetRef = useRef(playerTwo.fleet);

  const [leftGameBoard, setLeftGameBoard] = useState(playerOne.board);
  const [rightGameBoard, setRightGameBoard] = useState(playerTwo.board);

  const [leftGameBoardFog, setLeftGameBoardFog] = useState(true);
  const [rightGameBoardFog, setRightGameBoardFog] = useState(true);

  const shotPlayerOneHandler = (r: number, c: number) => {
    const { isHit, board, fleet } = fireAt(
      rightGameBoard,
      rightFleetRef.current,
      r,
      c
    );
    setRightGameBoard(board);
    rightFleetRef.current = fleet;
    if (!isHit) setCurrentTurn("player2");
  };

  const shotPlayerTwoHandler = (r: number, c: number) => {
    const { isHit, board, fleet } = fireAt(
      leftGameBoard,
      leftFleetRef.current,
      r,
      c
    );
    setLeftGameBoard(board);
    leftFleetRef.current = fleet;
    if (!isHit) setCurrentTurn("player1");
  };

  const winRightPlayer = leftFleetRef.current?.every((ship) => ship.isSunk);
  const winLeftPlayer = rightFleetRef.current?.every((ship) => ship.isSunk);

  if (winRightPlayer) {
    isGameOver.current = true;
    winner.current = "player2";
  } else if (winLeftPlayer) {
    isGameOver.current = true;
    winner.current = "player1";
  }

  const resetGame = () => {
    isGameOver.current = false;
    winner.current = null;
    playerOne = setFleetToBoard(JapanFleet);
    playerTwo = setFleetToBoard(UsaFleet);
    console.log("reset")
    if (winner.current === 'player1') {
      setCurrentTurn('player2')
    } else {
      setCurrentTurn('player1')
    }
    setLeftGameBoard(playerOne.board);
    setRightGameBoard(playerTwo.board);
    leftFleetRef.current = playerOne.fleet;
    rightFleetRef.current = playerTwo.fleet;
  }

  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-status">
        <h2>
          {
          isGameOver.current ? (
            <><span>Winner is {winner.current}</span> <button className="btn-action" onClick={resetGame}>Reset</button></>
          ) : (
            <>Current shot: {currentTurn}</>
          )
        }
        </h2>
      </div>
      <div className="game-board">
        <PlayerBoard
          board={leftGameBoard}
          title="Player #1"
          onShotHandler={shotPlayerTwoHandler}
          isDisableForShot={currentTurn === "player1" || isGameOver.current}
          gameBoardFog={leftGameBoardFog}
          setGameBoardFog={setLeftGameBoardFog}
        />
        <PlayerBoard
          board={rightGameBoard}
          title="Player #2"
          onShotHandler={shotPlayerOneHandler}
          isDisableForShot={currentTurn === "player2" || isGameOver.current}
          gameBoardFog={rightGameBoardFog}
          setGameBoardFog={setRightGameBoardFog}
        />
      </div>
    </>
  );
}

export default App;
