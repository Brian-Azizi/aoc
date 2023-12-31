import { input18, test18 } from "./input18";
import { toInt } from "../utils";

const INPUT = input18;
// const INPUT = test18;

type Direction = "U" | "D" | "L" | "R";
type HexCode = string;
type Instruction = { direction: Direction; amount: number; color: HexCode };

const PART1_INSTR: Instruction[] = INPUT.trim()
  .split("\n")
  .map((row) => {
    const [direction, amount, hexcode] = row.split(" ");
    return {
      direction: direction as Direction,
      amount: toInt(amount),
      color: hexcode.slice(2, 8),
    };
  });

const PART2_INSTR: Instruction[] = PART1_INSTR.map((instr) => {
  const DIRS: Direction[] = ["R", "D", "L", "U"];
  const { color } = instr;
  const direction = DIRS[toInt(color[5])];
  const amount = parseInt(color.slice(0, 5), 16);
  return { direction, amount, color };
});

const n = ([i, j]: [number, number]) => `${i},${j}`;
const slow = (instructions: Instruction[]) => {
  const head: [number, number] = [0, 0];
  const perimeter: string[] = [n(head)];
  const flows: Record<string, Direction> = {};
  let [minI, maxI, minJ, maxJ] = [0, 0, 0, 0];
  instructions.forEach((instruction) => {
    if (instruction.direction === "U" || instruction.direction === "D") {
      flows[perimeter[perimeter.length - 1]] = instruction.direction;
    }
    for (let k = 0; k < instruction.amount; k++) {
      switch (instruction.direction) {
        case "R": {
          head[1]++;
          break;
        }
        case "L": {
          head[1]--;
          break;
        }
        case "U": {
          head[0]--;
          flows[n(head)] = instruction.direction;
          break;
        }
        case "D": {
          head[0]++;
          flows[n(head)] = instruction.direction;
          break;
        }
      }
      if (head[0] < minI) minI = head[0];
      if (head[0] > maxI) maxI = head[0];
      if (head[1] < minJ) minJ = head[1];
      if (head[1] > maxJ) maxJ = head[1];
      perimeter.push(n(head));
    }
  });

  let area = 0;
  for (let i = minI; i <= maxI; i++) {
    let isInside = false;
    let previousFlow: Direction | null = null;
    for (let j = minJ; j <= maxJ; j++) {
      if (perimeter.includes(n([i, j]))) {
        area++;
        isInside = true;
        previousFlow = flows[n([i, j])];
      } else {
        if (previousFlow && previousFlow === "D") {
          isInside = false;
        }
        if (isInside) {
          area++;
        }
      }
    }
  }

  console.log(area);
};

const solution = (instructions: Instruction[]) => {
  const head: [number, number] = [1, 0];
  let lastFlow: Direction = "U";
  const vertices: [number, number][] = [[...head]];
  let [minI, maxI, minJ, maxJ] = [0, 1, 0, 0];
  instructions.forEach((instruction) => {
    const lastVertex = vertices[vertices.length - 1];
    switch (instruction.direction) {
      case "R": {
        if (lastFlow === "U") {
          lastVertex[0]--;
          head[0]--;
        }
        head[1] += instruction.amount - Number(lastFlow === "D");
        lastFlow = "R";
        break;
      }
      case "D": {
        if (lastFlow === "R") {
          lastVertex[1]++;
          head[1]++;
        }
        head[0] += instruction.amount - Number(lastFlow === "L");
        lastFlow = "D";
        break;
      }
      case "L": {
        if (lastFlow === "D") {
          lastVertex[0]++;
          head[0]++;
        }
        head[1] -= instruction.amount - Number(lastFlow === "U");
        lastFlow = "L";
        break;
      }
      case "U": {
        if (lastFlow === "L") {
          lastVertex[1]--;
          head[1]--;
        }
        head[0] -= instruction.amount - Number(lastFlow === "R");
        lastFlow = "U";
        break;
      }
    }
    if (head[0] < minI) minI = head[0];
    if (head[0] > maxI) maxI = head[0];
    if (head[1] < minJ) minJ = head[1];
    if (head[1] > maxJ) maxJ = head[1];
    vertices.push([...head]);
  });

  let area = 0;
  for (let k = 0; k < vertices.length - 1; k++) {
    area +=
      ((vertices[k][0] + vertices[k + 1][0]) *
        (vertices[k][1] - vertices[k + 1][1])) /
      2;
  }

  return area;
};

console.log({ part1: solution(PART1_INSTR), part2: solution(PART2_INSTR) });
