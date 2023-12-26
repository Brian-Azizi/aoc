import { input16, test16 } from "./input16";
import { sum } from "../utils";

// const INPUT = test16;
const INPUT = input16;

type Direction = "^" | ">" | "v" | "<";
type Cell = "." | "/" | "\\" | "-" | "|";
type Part = {
  cell: Cell;
  rays: Set<Direction>;
};
type Grid = Part[][];
type Ray = {
  i: number;
  j: number;
  direction: Direction;
};

const makeGrid = (input: string): Grid => {
  const GRID: Part[][] = [];
  INPUT.trim()
    .split("\n")
    .forEach((row, i) => {
      GRID.push([]);
      row
        .trim()
        .split("")
        .forEach((cell) => {
          GRID[i].push({ cell: cell as Cell, rays: new Set() });
        });
    });
  return GRID;
};

const getNextRay = ({ i, j, direction }: Ray) => {
  switch (direction) {
    case ">":
      return { i, j: j + 1, direction };
    case "^":
      return { i: i - 1, j, direction };
    case "<":
      return { i, j: j - 1, direction };
    case "v":
      return { i: i + 1, j, direction };
  }
};

const NEXT_DIRECTIONS: Record<Cell, Record<Direction, Direction[]>> = {
  ".": { "^": ["^"], ">": [">"], v: ["v"], "<": ["<"] },
  "/": { "^": [">"], ">": ["^"], v: ["<"], "<": ["v"] },
  "\\": { "^": ["<"], ">": ["v"], v: [">"], "<": ["^"] },
  "-": { "^": ["<", ">"], ">": [">"], v: ["<", ">"], "<": ["<"] },
  "|": { "^": ["^"], ">": ["^", "v"], v: ["v"], "<": ["^", "v"] },
};

const getDimensions = (input: string): [number, number] => {
  const rows = input.trim().split("\n");
  return [rows.length, rows[0].length];
};

const followRay = (grid: Grid) => (ray: Ray) => {
  const N = grid.length;
  const M = grid[0].length;

  const { i, j, direction } = ray;
  if (i < 0 || i >= N || j < 0 || j >= M) return;

  const { cell, rays } = grid[i][j];
  if (rays.has(direction)) return;
  rays.add(direction);

  const nextRays: Ray[] = NEXT_DIRECTIONS[cell][direction].map((d) =>
    getNextRay({ i, j, direction: d }),
  );
  nextRays.forEach(followRay(grid));
};

function getEnergy(grid: Grid) {
  return sum(
    grid.map((row) => row.map(({ rays }) => (rays.size ? 1 : 0))).flat(),
  );
}

const computeEnergy = (startRay: Ray) => {
  const grid = makeGrid(INPUT);

  followRay(grid)(startRay);

  return getEnergy(grid);
};

const part1 = () => computeEnergy({ i: 0, j: 0, direction: ">" });

const part2 = () => {
  const [N, M] = getDimensions(INPUT);
  let energies: number[] = [];

  for (let i = 0; i < N; i++) {
    energies.push(computeEnergy({ i, j: 0, direction: ">" }));
    energies.push(computeEnergy({ i, j: M - 1, direction: "<" }));
  }

  for (let j = 0; j < M; j++) {
    energies.push(computeEnergy({ i: 0, j, direction: "v" }));
    energies.push(computeEnergy({ i: N - 1, j, direction: "^" }));
  }

  return Math.max(...energies);
};

console.log({ part1: part1(), part2: part2() });
