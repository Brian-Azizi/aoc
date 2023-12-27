import { input17, medium17, small17, test17 } from "./input-17";
import { getDimensions, sum, toInt, transpose } from "../utils";
import * as child_process from "child_process";

// const INPUT = input17
const INPUT = test17;
// const INPUT = small17;
// const INPUT = medium17;

export type Direction = "^" | ">" | "v" | "<";
type Hist = {
  directions: Direction[];
  positions: [number, number][];
  costs: number[];
};
type Cell = {
  cost: number;
  i: number;
  j: number;
};
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
export const isValid = (hist: Direction[]) => {
  const MAX_SEQ = 3;
  let seq = 1;

  for (let i = 1; i < hist.length; i++) {
    if (hist[i] === FORBIDDEN_MOVE[hist[i - 1]]) return false;
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
const getCacheKey =
  (advanced: boolean) =>
  (i: number, j: number, hist: Direction[]): string => {
    return `${i}-${j}-${getHistKey(advanced)(hist)}`;
  };
const hasVisited =
  (visits: Record<string, boolean>) =>
  (i: number, j: number, hist: Direction[]): boolean => {
    return visits[getCacheKey(true)(i, j, hist)];
  };
const visit =
  (visits: Record<string, boolean>) =>
  (i: number, j: number, hist: Direction[]): void => {
    visits[getCacheKey(true)(i, j, hist)] = true;
  };
let COUNT = 0;
const CACHE: Record<string, number> = {};
const computeCost = (
  i: number,
  j: number,
  hist: Readonly<Hist>,
  visits: Record<string, boolean>,
): number => {
  COUNT++;
  if (COUNT === 90) throw new Error();

  const { directions, positions, costs } = hist;

  if (!isValid(directions)) return Infinity;
  if (isOob(i, j)) return Infinity;

  if (hasVisited(visits)(i, j, directions)) return Infinity;
  visit(visits)(i, j, directions);

  if (CACHE[getCacheKey(false)(i, j, directions)]) {
    return CACHE[getCacheKey(false)(i, j, directions)];
  }
  console.log([i, j, visits]);

  const cost = GRID[i][j];
  if (isEnd(i, j)) {
    renderHist(hist);
    return cost;
  }

  const right =
    cost +
    computeCost(
      i,
      j + 1,
      {
        directions: [...directions, ">"],
        positions: [...positions, [i, j + 1]],
        costs: [...costs, cost],
      },
      { ...visits },
    );

  const down =
    cost +
    computeCost(
      i + 1,
      j,
      {
        directions: [...directions, "v"],
        positions: [...positions, [i + 1, j]],
        costs: [...costs, cost],
      },
      { ...visits },
    );
  const left =
    cost +
    computeCost(
      i,
      j - 1,
      {
        directions: [...directions, "<"],
        positions: [...positions, [i, j - 1]],
        costs: [...costs, cost],
      },
      { ...visits },
    );

  const up =
    cost +
    computeCost(
      i - 1,
      j,
      {
        directions: [...directions, "^"],
        positions: [...positions, [i - 1, j]],
        costs: [...costs, cost],
      },
      { ...visits },
    );

  const result = Math.min(up, right, down, left);
  CACHE[getCacheKey(false)(i, j, directions)] = result;
  console.log([i, j], CACHE);
  return result;
};

const renderHist = (hist: Hist) => {
  const map = INPUT.trim()
    .split("\n")
    .map((row) =>
      row
        .trim()
        .split("")
        .map((cost) => cost),
    );

  hist.positions.forEach((p, i) => {
    // if (i === 0) return;
    map[p[0]][p[1]] += hist.directions[i] ?? "";
  });

  console.log("\n");
  console.log(
    map.map((s) => s.map((g) => g.padEnd(6, " ")).join("")).join("\n"),
  );
  console.log(sum(hist.costs));
};

console.log(INPUT);
console.log(
  computeCost(0, 0, { directions: [], costs: [], positions: [[0, 0]] }, {}),
);
