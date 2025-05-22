import { getCoordinatesForShot } from ".";
import type { Board, BotContext } from "../types";
import { updateBotState } from "./updateBotState";

export class Bot {
  public readonly id: string;
  private context: BotContext;
  constructor(id: string) {
    this.id = id;
    this.context = {
      mode: "search",
      level: 0,
      originHitPoint: null,
      nextHitCoordinates: null,
      directions: [undefined, undefined, undefined, undefined],
    };
  }

  updateAfterShot(params: {
    isHit: boolean;
    isSunk: boolean;
    board: Board;
    r: number;
    c: number;
  }) {
    if (this.context.level === 1)
      this.context = updateBotState({ ...params, botContext: this.context });
  }

  setLevel(level: 0 | 1) {
    this.context.level = level;
  }

  getLevel() {
    return this.context.level;
  }

  getNextShot(board: Board) {
    return getCoordinatesForShot({ board, context: this.context });
  }

  getContext() {
    return this.context;
  }

  reset() {
    this.context = {
      mode: "search",
      level: this.context.level,
      originHitPoint: null,
      nextHitCoordinates: null,
      directions: [undefined, undefined, undefined, undefined],
    };
  }
}
