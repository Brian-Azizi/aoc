import { test14, input14 } from "./input_14";
import { memoize, sum } from "../utils";

const INPUT = test14.trim().split("\n");

export function rotateClockwise(x: string[]): string[] {
  const N = x.length;
  const M = x[0].length;
  const result: string[] = [];
  for (let i = 0; i < M; i++) {
    result.push("");
  }
  for (let i = N - 1; i >= 0; i--) {
    for (let j = 0; j < M; j++) {
      // result[M - j - 1] += x[i][j];
      result[i] += x[i][j];
    }
  }

  return result;
}

const rotateAntiClockwise = (x: string[]): string[] => {
  const N = x.length;
  const M = x[0].length;
  const result: string[] = [];
  for (let i = 0; i < M; i++) {
    result.push("");
  }
  for (let i = N - 1; i >= 0; i--) {
    for (let j = 0; j < M; j++) {
      result[M - j - 1] += x[i][j];
    }
  }

  return result;
};

const innerTilt = memoize((row: string) => {
  let lastBlock = 0;
  const newRow: string[] = new Array(row.length).fill(".");
  for (let i = 0; i < row.length; i++) {
    if (row[i] === "O") {
      newRow[lastBlock] = "O";
      lastBlock++;
    } else if (row[i] === "#") {
      newRow[i] = "#";
      lastBlock = i + 1;
    }
  }
  return newRow.join("");
});

const tiltLeft = memoize((plane: string[]): string[] => plane.map(innerTilt));

const getPositions = (row: string): number[] => {
  let lastBlock = 0;
  const positions: number[] = [];
  for (let i = 0; i < row.length; i++) {
    if (row[i] === "O") {
      positions.push(lastBlock);
      lastBlock++;
    } else if (row[i] === "#") {
      lastBlock = i + 1;
    }
  }

  return positions;
};

const getLoad = (size: number) => (positions: number[]) => {
  let load = 0;
  for (const pos of positions) {
    load += size - pos;
  }
  return load;
};

const DIR = ["U", "R", "D", "L"] as const;
type d = (typeof DIR)[number];

const getTotalLoad = (plane: string[], direction: d): number => {
  let load = 0;
  const getWeight = (i: number, j: number) => {
    switch (direction) {
      case "L":
        return plane[0].length - j;
      case "R":
        return j + 1;
      case "U":
        return plane.length - i;
      case "D":
        return i + 1;
    }
  };
  for (let i = 0; i < plane.length; i++) {
    for (let j = 0; j < plane[0].length; j++) {
      if (plane[i][j] === "O") load += getWeight(i, j);
    }
  }
  return load;
};

const part1 = sum(
  rotateAntiClockwise(INPUT).map(getPositions).map(getLoad(INPUT.length)),
);

console.log(rotateAntiClockwise(INPUT).join("\n"));
console.log("\n");
console.log(INPUT.join("\n"));
console.log("\n");
console.log(rotateClockwise(INPUT).join("\n"));

console.log(part1);

const part2 = () => {
  const CYCLES = 10;
  // const CYCLES = 1000000000;
  let north: d = "U";
  let plane = rotateAntiClockwise(INPUT);
  north = "L";

  for (let i = 0; i < CYCLES; i++) {
    for (let j = 0; j < 4; j++) {
      plane = tiltLeft(plane);
      const load = getTotalLoad(plane, north);
      console.log([i, north, load]);

      plane = rotateClockwise(plane);
      north = DIR[j];
    }
  }
};

part2();
