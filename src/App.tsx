import { useState } from 'react'
import {PlayerBoard} from './PlayerBoard';
import './App.css'
import { setFleetToBoard } from './service';
import { CellStateEnum, type Cell } from './types';

function App() {
  const [leftFleet, setLeftFleet] =useState(setFleetToBoard());
  const [rightFleet, setRightFleet] =useState(setFleetToBoard());

  const shotPlayerOneHandler = (r: number, c: number) => {
    setRightFleet(prevState => {
      const board = prevState.map((row) => row.map((col) => ({...col} as Cell)));
      return board.map((row, i) => row.map((col, j) => {
        return r === i && c === j ? board[i][j].state === CellStateEnum.SHIP ? {state: CellStateEnum.HIT} : {state: CellStateEnum.MISS} : {...col}
      }));
    })
  }
  
  const shotPlayerTwoHandler = (r: number, c: number) => {
    setLeftFleet(prevState => {
      const board = prevState.map((row) => row.map((col) => ({...col} as Cell)));
      return board.map((row, i) => row.map((col, j) => {
        return r === i && c === j ? board[i][j].state === CellStateEnum.SHIP ? {state: CellStateEnum.HIT} : {state: CellStateEnum.MISS} : {...col}
      }));
    })
  }

  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-board">
        <PlayerBoard board={leftFleet} title='Player #1' onShotHandler={shotPlayerTwoHandler} />
        <PlayerBoard board={rightFleet} title='Player #2' onShotHandler={shotPlayerOneHandler} />
      </div>
    </>
  )
}

export default App
