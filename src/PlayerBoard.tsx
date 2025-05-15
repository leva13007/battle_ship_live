import { CellStateEnum, type Board, type PlayerType } from "./types";
import { TABLE_SIZE } from "./service";

type Props = {
  board: Board;
  title: PlayerType | null;
  onShotHandler: (r: number, c: number) => void;
  isDisableForShot: boolean;
  gameBoardFog: boolean;
  setGameBoardFog: (status: boolean) => void;
  players: PlayerType[];
  setPlayer: (player: PlayerType) => void;
  isGameStarted: boolean;
};

export const PlayerBoard: React.FC<Props> = ({
  board,
  title,
  onShotHandler,
  isDisableForShot,
  gameBoardFog,
  setGameBoardFog,
  players,
  setPlayer,
  isGameStarted,
}) => (
  <section className="board-player">
    <h2 className="board-title">{title ?? "Please select the player"}</h2>
    <div className="board-control">
      <button className="btn-action" onClick={() => setPlayer(players[0])} disabled={isGameStarted}>
        <i className="fa-solid fa-person"></i>
      </button>
      <button className="btn-action" onClick={() => setPlayer(players[1])} disabled={isGameStarted}>
        <i className="fa-solid fa-robot"></i>
      </button>
    </div>
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
          <div className="board-cell-scale">{String.fromCharCode(65 + i)}</div>
          {r.map((c, j) => {
            const className = `board-cell ${c.state} ${c.nearSunk ? 'nearSunk' : ''}`
            return (
              <button
                disabled={c.state === CellStateEnum.SUNK || c.state === CellStateEnum.HIT || c.state === CellStateEnum.MISS || isDisableForShot}
                key={`${i}-${j}`}
                className={className}
                onClick={() => onShotHandler(i, j)}
              >
                {!gameBoardFog && c.state === CellStateEnum.SHIP && <div className="ship"></div>}
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
      <button className="btn-action" onClick={() => setGameBoardFog(!gameBoardFog)}>
        {
          gameBoardFog ? (
            <>
              <i className="fa-regular fa-eye"></i> <span className="action-text">Show the fleet</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-eye"></i> <span className="action-text">Hide the fleet</span>
            </>
          )
        }
      </button>
    </div>
  </section>
);
