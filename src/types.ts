type CellState = "empty" | "ship" | "hit" | "miss" | "sunk"

export enum CellStateEnum {
  EMPTY = "empty",
  SHIP = "ship",
  HIT = "hit",
  MISS = "miss",
  SUNK = "sunk"
}

// type Cell = string
export type Cell = {
  state: CellState;
}
export type Board = Cell[][];

export type ShipDefinition = {
  id: number;
  name: string;
  size: number; // 4 | 3 | 2 | 1
  coordinates: {r: number; c:number}[];
  hits: number;
  isSunk: boolean;
}