import { useEffect, useRef, useState } from "react";
import { PlayerBoard } from "./PlayerBoard";
import "./App.css";
import { fireAt, setFleetToBoard } from "./service";
import { JapanFleet, UsaFleet } from "./service/fleets";
import { CellStateEnum, type PlayerType } from "./types";

function App() {
  let playerOne = setFleetToBoard(JapanFleet);
  let playerTwo = setFleetToBoard(UsaFleet);

  const [currentTurn, setCurrentTurn] = useState<PlayerType | null>(null);
  const [player1, setPlayer1] = useState<PlayerType | null>(null); // "player1" | "bot1"
  const [player2, setPlayer2] = useState<PlayerType | null>(null); // "player2" | "bot2"

  const isGameStarted = useRef(false);
  const isGameOver = useRef(false);
  const winner = useRef<PlayerType | null>(null);

  const leftFleetRef = useRef(playerOne.fleet);
  const rightFleetRef = useRef(playerTwo.fleet);

  const [leftGameBoard, setLeftGameBoard] = useState(playerOne.board);
  const [rightGameBoard, setRightGameBoard] = useState(playerTwo.board);

  const [leftGameBoardFog, setLeftGameBoardFog] = useState(false);
  const [rightGameBoardFog, setRightGameBoardFog] = useState(false);

  const shotPlayerOneHandler = (r: number, c: number) => {
    if (!player1 || !player2) return;
    const { isHit, board, fleet } = fireAt(
      rightGameBoard,
      rightFleetRef.current,
      r,
      c
    );
    setRightGameBoard(board);
    rightFleetRef.current = fleet;
    if (!isHit) setCurrentTurn(player2);
  };

  const shotPlayerTwoHandler = (r: number, c: number) => {
    if (!player1 || !player2) return;
    const { isHit, board, fleet } = fireAt(
      leftGameBoard,
      leftFleetRef.current,
      r,
      c
    );
    setLeftGameBoard(board);
    leftFleetRef.current = fleet;
    if (!isHit) setCurrentTurn(player1);
  };

  const winRightPlayer = leftFleetRef.current?.every((ship) => ship.isSunk);
  const winLeftPlayer = rightFleetRef.current?.every((ship) => ship.isSunk);

  if (winRightPlayer) {
    isGameOver.current = true;
    winner.current = player2;
  } else if (winLeftPlayer) {
    isGameOver.current = true;
    winner.current = player1;
  }

  const resetGame = () => {
    if (!player1 || !player2) return;
    isGameOver.current = false;
    winner.current = null;
    playerOne = setFleetToBoard(JapanFleet);
    playerTwo = setFleetToBoard(UsaFleet);
    console.log("reset");
    if (winner.current === player1) {
      setCurrentTurn(player2);
    } else {
      setCurrentTurn(player1);
    }
    setLeftGameBoard(playerOne.board);
    setRightGameBoard(playerTwo.board);
    leftFleetRef.current = playerOne.fleet;
    rightFleetRef.current = playerTwo.fleet;
  };

  useEffect(() => {
    if (player1 && player2) {
      setCurrentTurn(player1);
      isGameStarted.current = true;
    }
  }, [player1, player2]);

  useEffect(() => {
    if (isGameOver.current) return;
    if (currentTurn === "bot1") {
      const possibleCells = rightGameBoard
        .flat()
        .filter(
          (cell) =>
            cell.state === CellStateEnum.EMPTY ||
            cell.state === CellStateEnum.SHIP
        );
      const randomCell =
        possibleCells[Math.floor(Math.random() * possibleCells.length)];
      shotPlayerOneHandler(randomCell.r, randomCell.c);
    } else if (currentTurn === "bot2") {
      const possibleCells = leftGameBoard
        .flat()
        .filter(
          (cell) =>
            cell.state === CellStateEnum.EMPTY ||
            cell.state === CellStateEnum.SHIP
        );
      const randomCell =
        possibleCells[Math.floor(Math.random() * possibleCells.length)];
      shotPlayerTwoHandler(randomCell.r, randomCell.c);
    }
  }, [currentTurn, leftGameBoard, rightGameBoard]);

  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-status">
        <h2>
          {isGameOver.current ? (
            <>
              <span>Winner is {winner.current}</span>{" "}
              <button className="btn-action" onClick={resetGame}>
                Reset
              </button>
            </>
          ) : (
            <>Current shot: {currentTurn}</>
          )}
        </h2>
      </div>
      <div className="game-board">
        <PlayerBoard
          board={leftGameBoard}
          title={player1}
          onShotHandler={shotPlayerTwoHandler}
          isDisableForShot={
            currentTurn === null ||
            player1 === null ||
            currentTurn === player1 ||
            isGameOver.current
          }
          gameBoardFog={leftGameBoardFog}
          setGameBoardFog={setLeftGameBoardFog}
          players={["player1", "bot1"]}
          setPlayer={setPlayer1}
          isGameStarted={isGameStarted.current}
        />
        <PlayerBoard
          board={rightGameBoard}
          title={player2}
          onShotHandler={shotPlayerOneHandler}
          isDisableForShot={
            currentTurn === null ||
            player2 === null ||
            currentTurn === player2 ||
            isGameOver.current
          }
          gameBoardFog={rightGameBoardFog}
          setGameBoardFog={setRightGameBoardFog}
          players={["player2", "bot2"]}
          setPlayer={setPlayer2}
          isGameStarted={isGameStarted.current}
        />
      </div>
    </>
  );
}

export default App;
