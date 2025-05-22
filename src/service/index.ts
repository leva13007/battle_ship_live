import {
  CellStateEnum,
  type Board,
  type BotContext,
  type Cell,
  type ShipDefinition,
} from "../types";

export const TABLE_SIZE = 10;
const table: Board = Array(TABLE_SIZE)
  .fill(null)
  .map((_, r) =>
    Array(TABLE_SIZE)
      .fill(null)
      .map((_, c) => ({
        r,
        c,
        state: CellStateEnum.EMPTY,
        nearSunk: false,
      }))
  );

export const directions = [
  { r: -1, c: 0 },
  { r: 0, c: 1 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
];

const matrix = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const getRandomCoordinate = () => Math.floor(Math.random() * TABLE_SIZE);

const getRandomDirections = () => {
  const copyDirections = [...directions];
  for (let i = copyDirections.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyDirections[i], copyDirections[j]] = [
      copyDirections[j],
      copyDirections[i],
    ];
  }
  return copyDirections;
};

export const setFleetToBoard = (
  fleet: ShipDefinition[]
): { board: Board; fleet: ShipDefinition[] } => {
  const copyFleet = fleet.map(
    (ship) => ({ ...ship, coordinates: [] } as ShipDefinition)
  );
  const board = table.map((r) => r.map((c) => ({ ...c } as Cell)));
  for (const ship of copyFleet) {
    let placed = false;

    while (!placed) {
      const row = getRandomCoordinate();
      const col = getRandomCoordinate();
      const directions = getRandomDirections();

      for (const { r: dr, c: dc } of directions) {
        let canPlace = true;
        for (let s = 0; s < ship.size; s++) {
          if (
            board[row + s * dr]?.[col + s * dc]?.state !== CellStateEnum.EMPTY
          ) {
            canPlace = false;
            break;
          }
          for (const [mr, mc] of matrix) {
            const nr = row + s * dr + mr;
            const nc = col + s * dc + mc;

            if (nr < 0 || nr === TABLE_SIZE || nc < 0 || nc === TABLE_SIZE)
              continue;
            if (board[nr][nc].state !== CellStateEnum.EMPTY) {
              canPlace = false;
              break;
            }
          }
        }

        if (canPlace) {
          for (let s = 0; s < ship.size; s++) {
            board[row + s * dr][col + s * dc].state = CellStateEnum.SHIP;
            ship.coordinates.push({ r: row + s * dr, c: col + s * dc });
          }
          placed = true;
        }
        break;
      }
    }
  }
  return { board, fleet: copyFleet };
};

export const fireAt = (
  board: Board,
  fleet: ShipDefinition[],
  row: number,
  col: number
) => {
  const copyFleet = fleet.map(
    (ship) =>
      ({ ...ship, coordinates: [...ship.coordinates] } as ShipDefinition)
  );
  const copyBoard = board.map((r) => r.map((c) => ({ ...c } as Cell)));

  let isHit = false;
  let isSunk = false;
  copyFleet.forEach((ship) => {
    ship.coordinates.map(({ r, c }) => {
      if (r === row && c === col) {
        isHit = true;

        ship.hits++;

        if (ship.hits === ship.size) {
          ship.isSunk = true;
          isSunk = true;

          ship.coordinates.map(({ r, c }) => {
            copyBoard[r][c].state = CellStateEnum.SUNK;

            matrix.forEach(([dr, dc]) => {
              const nr = r + dr;
              const nc = c + dc;

              if (
                nr >= 0 &&
                nr < TABLE_SIZE &&
                nc >= 0 &&
                nc < TABLE_SIZE &&
                copyBoard[nr][nc].state !== CellStateEnum.SUNK &&
                copyBoard[nr][nc].state !== CellStateEnum.HIT
              ) {
                copyBoard[nr][nc].nearSunk = true;
              }
            });
          });
        } else {
          copyBoard[row][col].state = CellStateEnum.HIT;
        }
      }
    });
  });

  if (!isHit) {
    copyBoard[row][col].state = CellStateEnum.MISS;
  }

  return { board: copyBoard, fleet: copyFleet, isHit, isSunk };
};

export const getCoordinatesForShot = ({
  board,
  context,
}: {
  board: Board;
  context: BotContext;
}) => {
  switch (context.mode) {
    case "target": {
      return context.nextHitCoordinates as { r: number; c: number };
    }
    default: {
      const possibleCells = board
        .flat()
        .filter(
          (cell) =>
            (cell.state === CellStateEnum.EMPTY ||
              cell.state === CellStateEnum.SHIP) &&
            (context.level === 1 ? !cell.nearSunk : true)
        );
      return possibleCells[Math.floor(Math.random() * possibleCells.length)];
    }
  }
};

// const res = setFleetToBoard(table);
// console.log("\n")
// console.log(res.map(r => r.join(' ')).join("\n"))
//yarn create vite . -- --template react-ts
