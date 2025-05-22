import {
  CellStateEnum,
  type Board,
  type Nation,
  type PlayerType,
  type ShipDefinition,
} from "./types";
import { TABLE_SIZE } from "./service";
import type { Bot } from "./service/Bot";
import { useState } from "react";

type Props = {
  board: Board;
  player: PlayerType | null;
  onShotHandler: (r: number, c: number) => void;
  isDisableForShot: boolean;
  gameBoardFog: boolean;
  setGameBoardFog: (status: boolean) => void;
  players: PlayerType[];
  setPlayer: (player: PlayerType) => void;
  isGameStarted: boolean;
  bot: Bot;
  nation: Nation | null;
  setNation: (nation: Nation) => void;
  fleet: ShipDefinition[];
};

export const PlayerBoard: React.FC<Props> = ({
  board,
  player,
  onShotHandler,
  isDisableForShot,
  gameBoardFog,
  setGameBoardFog,
  players,
  setPlayer,
  isGameStarted,
  bot,
  nation,
  setNation,
  fleet,
}) => {
  const [activeButton, setActiveButton] = useState(0);
  return (
    <section className="board-player">
      {!isGameStarted && (
        <>
          <h2 className="board-title">
            {player ?? "Please select the player"}
          </h2>
          <div className="board-control">
            <button
              className={`btn-action ${activeButton === 1 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(1);
                setPlayer(players[0]);
              }}
              disabled={isGameStarted}
            >
              <i className="fa-solid fa-person"></i> Human
            </button>
            <button
              className={`btn-action ${activeButton === 2 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(2);
                bot.setLevel(0);
                setPlayer(players[1]);
              }}
              disabled={isGameStarted}
            >
              <i className="fa-solid fa-robot"></i> Bot level #0
            </button>
            <button
              className={`btn-action ${activeButton === 3 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(3);
                bot.setLevel(1);
                setPlayer(players[1]);
              }}
              disabled={isGameStarted}
            >
              <i className="fa-solid fa-robot"></i> Bot level #1
            </button>
          </div>
          <ul className="board-control">
            <li>
              <button
                className={`btn-action ${nation === "ukraine" ? "active" : ""}`}
                onClick={() => setNation("ukraine")}
              >
                🇺🇦 Ukraine
              </button>
            </li>
            <li>
              <button
                className={`btn-action ${nation === "japan" ? "active" : ""}`}
                onClick={() => setNation("japan")}
              >
                🇯🇵 Japan
              </button>
            </li>
            <li>
              <button
                className={`btn-action ${nation === "usa" ? "active" : ""}`}
                onClick={() => setNation("usa")}
              >
                🇺🇸 USA
              </button>
            </li>
            <li>
              <button
                className={`btn-action ${nation === "uk" ? "active" : ""}`}
                onClick={() => setNation("uk")}
              >
                🇬🇧 UK
              </button>
            </li>
            <li>
              <button
                className={`btn-action ${nation === "france" ? "active" : ""}`}
                onClick={() => setNation("france")}
              >
                🇫🇷 France
              </button>
            </li>
            <li>
              <button
                className={`btn-action ${nation === "germany" ? "active" : ""}`}
                onClick={() => setNation("germany")}
              >
                🇩🇪 Germany
              </button>
            </li>
          </ul>
        </>
      )}
      {isGameStarted && (
        <>
          <div className="board-grid">
            <div className="board-row">
              {Array.from({ length: TABLE_SIZE + 1 }).map((_, i) => (
                <div key={i} className="board-cell-scale">
                  {i == 0 ? "" : i}
                </div>
              ))}
            </div>
            {board.map((r, i) => (
              <div className="board-row right-border" key={i}>
                <div className="board-cell-scale">
                  {String.fromCharCode(65 + i)}
                </div>
                {r.map((c, j) => {
                  const className = `board-cell ${c.state} ${
                    c.nearSunk ? "nearSunk" : ""
                  }`;
                  return (
                    <button
                      disabled={
                        c.state === CellStateEnum.SUNK ||
                        c.state === CellStateEnum.HIT ||
                        c.state === CellStateEnum.MISS ||
                        isDisableForShot
                      }
                      key={`${i}-${j}`}
                      className={className}
                      onClick={() => onShotHandler(i, j)}
                    >
                      {!gameBoardFog && c.state === CellStateEnum.SHIP && (
                        <div className="ship"></div>
                      )}
                      {c.state === CellStateEnum.MISS && (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                      {c.state === CellStateEnum.HIT && (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                      {c.state === CellStateEnum.SUNK && (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="board-control">
            <button
              className="btn-action"
              onClick={() => setGameBoardFog(!gameBoardFog)}
            >
              {gameBoardFog ? (
                <>
                  <i className="fa-regular fa-eye"></i>{" "}
                  <span className="action-text">Show the fleet</span>
                </>
              ) : (
                <>
                  <i className="fa-regular fa-eye"></i>{" "}
                  <span className="action-text">Hide the fleet</span>
                </>
              )}
            </button>
          </div>
          <ul className="fleet-list">
            {fleet.map((ship) => (
              <li className={`${ship.isSunk ? 'sunk' : ''}`}>
                <span>
                  {Array.from({ length: ship.size }).map((_, i) => (
                    <>
                      {ship.isSunk ? (
                        <i key={i} className="fa-solid fa-square-xmark"></i>
                      ) : (
                        <i key={i} className="fa-solid fa-square"></i>
                      )}
                    </>
                  ))}
                </span>
                <span className="ship-name">{ship.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
