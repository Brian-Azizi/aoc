import { input_13, test_13 } from "./input_13";
import { transpose } from "../utils";

// const INPUT = test_13;
const INPUT = input_13;

const PATTERNS = INPUT.trim()
  .split("\n\n")
  .map((pattern) => pattern.split("\n"));

const countReflections = (pattern: string[]) => {
  let found: number[] = [];
  for (let i = 1; i < pattern.length; i++) {
    let mirrored = true;
    for (let j = 1; i - j >= 0 && i + j <= pattern.length; j++) {
      const above = pattern[i - j];
      const below = pattern[i + j - 1];

      if (above !== below) {
        mirrored = false;
        break;
      }
    }
    if (mirrored) {
      found.push(i);
    }
  }
  return found[0] ?? 0;
};

const hasOneOff = (row1: string, row2: string) => {
  let diffs = 0;
  for (let i = 0; i < row1.length; i++) {
    diffs += Number(row1[i] !== row2[i]);
  }
  return diffs === 1;
};

const countReflectionsWithSmudges = (pattern: string[]) => {
  let found: number[] = [];

  for (let i = 1; i < pattern.length; i++) {
    let isMirrored = true;
    let smudgeFound = false;

    for (let j = 1; i - j >= 0 && i + j <= pattern.length; j++) {
      const above = pattern[i - j];
      const below = pattern[i + j - 1];

      if (above !== below) {
        if (smudgeFound) {
          isMirrored = false;
          // break;
        } else if (hasOneOff(above, below)) {
          smudgeFound = true;
        } else {
          isMirrored = false;
          // break;
        }
      }

      // console.log([i, j], above, below, isMirrored, smudgeFound);
    }

    if (isMirrored && smudgeFound) {
      found.push(i);
    }
  }

  if (found.length > 1) throw new Error("asdf");
  return found[0] ?? 0;
  // return found;
};

const part1 = () => {
  return (
    PATTERNS.map(countReflections).reduce((a, n) => a + n * 100, 0) +
    PATTERNS.map(transpose)
      .map(countReflections)
      .reduce((a, n) => a + n, 0)
  );
};

const part2 = () => {
  // return PATTERNS.map(countReflectionsWithSmudges);
  return (
    PATTERNS.map(countReflectionsWithSmudges).reduce((a, n) => a + n * 100, 0) +
    PATTERNS.map(transpose)
      .map(countReflectionsWithSmudges)
      .reduce((a, n) => a + n, 0)
  );
};

console.log(part1());

// console.log(PATTERNS);
console.log(part2());

// console.log(transpose(PATTERNS[0]).join("\n"));
// console.log(countReflections(transpose(PATTERNS[0])));
