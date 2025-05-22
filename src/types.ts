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
  r: number;
  c: number;
  state: CellState;
  nearSunk: boolean;
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

export type PlayerType = "player1" | "player2" | "bot1" | "bot2";

export type BotContext = {
  mode: 'search' | 'target';
  level: 0 | 1;
  originHitPoint: {
    r: number;
    c: number;
  } | null;
  nextHitCoordinates: {
    r: number;
    c: number;
  } | null;
  directions: [boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined];
}

export type Nation = 'ukraine' | 'japan' | 'usa' | 'uk' | 'france' | 'germany';