import { useRef, useState } from 'react'
import {PlayerBoard} from './PlayerBoard';
import './App.css'
import { fireAt, setFleetToBoard } from './service';
import { JapanFleet, UsaFleet } from './service/fleets';

function App() {
  const playerOne = setFleetToBoard(JapanFleet);
  const playerTwo = setFleetToBoard(UsaFleet);

  const [currentTurn, setCurrentTurn] = useState<'player1' | 'player2' | 'bot'>('player1')

  const leftFleetRef = useRef(playerOne.fleet);
  const rightFleetRef = useRef(playerTwo.fleet);

  const [leftGameBoard, setLeftGameBoard] =useState(playerOne.board);
  const [rightGameBoard, setRightGameBoard] =useState(playerTwo.board);

  const shotPlayerOneHandler = (r: number, c: number) => {
    const {isHit, board, fleet} = fireAt(rightGameBoard, rightFleetRef.current, r, c);
    setRightGameBoard(board);
    rightFleetRef.current = fleet;
    if (!isHit) setCurrentTurn( 'player2');
  }
  
  const shotPlayerTwoHandler = (r: number, c: number) => {
    const {isHit, board, fleet} = fireAt(leftGameBoard, leftFleetRef.current, r, c);
    setLeftGameBoard(board);
    leftFleetRef.current = fleet;
    if (!isHit) setCurrentTurn( 'player1');
  }

  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-board">
        <PlayerBoard board={leftGameBoard} title='Player #1' onShotHandler={shotPlayerTwoHandler} isDisableForShot={currentTurn === 'player1'} />
        <PlayerBoard board={rightGameBoard} title='Player #2' onShotHandler={shotPlayerOneHandler}  isDisableForShot={currentTurn === 'player2'} />
      </div>
    </>
  )
}

export default App
