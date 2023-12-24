import { input12, test12 } from "./input12";
import { memoize, sum } from "../utils";
function split(line: string): [string, number[]] {
  const [row, group] = line.split(" ");
  return [row, group.split(",").map((x) => parseInt(x, 10))];
}

function unSplit(row: string, group: number[]): string {
  return [row, group.join(",")].join(" ");
}

const replaceDots = (row: string) => row.replace(/\.+/g, ".");

const innerSolve = memoize((row: string, runs: number[]): number => {
  if (runs.length === 0) {
    return Number(!row.includes("#"));
  }
  if (row.length === 0) {
    return Number(runs.length === 0);
  }

  if (row.length < sum(runs) + runs.length - 1) {
    return 0;
  }

  if (row[0] === "#") {
    const [run, ...leftOver] = runs;
    if (row[run] === "#") return 0;
    for (let i = 0; i < run; i++) {
      if (row[i] === ".") return 0;
    }

    return innerSolve(row.slice(run + 1), leftOver);
  }

  if (row[0] === ".") {
    return innerSolve(row.slice(1), runs);
  }

  return (
    innerSolve("#" + row.slice(1), runs) + innerSolve("." + row.slice(1), runs)
  );
});

export const solve = (input: string, i?: any): number => {
  console.log(i);
  const [row, group] = split(input);
  return innerSolve(row, group);
};

const input = input12
  .trim()
  .split("\n")
  .map((row) => {
    const [r, g] = split(row);
    return unSplit(replaceDots(r), g);
  });

const part1 = input.map(solve).reduce((a, n) => a + n, 0);

const fullInput = input.map((i) => {
  const [r, g] = i.split(" ");
  const row = [r, r, r, r, r].join("?");
  const groups = [g, g, g, g, g].join(",");
  return [row, groups].join(" ");
});

const part2 = fullInput.map(solve).reduce((a, n) => a + n, 0);

console.dir({ part1, part2 }, { depth: null });
