import { useState } from 'react'
import './App.css'
import { setFleetToBoard, TABLE_SIZE } from './service';

function App() {
  const [leftFleet, setLeftFleet] =useState(setFleetToBoard());
  const [rightFleet, setRightFleet] =useState(setFleetToBoard());
  return (
    <>
      <h1>Battle ship</h1>
      <div className="game-board">
        <section className='board-player'>
          <h2 className='board-title'>Player #1</h2>
          <div className='board-grid'>
            <div className="board-row">
              {
                Array.from({length: TABLE_SIZE + 1}).map((_, i) => (
                  <div key={i} className='board-cell-scale'>
                    {i == 0 ? '' : i}
                  </div>
                ))
              }
            </div>
            {
              leftFleet.map((r, i) => (
                <div className="board-row right-border" key={i}>
                  <div className='board-cell-scale'>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {
                    r.map((c, j) => (
                      <button key={`${i}-${j}`} className='board-cell'>{c}</button>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </section>
        <section className='board-player'>
          <h2 className='board-title'>Player #2</h2>
          <div className='board-grid'>
            <div className="board-row">
              {
                Array.from({length: TABLE_SIZE + 1}).map((_, i) => (
                  <div key={i} className='board-cell-scale'>
                    {i == 0 ? '' : i}
                  </div>
                ))
              }
            </div>
            {
              rightFleet.map((r, i) => (
                <div className="board-row right-border" key={i}>
                  <div className='board-cell-scale'>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {
                    r.map((c, j) => (
                      <button key={`${i}-${j}`} className='board-cell'>{c}</button>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default App
