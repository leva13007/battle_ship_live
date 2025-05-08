import { useState } from 'react'
import {PlayerBoard} from './PlayerBoard';
import './App.css'
import { setFleetToBoard } from './service';

function App() {
  const [leftFleet, setLeftFleet] =useState(setFleetToBoard());
  const [rightFleet, setRightFleet] =useState(setFleetToBoard());
  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-board">
        <PlayerBoard board={leftFleet} title='Player #1' />
        <PlayerBoard board={rightFleet} title='Player #2' />
      </div>
    </>
  )
}

export default App
