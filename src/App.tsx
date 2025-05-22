import { useEffect, useRef, useState } from "react";
import { PlayerBoard } from "./PlayerBoard";
import "./App.css";
import { fireAt, getCoordinatesForShot, setFleetToBoard } from "./service";
import { JapanFleet, nationFleet, UsaFleet } from "./service/fleets";
import { type Board, type Nation, type PlayerType, type ShipDefinition } from "./types";
// import { mockBoard, mockFleet } from "./service/mock";
import { Bot } from "./service/Bot";

function App() {
  const [currentTurn, setCurrentTurn] = useState<PlayerType | null>(null);
  const [player1, setPlayer1] = useState<PlayerType | null>(null);
  const [player2, setPlayer2] = useState<PlayerType | null>(null);

  const [nation1, setNation1] = useState<Nation | null>(null);
  const [nation2, setNation2] = useState<Nation | null>(null);

  const gameConfig = useRef<{
    isGameStarted: boolean;
    isGameOver: boolean;
    winner: PlayerType | null;
  }>({
    isGameStarted: false,
    isGameOver: false,
    winner: null,
  });

  const leftFleetRef = useRef<ShipDefinition[]>([]);
  const rightFleetRef = useRef<ShipDefinition[]>([]);

  const [leftGameBoard, setLeftGameBoard] = useState<Board>([]);
  const [rightGameBoard, setRightGameBoard] = useState<Board>([]);

  const [leftGameBoardFog, setLeftGameBoardFog] = useState(false);
  const [rightGameBoardFog, setRightGameBoardFog] = useState(false);

  const bot1 = useRef(new Bot("bot1"));
  const bot2 = useRef(new Bot("bot2"));

  const shotPlayerOneHandler = (r: number, c: number) => {
    if (!player1 || !player2) return;
    const { isHit, board, fleet, isSunk } = fireAt(
      rightGameBoard,
      rightFleetRef.current,
      r,
      c
    );
    setRightGameBoard(board);
    rightFleetRef.current = fleet;

    if (!isHit) setCurrentTurn(player2);

    if (player1 === "bot1") {
      bot1.current.updateAfterShot({
        isHit,
        isSunk,
        r,
        c,
        board: rightGameBoard,
      });
    }
  };

  const shotPlayerTwoHandler = (r: number, c: number) => {
    if (!player1 || !player2) return;
    const { isHit, board, fleet, isSunk } = fireAt(
      leftGameBoard,
      leftFleetRef.current,
      r,
      c
    );
    setLeftGameBoard(board);
    leftFleetRef.current = fleet;
    if (!isHit) setCurrentTurn(player1);

    if (player2 === "bot2") {
      bot2.current.updateAfterShot({
        isHit,
        isSunk,
        r,
        c,
        board: leftGameBoard,
      });
    }
  };

  const winRightPlayer = leftFleetRef.current?.every((ship) => ship.isSunk);
  const winLeftPlayer = rightFleetRef.current?.every((ship) => ship.isSunk);

  if (leftFleetRef.current.length > 0 && winRightPlayer) {
    gameConfig.current.isGameOver = true;
    gameConfig.current.winner = player2;
  } else if (rightFleetRef.current.length && winLeftPlayer) {
    gameConfig.current.isGameOver = true;
    gameConfig.current.winner = player1;
  }

  const resetGame = () => {
    if (!player1 || !player2) return;
    gameConfig.current.isGameOver = false;
    gameConfig.current.winner = null;
    const playerOne = setFleetToBoard(nationFleet[nation1!]);
    const playerTwo = setFleetToBoard(nationFleet[nation2!]);
    console.log("reset");
    if (gameConfig.current.winner === player1) {
      setCurrentTurn(player2);
    } else {
      setCurrentTurn(player1);
    }
    setLeftGameBoard(playerOne.board);
    setRightGameBoard(playerTwo.board);
    leftFleetRef.current = playerOne.fleet;
    rightFleetRef.current = playerTwo.fleet;

    // todo - tidy up after bots
    bot1.current.reset();
    bot2.current.reset();
  };

  useEffect(() => {
    if (gameConfig.current.isGameOver) return;
    if (currentTurn === "bot1") {
      const randomCell = getCoordinatesForShot({
        board: rightGameBoard,
        context: bot1.current.getContext(),
      });
      shotPlayerOneHandler(randomCell.r, randomCell.c);
    } else if (currentTurn === "bot2") {
      const randomCell = getCoordinatesForShot({
        board: leftGameBoard,
        context: bot2.current.getContext(),
      });
      shotPlayerTwoHandler(randomCell.r, randomCell.c);
    }
  }, [currentTurn, leftGameBoard, rightGameBoard]);

  const disabledStartTheGame = !player1 || !player2 || !nation1 || !nation2;

  const startTheGame = () => {
    const playerOne = setFleetToBoard(nationFleet[nation1!]);
    const playerTwo = setFleetToBoard(nationFleet[nation2!]);

    leftFleetRef.current = playerOne.fleet;
    rightFleetRef.current = playerTwo.fleet;

    setLeftGameBoard(playerOne.board);
    setRightGameBoard(playerTwo.board);

    gameConfig.current.isGameStarted = true;

    // setRandom game starter
    setCurrentTurn(player1);
  };

  return (
    <>
      <h1>Battleship</h1>
      <div className="game-status">
        <h2>
          {!gameConfig.current.isGameStarted && (
            <button
              disabled={disabledStartTheGame}
              className="btn-action"
              onClick={startTheGame}
            >
              Start the Game!
            </button>
          )}
          {gameConfig.current.isGameOver && (
            <>
              <span>Winner is {gameConfig.current.winner}</span>{" "}
              <button className="btn-action" onClick={resetGame}>
                Reset
              </button>
            </>
          )}
          {!gameConfig.current.isGameOver &&
            gameConfig.current.isGameStarted && (
              <>Current shot: {currentTurn}</>
            )}
        </h2>
      </div>
      <div className="game-board">
        <PlayerBoard
          board={leftGameBoard}
          player={player1}
          onShotHandler={shotPlayerTwoHandler}
          isDisableForShot={
            gameConfig.current.isGameOver ||
            !gameConfig.current.isGameStarted ||
            currentTurn === player1
          }
          gameBoardFog={leftGameBoardFog}
          setGameBoardFog={setLeftGameBoardFog}
          players={["player1", "bot1"]}
          setPlayer={setPlayer1}
          isGameStarted={gameConfig.current.isGameStarted}
          bot={bot1.current}
          nation={nation1}
          setNation={setNation1}
          fleet={leftFleetRef.current}
        />
        <PlayerBoard
          board={rightGameBoard}
          player={player2}
          onShotHandler={shotPlayerOneHandler}
          isDisableForShot={
            gameConfig.current.isGameOver ||
            !gameConfig.current.isGameStarted ||
            currentTurn === player2
          }
          gameBoardFog={rightGameBoardFog}
          setGameBoardFog={setRightGameBoardFog}
          players={["player2", "bot2"]}
          setPlayer={setPlayer2}
          isGameStarted={gameConfig.current.isGameStarted}
          bot={bot2.current}
          nation={nation2}
          setNation={setNation2}
          fleet={rightFleetRef.current}
        />
      </div>
      <footer>
        <i className="fa-regular fa-copyright"></i> ZloyLeva 2025
      </footer>
    </>
  );
}

export default App;
