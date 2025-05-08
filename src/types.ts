type CellState = "empty" | "ship" | "hit" | "miss"

export enum CellStateEnum {
  EMPTY = "empty",
  SHIP = "ship",
  HIT = "hit",
  MISS = "miss"
}

// type Cell = string
export type Cell = {
  state: CellState;
}
export type Board = Cell[][];