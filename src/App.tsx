import { useState } from 'react'
import {PlayerBoard} from './PlayerBoard';
import './App.css'
import { setFleetToBoard } from './service';

function App() {
  const [leftFleet, setLeftFleet] =useState(setFleetToBoard());
  const [rightFleet, setRightFleet] =useState(setFleetToBoard());

  const shotPlayerOneHandler = (r: number, c: number) => {}
  const shotPlayerTwoHandler = (r: number, c: number) => {}

  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-board">
        <PlayerBoard board={leftFleet} title='Player #1' onShotHandler={shotPlayerOneHandler} />
        <PlayerBoard board={rightFleet} title='Player #2' onShotHandler={shotPlayerTwoHandler} />
      </div>
    </>
  )
}

export default App
