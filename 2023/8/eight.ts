import { INSTRUCTIONS, MAP } from "./input8";
type AMap = Record<string, { L: string; R: string }>;

const map = MAP.trim()
  .split("\n")
  .map((row) => {
    const [key, tuple] = row.split(" = ");
    const [left, right] = tuple.slice(1, -1).split(", ");
    return [key, left, right];
  })
  .reduce<AMap>((acc, row) => {
    const [key, left, right] = row;
    acc[key] = { L: left, R: right };
    return acc;
  }, {});

function getInstruction(steps: number) {
  return INSTRUCTIONS[steps % INSTRUCTIONS.length] as "L" | "R";
}

const part1 = () => {
  let steps = 0;
  let position = "AAA";
  while (position !== "ZZZ") {
    const instruction = getInstruction(steps);
    position = map[position][instruction];
    steps++;
  }
  return steps;
};

const isStartingPosition = (pos: string) => pos[2] === "A";
const isEndingPosition = (pos: string) => pos[2] === "Z";

const part2 = () => {
  let positions = Object.keys(map).filter(isStartingPosition);

  const allSteps = positions.map((pos) => {
    let position = pos;
    let steps = 0;
    while (!isEndingPosition(position)) {
      const instruction = getInstruction(steps);
      position = map[position][instruction];
      steps++;
    }
    return steps;
  });

  return allSteps.reduce(lcm, 1);
};

const lcm = (a: number, b: number) => {
  let result = a;
  while (result % b !== 0) {
    result += a;
  }
  return result;
};

console.dir({ part1: part1(), part2: part2() });
