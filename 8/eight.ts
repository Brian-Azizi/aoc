import { INSTRUCTIONS, MAP } from "./input8";
type AMap = Record<string, { L: string; R: string }>;
const part1 = () => {
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

  let steps = 0;
  let position = "AAA";
  while (position !== "ZZZ") {
    const instruction = INSTRUCTIONS[steps % INSTRUCTIONS.length] as "L" | "R";
    position = map[position][instruction];
    steps++;
  }
  return steps;
};

console.dir({ part1: part1() });
