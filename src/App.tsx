import { useRef, useState } from 'react'
import {PlayerBoard} from './PlayerBoard';
import './App.css'
import { fireAt, setFleetToBoard } from './service';
import { JapanFleet, UsaFleet } from './service/fleets';

function App() {
  const playerOne = setFleetToBoard(JapanFleet);
  const playerTwo = setFleetToBoard(UsaFleet);

  const leftFleetRef = useRef(playerOne.fleet);
  const rightFleetRef = useRef(playerTwo.fleet);

  const [leftGameBoard, setLeftGameBoard] =useState(playerOne.board);
  const [rightGameBoard, setRightGameBoard] =useState(playerTwo.board);

  const shotPlayerOneHandler = (r: number, c: number) => {
    const res = fireAt(rightGameBoard, rightFleetRef.current, r, c);
    setRightGameBoard(res.board);
    rightFleetRef.current = res.fleet;
  }
  
  const shotPlayerTwoHandler = (r: number, c: number) => {
    const res = fireAt(leftGameBoard, leftFleetRef.current, r, c);
    setLeftGameBoard(res.board);
    leftFleetRef.current = res.fleet;
  }

  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-board">
        <PlayerBoard board={leftGameBoard} title='Player #1' onShotHandler={shotPlayerTwoHandler} />
        <PlayerBoard board={rightGameBoard} title='Player #2' onShotHandler={shotPlayerOneHandler} />
      </div>
    </>
  )
}

export default App
