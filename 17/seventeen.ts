import { input17, small17, test17 } from "./input-17";
import { getDimensions, toInt } from "../utils";

// const INPUT = input17
const INPUT = test17;
// const INPUT = small17;

export type Direction = "^" | ">" | "v" | "<";
type Hist = {
  directions: Direction[];
  positions: [number, number][];
};
type Cell = {
  cost: number;
  i: number;
  j: number;
};
type Grid = Cell[][];

const GRID: Grid = INPUT.trim()
  .split("\n")
  .map((row, i) =>
    row
      .trim()
      .split("")
      .map((cost, j) => ({ cost: toInt(cost), i, j })),
  );
const [N, M] = getDimensions(GRID);

const part1 = () => {};

export const isValid = (hist: Direction[]) => {
  const MAX_SEQ = 3;
  let seq = 1;
  const forbidden: Record<Direction, Direction> = {
    "^": "v",
    ">": "<",
    v: "^",
    "<": ">",
  };
  for (let i = 1; i < hist.length; i++) {
    if (hist[i] === forbidden[hist[i - 1]]) return false;
    if (hist[i] === hist[i - 1]) seq++;
    else seq = 1;
    if (seq > MAX_SEQ) return false;
  }
  return true;
};

function isEnd(i: number, j: number) {
  return i === N - 1 && j === M - 1;
}

function isOob(i: number, j: number) {
  return i < 0 || j < 0 || i >= N || j >= M;
}

const VISITS: Record<string, boolean> = {};

export const getHistKey = (hist: Direction[]): string => {
  const l = hist.length;
  const lastMove = hist[l - 1];
  if (!lastMove) return "*";
  if (lastMove !== hist[l - 2]) return lastMove;
  else if (lastMove !== hist[l - 3]) return lastMove + lastMove;
  else if (lastMove !== hist[l - 4]) return lastMove + lastMove + lastMove;
  else {
    throw new Error("histkey");
  }
};
const hasVisited = (i: number, j: number, hist: Direction[]): boolean => {
  return VISITS[`${i}-${j}-${getHistKey(hist)}`];
};
const visit = (i: number, j: number, hist: Direction[]): void => {
  VISITS[`${i}-${j}-${getHistKey(hist)}`] = true;
};

const computeCost = (i: number, j: number, hist: Direction[]): number => {
  if (!isValid(hist)) return Infinity;
  if (isOob(i, j)) return Infinity;

  if (hasVisited(i, j, hist)) return Infinity;

  visit(i, j, hist);

  const cost = GRID[i][j].cost;
  if (isEnd(i, j)) return cost;

  const up = cost + computeCost(i - 1, j, [...hist, "^"]);
  const right = cost + computeCost(i, j + 1, [...hist, ">"]);
  const down = cost + computeCost(i + 1, j, [...hist, "v"]);
  const left = cost + computeCost(i, j - 1, [...hist, "<"]);

  // console.log({ pos: [i, j], hist: hist.join(""), up, right, down, left });

  return Math.min(up, right, down, left);
};

console.log(INPUT);
console.log(computeCost(0, 0, []));
