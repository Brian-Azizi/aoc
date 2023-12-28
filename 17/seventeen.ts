import { input17, medium17, small17, test17 } from "./input-17";
import { getDimensions, sum, toInt, transpose } from "../utils";

// const INPUT = input17
const INPUT = test17;
// const INPUT = small17;
// const INPUT = medium17;

export type Direction = "^" | ">" | "v" | "<";

type Grid = number[][];
const GRID: Grid = INPUT.trim()
  .split("\n")
  .map((row) =>
    row
      .trim()
      .split("")
      .map((cost) => toInt(cost)),
  );
const [N, M] = getDimensions(GRID);
const FORBIDDEN_MOVE: Record<Direction, Direction> = {
  "^": "v",
  ">": "<",
  v: "^",
  "<": ">",
};
export const isValid = (hist: string) => {
  const historyArray = hist.split("") as Direction[];
  const MAX_SEQ = 3;
  let seq = 1;

  for (let i = 1; i < historyArray.length; i++) {
    if (historyArray[i] === FORBIDDEN_MOVE[historyArray[i - 1]]) return false;
    if (historyArray[i] === historyArray[i - 1]) seq++;
    else seq = 1;
    if (seq > MAX_SEQ) return false;
  }
  return true;
};

function isOob(i: number, j: number) {
  return i < 0 || j < 0 || i >= N || j >= M;
}

export const getHistKey =
  (simple: boolean) =>
  (hist: Direction[]): string => {
    const l = hist.length;
    const lastMove = hist[l - 1];
    if (!lastMove) return "*";
    const b = hist[l - 2];
    const bb = hist[l - 3];
    const bbb = hist[l - 4];
    const bbbb = hist[l - 5];

    if (lastMove !== b) {
      if (simple || lastMove !== FORBIDDEN_MOVE[bb]) return lastMove;
      else return bb + lastMove;
    } else if (lastMove !== bb) {
      if (simple || lastMove !== FORBIDDEN_MOVE[bbb])
        return lastMove + lastMove;
      else return bbb + lastMove + lastMove;
    } else if (lastMove !== bbb) {
      if (simple || lastMove !== FORBIDDEN_MOVE[bbbb])
        return lastMove + lastMove + lastMove;
      else return bbbb + lastMove + lastMove + lastMove;
    } else {
      throw new Error("histkey");
    }
  };

const part1 = () => {
  const grid = INPUT.trim()
    .split("\n")
    .map((row) =>
      row
        .trim()
        .split("")
        .map((cost) => ({
          cost: toInt(cost),
          distance: Infinity,
          visited: false,
          history: "",
        })),
    );

  grid[0][0].distance = grid[0][0].cost;
  grid[0][0].visited = true;
  let done = false;

  while (!done) {
    done = true;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const node = grid[i][j];
        node.visited = true;

        if (!isOob(i, j + 1) && isValid(node.history + ">")) {
          const right = node.distance + grid[i][j + 1].cost;
          const current = grid[i][j + 1].distance;
          if (right < current) {
            grid[i][j + 1].distance = Math.min(grid[i][j + 1].distance, right);
            grid[i][j + 1].history = node.history + ">";
            grid[i][j + 1].visited = false;
            done = false;
          }
        }
        if (!isOob(i - 1, j) && isValid(node.history + "^")) {
          const up = node.distance + grid[i - 1][j].cost;
          const current = grid[i - 1][j].distance;
          if (up < current) {
            grid[i - 1][j].distance = Math.min(current, up);
            grid[i - 1][j].history = node.history + "^";
            grid[i - 1][j].visited = false;
            done = false;
          }
        }
        if (!isOob(i, j - 1) && isValid(node.history + "<")) {
          const left = node.distance + grid[i][j - 1].cost;
          const current = grid[i][j - 1].distance;
          if (left < current) {
            grid[i][j - 1].distance = Math.min(current, left);
            grid[i][j - 1].history = node.history + "<";
            grid[i][j - 1].visited = false;
            done = false;
          }
        }
        if (!isOob(i + 1, j) && isValid(node.history + "v")) {
          const down = node.distance + grid[i + 1][j].cost;
          const current = grid[i + 1][j].distance;
          if (down < current) {
            grid[i + 1][j].distance = Math.min(current, down);
            grid[i + 1][j].history = node.history + "v";
            grid[i + 1][j].visited = false;
            done = false;
          }
        }
      }
    }
  }
  console.log(grid);
};

part1();
