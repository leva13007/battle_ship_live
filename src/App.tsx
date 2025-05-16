import { useEffect, useRef, useState } from "react";
import { PlayerBoard } from "./PlayerBoard";
import "./App.css";
import { directions, fireAt, setFleetToBoard, TABLE_SIZE } from "./service";
import { JapanFleet, UsaFleet } from "./service/fleets";
import { CellStateEnum, type Board, type PlayerType } from "./types";
import { mockBoard, mockFleet } from "./service/mock";

function App() {
  let playerOne = setFleetToBoard(JapanFleet);
  let playerTwo = setFleetToBoard(UsaFleet);

  const [currentTurn, setCurrentTurn] = useState<PlayerType | null>(null);
  const [player1, setPlayer1] = useState<PlayerType | null>(null); // "player1" | "bot1"
  const [player2, setPlayer2] = useState<PlayerType | null>(null); // "player2" | "bot2"

  const [bot1Level, setBot1Level] = useState<0 | 1>(0);
  const [bot2Level, setBot2Level] = useState<0 | 1>(1);

  const [bot1Mode, setBot1Mode] = useState<'search' | 'target'>('search');
  const [bot2Mode, setBot2Mode] = useState<'search' | 'target'>('search');

  const originHitPointBot1 = useRef<{r: number; c: number} | null>(null);
  const originHitPointBot2 = useRef<{r: number; c: number} | null>(null);

  const isGameStarted = useRef(false);
  const isGameOver = useRef(false);
  const winner = useRef<PlayerType | null>(null);

  const leftFleetRef = useRef(playerOne.fleet);
  // const rightFleetRef = useRef(playerTwo.fleet);
  const rightFleetRef = useRef(mockFleet);

  const [leftGameBoard, setLeftGameBoard] = useState(playerOne.board);
  // const [rightGameBoard, setRightGameBoard] = useState(playerTwo.board);
  const [rightGameBoard, setRightGameBoard] = useState(mockBoard as Board);

  const [leftGameBoardFog, setLeftGameBoardFog] = useState(false);
  const [rightGameBoardFog, setRightGameBoardFog] = useState(false);

  const targetHitDirectionBot1Ref = useRef<{
    nextHitCoordinates: {r: number; c: number} | null;
    directions: [boolean|undefined, boolean|undefined, boolean|undefined, boolean|undefined]
  }>({
    nextHitCoordinates: null,
    directions: [undefined, undefined, undefined, undefined], // boolean | undefined
  });

  const targetHitDirectionBot2Ref = useRef<{
    nextHitCoordinates: {r: number; c: number} | null;
    directions: [boolean|undefined, boolean|undefined, boolean|undefined, boolean|undefined]
  }>({
    nextHitCoordinates: null,
    directions: [undefined, undefined, undefined, undefined],
  })

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

    if (isHit && !isSunk && player1 === 'bot1' && bot1Level === 1) {
      if (originHitPointBot1.current) {
        // NOT first hit and it's right direction, set the next hit coordination -> r: number, c: number + selected direction
        const indDir = targetHitDirectionBot1Ref.current.directions.findIndex(dir => dir);
        const { r: dr, c: dc } = directions[indDir];

        // invalidate all perpendicular directions
        if ([0,2].includes(indDir)) {
          targetHitDirectionBot1Ref.current.directions[3] = false;
          targetHitDirectionBot1Ref.current.directions[1] = false;
        } else if ([1,3].includes(indDir)) {
          targetHitDirectionBot1Ref.current.directions[2] = false;
          targetHitDirectionBot1Ref.current.directions[0] = false;
        }

        // check if it possible to make next hit! If not change direction to opposite!
        const nr = r+dr;
        const nc = c+dc;
        if (
          nr >= 0 && nr < TABLE_SIZE &&
          nc >= 0 && nc < TABLE_SIZE &&
          (rightGameBoard[nr][nc].state === CellStateEnum.EMPTY || rightGameBoard[r+dr][c+dc].state === CellStateEnum.SHIP)
        ) {
          targetHitDirectionBot1Ref.current.nextHitCoordinates = {r: nr, c: nc};
        } else {
          let nextDir = undefined;
          if(indDir === 0){
            targetHitDirectionBot1Ref.current.directions[2] = true;
            targetHitDirectionBot1Ref.current.directions[0] = false;
            nextDir = 2;
          } else if(indDir === 2){
            targetHitDirectionBot1Ref.current.directions[0] = true;
            targetHitDirectionBot1Ref.current.directions[2] = false;
            nextDir = 0;
          } else if(indDir === 1){
            targetHitDirectionBot1Ref.current.directions[3] = true;
            targetHitDirectionBot1Ref.current.directions[1] = false;
            nextDir = 3;
          } else if(indDir === 3){
            targetHitDirectionBot1Ref.current.directions[1] = true;
            targetHitDirectionBot1Ref.current.directions[3] = false;
            nextDir = 1;
          }
          const nor = originHitPointBot1.current.r + directions[nextDir as number].r;
          const noc = originHitPointBot1.current.c + directions[nextDir as number].c;
          targetHitDirectionBot1Ref.current.nextHitCoordinates = {r: nor, c: noc};
        }

      } else {
        // first hit
        setBot1Mode('target');
        originHitPointBot1.current = {r,c}
        for(let i=0; i< directions.length; i++){
          const { r: dr, c: dc } = directions[i];
          const nr = r+dr;
          const nc = c+dc;
          if (
            nr >= 0 && nr < TABLE_SIZE &&
            nc >= 0 && nc < TABLE_SIZE &&
            (rightGameBoard[nr][nc].state === CellStateEnum.EMPTY || rightGameBoard[nr][nc].state === CellStateEnum.SHIP)
          ) {
            // set current direction, setNextHitCoordinates and break
            targetHitDirectionBot1Ref.current.directions[i] = true;
            targetHitDirectionBot1Ref.current.nextHitCoordinates = {r: nr, c: nc};
            break;
          }
        }
      }
    }

    if (!isHit && player1 === 'bot1' && bot1Level === 1 && originHitPointBot1.current) {
      // this direction now is not right -> select another one
      const indDir = targetHitDirectionBot1Ref.current.directions.findIndex(dir => dir);
      targetHitDirectionBot1Ref.current.directions[indDir] = false;
      console.log("Miss and need to change dir", indDir)
      for(let i=indDir + 1; i< directions.length; i++){
        const { r: dr, c: dc } = directions[i];
        console.log("next dir", i)
        
        const nr = originHitPointBot1.current.r + dr;
        const nc = originHitPointBot1.current.c + dc;
        if (
          nr >= 0 && nr < TABLE_SIZE &&
          nc >= 0 && nc < TABLE_SIZE &&
          !rightGameBoard[nr][nc].nearSunk &&
          (rightGameBoard[nr][nc].state === CellStateEnum.EMPTY || rightGameBoard[nr][nc].state === CellStateEnum.SHIP)
        ) {
          // set current direction, setNextHitCoordinates and break
          targetHitDirectionBot1Ref.current.directions[i] = true;
          targetHitDirectionBot1Ref.current.nextHitCoordinates = {r: nr, c: nc};
          break;
        }
      }
    }

    if (isSunk && player1 === 'bot1' && bot1Level === 1) {
      setBot1Mode('search');
      originHitPointBot1.current = null;
      targetHitDirectionBot1Ref.current = {
        nextHitCoordinates: null,
        directions: [undefined, undefined, undefined, undefined], // boolean | undefined
      }
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
    
    if (isHit && !isSunk && player2 === 'bot2' && bot2Level === 1) {
      if (originHitPointBot2.current) {
        // NOT first hit and it's right direction, set the next hit coordination -> r: number, c: number + selected direction
        const indDir = targetHitDirectionBot2Ref.current.directions.findIndex(dir => dir);
        console.log("indDir", indDir, targetHitDirectionBot2Ref.current.directions)
        const { r: dr, c: dc } = directions[indDir];

        // invalidate all perpendicular directions
        if ([0,2].includes(indDir)) {
          targetHitDirectionBot2Ref.current.directions[3] = false;
          targetHitDirectionBot2Ref.current.directions[1] = false;
        } else if ([1,3].includes(indDir)) {
          targetHitDirectionBot2Ref.current.directions[2] = false;
          targetHitDirectionBot2Ref.current.directions[0] = false;
        }

        // check if it possible to make next hit! If not change direction to opposite!
        const nr = r+dr;
        const nc = c+dc;
        if (
          nr >= 0 && nr < TABLE_SIZE &&
          nc >= 0 && nc < TABLE_SIZE &&
          (leftGameBoard[nr][nc].state === CellStateEnum.EMPTY || leftGameBoard[r+dr][c+dc].state === CellStateEnum.SHIP)
        ) {
          targetHitDirectionBot2Ref.current.nextHitCoordinates = {r: nr, c: nc};
        } else {
          let nextDir = undefined;
          if(indDir === 0){
            targetHitDirectionBot2Ref.current.directions[2] = true;
            targetHitDirectionBot2Ref.current.directions[0] = false;
            nextDir = 2;
          } else if(indDir === 2){
            targetHitDirectionBot2Ref.current.directions[0] = true;
            targetHitDirectionBot2Ref.current.directions[2] = false;
            nextDir = 0;
          } else if(indDir === 1){
            targetHitDirectionBot2Ref.current.directions[3] = true;
            targetHitDirectionBot2Ref.current.directions[1] = false;
            nextDir = 3;
          } else if(indDir === 3){
            targetHitDirectionBot2Ref.current.directions[1] = true;
            targetHitDirectionBot2Ref.current.directions[3] = false;
            nextDir = 1;
          }
          const nor = originHitPointBot2.current.r + directions[nextDir as number].r;
          const noc = originHitPointBot2.current.c + directions[nextDir as number].c;
          targetHitDirectionBot2Ref.current.nextHitCoordinates = {r: nor, c: noc};
        }

      } else {
        // first hit
        setBot2Mode('target');
        originHitPointBot2.current = {r,c}
        for(let i=0; i< directions.length; i++){
          const { r: dr, c: dc } = directions[i];
          const nr = r+dr;
          const nc = c+dc;
          if (
            nr >= 0 && nr < TABLE_SIZE &&
            nc >= 0 && nc < TABLE_SIZE &&
            (leftGameBoard[nr][nc].state === CellStateEnum.EMPTY || leftGameBoard[nr][nc].state === CellStateEnum.SHIP)
          ) {
            // set current direction, setNextHitCoordinates and break
            targetHitDirectionBot2Ref.current.directions[i] = true;
            targetHitDirectionBot2Ref.current.nextHitCoordinates = {r: nr, c: nc};
            break;
          }
        }
      }
    }

    if (!isHit && player2 === 'bot2' && bot2Level === 1 && originHitPointBot2.current) {
      // this direction now is not right -> select another one
      const indDir = targetHitDirectionBot2Ref.current.directions.findIndex(dir => dir);
      targetHitDirectionBot2Ref.current.directions[indDir] = false;
      
      for(let i=indDir + 1; i< directions.length; i++){
        const { r: dr, c: dc } = directions[i];
        console.log("next dir", i)
        
        const nr = originHitPointBot2.current.r + dr;
        const nc = originHitPointBot2.current.c + dc;
        if (
          nr >= 0 && nr < TABLE_SIZE &&
          nc >= 0 && nc < TABLE_SIZE &&
          !leftGameBoard[nr][nc].nearSunk &&
          (leftGameBoard[nr][nc].state === CellStateEnum.EMPTY || leftGameBoard[nr][nc].state === CellStateEnum.SHIP)
        ) {
          // set current direction, setNextHitCoordinates and break
          targetHitDirectionBot2Ref.current.directions[i] = true;
          targetHitDirectionBot2Ref.current.nextHitCoordinates = {r: nr, c: nc};
          break;
        }
      }
    }

    if (isSunk && player2 === 'bot2' && bot2Level === 1) {
      setBot2Mode('search');
      originHitPointBot2.current = null;
      targetHitDirectionBot2Ref.current = {
        nextHitCoordinates: null,
        directions: [undefined, undefined, undefined, undefined], // boolean | undefined
      }
    }
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

    // todo - tidy up after bots
  };

  useEffect(() => {
    if (player1 && player2) {
      setCurrentTurn(player2);
      isGameStarted.current = true;
    }
  }, [player1, player2]);

  useEffect(() => {
    if (isGameOver.current) return;
    if (currentTurn === "bot1") {
      const possibleCells =rightGameBoard
        .flat()
        .filter(
          (cell) =>
            (cell.state === CellStateEnum.EMPTY ||
            cell.state === CellStateEnum.SHIP) && (bot1Level === 1 ? (!cell.nearSunk) : true)
        );
      
      const randomCell =
         bot1Mode === 'search' 
         ? possibleCells[Math.floor(Math.random() * possibleCells.length)] 
         : targetHitDirectionBot1Ref.current.nextHitCoordinates as {r: number; c: number};
      console.log("possibleCells", randomCell)
      shotPlayerOneHandler(randomCell.r, randomCell.c);
    } else if (currentTurn === "bot2") {
      const possibleCells = leftGameBoard
        .flat()
        .filter(
          (cell) =>
            (cell.state === CellStateEnum.EMPTY ||
            cell.state === CellStateEnum.SHIP) && (bot2Level === 1 ? (!cell.nearSunk) : true)
        );
      const randomCell =
         bot2Mode === 'search' 
         ? possibleCells[Math.floor(Math.random() * possibleCells.length)] 
         : targetHitDirectionBot2Ref.current.nextHitCoordinates as {r: number; c: number};
      console.log("possibleCells", randomCell)
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
