import { CellStateEnum, type Board } from "./types";
import { TABLE_SIZE } from "./service";

type Props = {
  board: Board;
  title: string;
  onShotHandler: (r: number, c: number) => void;
};

export const PlayerBoard: React.FC<Props> = ({
  board,
  title,
  onShotHandler,
}) => (
  <section className="board-player">
    <h2 className="board-title">{title}</h2>
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
            const className = `board-cell ${c.state}`
            return (
              <button
                disabled={c.state === CellStateEnum.SUNK || c.state === CellStateEnum.HIT || c.state === CellStateEnum.MISS}
                key={`${i}-${j}`}
                className={className}
                onClick={() => onShotHandler(i, j)}
              >
                {c.state === CellStateEnum.SHIP && <div className="ship"></div>}
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
  </section>
);
