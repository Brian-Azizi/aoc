import { input12, test12 } from "./input12";
function split(line: string): [string, number[]] {
  const [row, group] = line.split(" ");
  return [row, group.split(",").map((x) => parseInt(x, 10))];
}

function unSplit(row: string, group: number[]): string {
  return [row, group.join(",")].join(" ");
}

const withLog = (x: number) => {
  // console.log(x);
  return x;
};

function solveIfSpring(group: number[], row: string) {
  const [numSprings, ...rest] = group;
  if (!numSprings) return withLog(0);
  const springsLeft = numSprings - 1;
  let firstNonSpring = row.split("").findIndex((s) => s !== "#");
  if (firstNonSpring === -1) {
    // all springs
    return withLog(Number(row.length === springsLeft && rest.length === 0));
  }

  const leftOverSprings = springsLeft - firstNonSpring;
  if (leftOverSprings < 0) return withLog(0);

  if (leftOverSprings === 0) {
    const leftOverRow = "." + row.slice(firstNonSpring + 1);
    const leftOverGroups = [...rest];
    return innerSolve(leftOverRow, leftOverGroups);
  }
  if (row[0] === ".") return 0;
  if (row[firstNonSpring] === ".") return 0;

  const leftOverRow = "#" + row.slice(firstNonSpring + 1);
  const leftOverGroups = [leftOverSprings, ...rest];

  return innerSolve(leftOverRow, leftOverGroups);
}

function solveIfEmpty(group: number[], tail: string) {
  const [nextSpring, ...rest] = group;
  const nextGroup = nextSpring > 0 ? [nextSpring, ...rest] : [...rest];
  return innerSolve(tail, nextGroup);
}

const replaceDots = (row: string) => row.replace(/\.+/g, ".");

function innerSolve(row: string, group: number[]): number {
  // console.log([row, group]);
  if (cache[unSplit(row, group)]) return cache[unSplit(row, group)];
  if (row === "") {
    if (group.length === 0) return withLog(1);
    return withLog(0);
  }
  if (row === "#") {
    if (group.length === 1 && group[0] === 1) return withLog(1);
    return withLog(0);
  }
  if (row === ".") {
    if (group.length === 0) return withLog(1);
    return withLog(0);
  }

  if (row === "?") {
    if (group.length === 0) return withLog(1);
    if (group.length === 1 && group[0] === 1) return withLog(1);
    return withLog(0);
  }

  const head = row[0];
  const tail = row.slice(1);

  let result: number;
  if (head === "#") {
    result = solveIfSpring(group, tail);
  } else if (head === ".") {
    result = solveIfEmpty(group, tail);
  } else {
    result = solveIfSpring(group, tail) + solveIfEmpty(group, tail);
  }

  cache[unSplit(row, group)] = result;
  return result;
}
const cache: Record<string, number> = {};
export const solve = (input: string): number => {
  const [row, group] = split(input);
  return innerSolve(row, group);
};

export const fullSolve = (input: string): number => {
  const [row, group] = split(input);
  const first = row[0];
  const last = row.slice(-1)[0];

  // if (first !== "?") {
  const orig = innerSolve(row, group);
  const modified = innerSolve(`?${row}`, group);
  return orig * modified * modified * modified * modified;
  // }

  // return 0;
};

const input = test12
  .trim()
  .split("\n")
  .map((row) => {
    const [r, g] = split(row);
    return unSplit(replaceDots(r), g);
  });

const part1 = input.map(solve).reduce((a, n) => a + n, 0);
const part2 = input.map(fullSolve); //.reduce((a, n) => a + n, 0);

// const fullInput = input.map((i) => {
//   const [r, g] = i.split(" ");
//   const row = [r, r, r, r, r].join("?");
//   const groups = [g, g, g, g, g].join(",");
//   return [row, groups].join(" ");
// });

console.dir({ part1, part2 }, { depth: null });
