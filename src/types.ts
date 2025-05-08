type CellState = "empty" | "ship"

export enum CellStateEnum {
  EMPTY = "empty",
  SHIP = "ship"
}

// type Cell = string
export type Cell = {
  state: CellState;
}
export type Board = Cell[][];