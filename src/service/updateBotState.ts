import { directions, TABLE_SIZE } from ".";
import { CellStateEnum, type Board, type BotContext } from "../types";

export const updateBotState = ({
  isHit,
  isSunk,
  board,
  r,
  c,
  botContext,
}: {
  isHit: boolean;
  isSunk: boolean;
  board: Board;
  r: number;
  c: number;
  botContext: BotContext;
}): BotContext => {
  // const botContext = JSON.parse(JSON.stringify(context)) as unknown as BotContext
  const context = structuredClone(botContext);
  console.log({ r, c, context });

  if (isHit && !isSunk) {
    if (context.originHitPoint) {
      // NOT first hit and it's right direction, set the next hit coordination -> r: number, c: number + selected direction
      const indDir = context.directions.findIndex((dir) => dir);
      console.log("indDir", indDir, context.directions);
      const { r: dr, c: dc } = directions[indDir];

      // invalidate all perpendicular directions
      if ([0, 2].includes(indDir)) {
        context.directions[3] = false;
        context.directions[1] = false;
      } else if ([1, 3].includes(indDir)) {
        context.directions[2] = false;
        context.directions[0] = false;
      }

      // check if it possible to make next hit! If not change direction to opposite!
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < TABLE_SIZE &&
        nc >= 0 &&
        nc < TABLE_SIZE &&
        (board[nr][nc].state === CellStateEnum.EMPTY ||
          board[r + dr][c + dc].state === CellStateEnum.SHIP)
      ) {
        context.nextHitCoordinates = { r: nr, c: nc };
      } else {
        let nextDir = undefined;
        if (indDir === 0) {
          context.directions[2] = true;
          context.directions[0] = false;
          nextDir = 2;
        } else if (indDir === 2) {
          context.directions[0] = true;
          context.directions[2] = false;
          nextDir = 0;
        } else if (indDir === 1) {
          context.directions[3] = true;
          context.directions[1] = false;
          nextDir = 3;
        } else if (indDir === 3) {
          context.directions[1] = true;
          context.directions[3] = false;
          nextDir = 1;
        }
        const nor = context.originHitPoint.r + directions[nextDir as number].r;
        const noc = context.originHitPoint.c + directions[nextDir as number].c;
        context.nextHitCoordinates = {
          r: nor,
          c: noc,
        };
      }
    } else {
      // first hit
      context.mode = "target";
      context.originHitPoint = { r, c };
      for (let i = 0; i < directions.length; i++) {
        const { r: dr, c: dc } = directions[i];
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < TABLE_SIZE &&
          nc >= 0 &&
          nc < TABLE_SIZE &&
          (board[nr][nc].state === CellStateEnum.EMPTY ||
            board[nr][nc].state === CellStateEnum.SHIP)
        ) {
          // set current direction, setNextHitCoordinates and break
          context.directions[i] = true;
          context.nextHitCoordinates = {
            r: nr,
            c: nc,
          };
          break;
        }
      }
    }
  }

  if (!isHit && context.originHitPoint) {
    // this direction now is not right -> select another one
    const indDir = context.directions.findIndex((dir) => dir);
    context.directions[indDir] = false;

    for (let i = indDir + 1; i < directions.length; i++) {
      const { r: dr, c: dc } = directions[i];
      console.log("next dir", i);

      const nr = context.originHitPoint.r + dr;
      const nc = context.originHitPoint.c + dc;
      if (
        nr >= 0 &&
        nr < TABLE_SIZE &&
        nc >= 0 &&
        nc < TABLE_SIZE &&
        !board[nr][nc].nearSunk &&
        (board[nr][nc].state === CellStateEnum.EMPTY ||
          board[nr][nc].state === CellStateEnum.SHIP)
      ) {
        // set current direction, setNextHitCoordinates and break
        context.directions[i] = true;
        context.nextHitCoordinates = { r: nr, c: nc };
        break;
      }
    }
  }

  if (isSunk) {
    return {
      mode: "search",
      level: context.level,
      originHitPoint: null,
      nextHitCoordinates: null,
      directions: [undefined, undefined, undefined, undefined],
    };
  }

  return context;
};
