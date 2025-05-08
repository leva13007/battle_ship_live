import { type Board } from "../types";

export const TABLE_SIZE = 10;
const table: Board = Array(TABLE_SIZE)
  .fill(null)
  .map(() =>
    Array(TABLE_SIZE)
      .fill(null)
      .map(() => ".")
  );
const FLEET_LAYOUT = [
  { size: 4, count: 1 },
  { size: 3, count: 2 },
  { size: 2, count: 3 },
  { size: 1, count: 4 },
];

const directions = [
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

const getRandomCoordinate = () => Math.floor(Math.random() * TABLE_SIZE);

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

export const setFleetToBoard = (): Board => {
  const board = table.map((r) => r.map((c) => c));
  for (const ship of FLEET_LAYOUT) {
    for (let i = 0; i < ship.count; i++) {
      let place = false;

      while (!place) {
        const row = getRandomCoordinate();
        const col = getRandomCoordinate();
        const directions = getRandomDirections();
        // console.log("directions",directions)
        for (const { r: dr, c: dc } of directions) {
          place = true;
          for (let s = 0; s < ship.size; s++) {
            if (board[row + s * dr]?.[col + s * dc] !== ".") {
              place = false;
              break;
            }
            for (const [mr, mc] of matrix) {
              const nr = row + s * dr + mr;
              const nc = col + s * dc + mc;

              if (nr < 0 || nr === TABLE_SIZE || nc < 0 || nc === TABLE_SIZE)
                continue;
              if (board[nr]?.[nc] !== ".") {
                place = false;
                break;
              }
            }
          }
          // console.log("ship: ", ship.size, place, row, col)
          if (place) {
            for (let s = 0; s < ship.size; s++) {
              board[row + s * dr][col + s * dc] = "S";
              // console.log(row + s * dr, col + s * dc)
            }
          }
          break;
        }
      }
    }
  }
  return board;
};

// const res = setFleetToBoard(table);
// console.log("\n")
// console.log(res.map(r => r.join(' ')).join("\n"))
//yarn create vite . -- --template react-ts
