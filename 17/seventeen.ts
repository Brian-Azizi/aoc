import { input17, medium17, small17, test17 } from "./input-17";
import { getDimensions, sum, toInt, transpose } from "../utils";

const INPUT = input17;
// const INPUT = test17;
// const INPUT = small17;
// const INPUT = medium17;

const GRID = INPUT.trim()
  .split("\n")
  .map((row) =>
    row
      .trim()
      .split("")
      .map((cost) => toInt(cost)),
  );

const input = GRID;

const rows = input.length;
const columns = input[0].length;
type Neighbour = Record<string, number>;
const graph: Record<string, { heat: number; neighbors: Neighbour }> = {};
let result = Infinity;

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    const vertical: { heat: number; neighbors: Neighbour } = (graph[
      `vertical(${x},${y})`
    ] = {
      heat: Infinity,
      neighbors: {},
    });
    const horizontal: { heat: number; neighbors: Neighbour } = (graph[
      `horizontal(${x},${y})`
    ] = {
      heat: Infinity,
      neighbors: {},
    });
    for (/* PART 1 */ let i = 0; i <= 3; i++) {
      // for /* PART 2 */ (let i = 4; i <= 10; i++) {
      if (y + i >= 0 && y + i < rows)
        vertical.neighbors[`horizontal(${x},${y + i})`] = Array(i)
          .fill(0)
          .reduce((a, _, j) => a + input[y + j + 1][x], 0);
      if (y - i >= 0 && y - i < rows)
        vertical.neighbors[`horizontal(${x},${y - i})`] = Array(i)
          .fill(0)
          .reduce((a, _, j) => a + input[y - j - 1][x], 0);
      if (x + i >= 0 && x + i < columns)
        horizontal.neighbors[`vertical(${x + i},${y})`] = Array(i)
          .fill(0)
          .reduce((a, _, j) => a + input[y][x + j + 1], 0);
      if (x - i >= 0 && x - i < columns)
        horizontal.neighbors[`vertical(${x - i},${y})`] = Array(i)
          .fill(0)
          .reduce((a, _, j) => a + input[y][x - j - 1], 0);
    }
  }
}

const startingNeighbors = {
  ...graph["horizontal(0,0)"].neighbors,
  ...graph["vertical(0,0)"].neighbors,
};
for (const startingNeighbor of Object.keys(startingNeighbors)) {
  walk(startingNeighbor, startingNeighbors[startingNeighbor]);
}

function walk(neighbor: string, heat: number) {
  if (heat >= Math.min(graph[neighbor].heat, result)) return;
  if (neighbor.split("l")[1] == `(${columns - 1},${rows - 1})`) {
    result = heat;
    return;
  }
  graph[neighbor].heat = heat;
  const neighbors = Object.keys(graph[neighbor].neighbors);
  for (const key of neighbors) {
    walk(key, heat + graph[neighbor].neighbors[key]);
  }
}

console.log(startingNeighbors);
console.log(graph);
console.log(result);
