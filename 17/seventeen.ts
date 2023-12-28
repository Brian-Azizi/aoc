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

const nextCoord =
  (dir: Direction) =>
  ([i, j]: [number, number]) => {
    switch (dir) {
      case "<":
        return [i, j - 1];
      case ">":
        return [i, j + 1];
      case "^":
        return [i - 1, j];
      case "v":
        return [i + 1, j];
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

  function update(node: {
    i: number;
    j: number;
    newHistory: string;
    currentHistory: string;
    newDistance: number;
    currentDistance: number;
  }) {
    grid[node.i][node.j].distance = node.newDistance;
    grid[node.i][node.j].history = node.newHistory;
    grid[node.i][node.j].visited = false;
    done = false;
  }

  const checkNext = (direction: Direction) => (i: number, j: number) => {
    const node = grid[i][j];
    const [n, nn, nnn] = getNext(direction)(i, j, node.history, node.distance);
    // console.log([i, j], n, nn, nnn);

    if (nnn) {
      if (nnn.newDistance < nnn.currentDistance) {
        update(nnn);
        update(nn);
        update(n);
      } else return;
    } else if (nn) {
      if (nn.newDistance < nn.currentDistance) {
        update(nn);
        update(n);
      } else return;
    } else if (n) {
      if (n.newDistance < n.currentDistance) {
        update(n);
      } else return;
    }
  };

  const getNext =
    (direction: Direction) =>
    (
      i: number,
      j: number,
      hist: string,
      dist: number,
    ): {
      i: number;
      j: number;
      newHistory: string;
      currentHistory: string;
      newDistance: number;
      currentDistance: number;
    }[] => {
      const [newI, newJ] = nextCoord(direction)([i, j]);
      if (isOob(newI, newJ)) {
        return [];
      }

      const neighbour = grid[newI][newJ];
      const currentDistance = neighbour.distance;
      const newDistance = dist + neighbour.cost;
      const newHist = hist + direction;

      if (!isValid(newHist)) {
        return [
          {
            i: newI,
            j: newJ,
            newDistance: Infinity,
            currentDistance,
            currentHistory: neighbour.history,
            newHistory: newHist,
          },
        ];
      }

      const nextNeighbours = getNext(direction)(
        newI,
        newJ,
        newHist,
        newDistance,
      );

      return [
        {
          i: newI,
          j: newJ,
          newDistance,
          currentDistance,
          currentHistory: neighbour.history,
          newHistory: newHist,
        },
        ...nextNeighbours,
      ];
    };

  let iters = 0;
  while (!done) {
    iters++;
    done = true;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        grid[i][j].visited = true;

        checkNext("^")(i, j);
        checkNext("<")(i, j);
        checkNext(">")(i, j);
        checkNext("v")(i, j);
      }
    }
  }
  console.log(grid);
  console.log(iters);
};

part1();
