import { INPUT_3 } from "./INPUT_3";

const numbersPattern = /\d+/g;
const partPattern = /[^\d|\.]/; // not a digit or a dot
const gearPattern = /\*/g;
const digitPattern = /\d/;

type Check = {
  value: number;
  line: number;
  startIndex: number;
  endIndex: number;
};

type Position = [number, number];

function main() {
  const schema = INPUT_3.trim()
    .split("\n")
    .map((line) => line.trim());

  const N = schema.length;
  const M = schema[0].length;

  const allNumbers: Check[] = [];

  schema.forEach((line, i) => {
    const numberMatches = [...line.matchAll(numbersPattern)];
    numberMatches.forEach((match) => {
      allNumbers.push({
        value: parseInt(match[0], 10),
        line: i,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      });
    });
  });

  const parts = allNumbers.filter((num) => {
    const positionsToCheck: Position[] = [];
    for (const i of [num.line - 1, num.line, num.line + 1]) {
      if (i < 0 || i >= N) continue;
      for (let j = num.startIndex - 1; j <= num.endIndex; j++) {
        if (j < 0 || j >= M) continue;
        positionsToCheck.push([i, j]);
      }
    }
    return positionsToCheck.some((position) =>
      schema[position[0]][position[1]].match(partPattern),
    );
  });

  const answer1 = parts.reduce((acc, part) => acc + part.value, 0);

  const allGears: Position[] = [];
  schema.forEach((line, i) => {
    const gearMatches = [...line.matchAll(gearPattern)];
    gearMatches.forEach((match) => {
      allGears.push([i, match.index!]);
    });
  });

  const gearRatioNumbers = allGears.map(([i, j]) => {
    const ratioNumbers: number[] = [];
    const left = schema[i][j - 1].match(digitPattern);
    if (left) {
      const partialLine = schema[i].slice(0, j);
      const lastNumberInLine = [...partialLine.matchAll(numbersPattern)].slice(
        -1,
      )[0][0];
      ratioNumbers.push(parseInt(lastNumberInLine, 10));
    }

    const right = schema[i][j + 1].match(digitPattern);
    if (right) {
      const partialLine = schema[i].slice(j + 1);
      const firstNumberInLine = [...partialLine.matchAll(numbersPattern)][0][0];
      ratioNumbers.push(parseInt(firstNumberInLine, 10));
    }

    const top = schema[i - 1][j].match(digitPattern);
    if (top) {
      const line = schema[i - 1];
      const numberMatches = [...line.matchAll(numbersPattern)];
      const num = numberMatches.find(
        (match) => match.index! <= j && match.index! + match[0].length > j,
      );
      ratioNumbers.push(parseInt(num![0], 10));
    } else {
      const topLeft = schema[i - 1][j - 1].match(digitPattern);
      if (topLeft) {
        const line = schema[i - 1];
        const numberMatches = [...line.matchAll(numbersPattern)];
        const num = numberMatches.find(
          (match) =>
            match.index! <= j - 1 && match.index! + match[0].length > j - 1,
        );
        ratioNumbers.push(parseInt(num![0], 10));
      }
      const topRight = schema[i - 1][j + 1].match(digitPattern);
      if (topRight) {
        const line = schema[i - 1];
        const numberMatches = [...line.matchAll(numbersPattern)];
        const num = numberMatches.find(
          (match) =>
            match.index! <= j + 1 && match.index! + match[0].length > j + 1,
        );
        ratioNumbers.push(parseInt(num![0], 10));
      }
    }

    const bottom = schema[i + 1][j].match(digitPattern);
    if (bottom) {
      const line = schema[i + 1];
      const numberMatches = [...line.matchAll(numbersPattern)];
      const num = numberMatches.find(
        (match) => match.index! <= j && match.index! + match[0].length > j,
      );
      ratioNumbers.push(parseInt(num![0], 10));
    } else {
      const bottomLeft = schema[i + 1][j - 1].match(digitPattern);
      if (bottomLeft) {
        const line = schema[i + 1];
        const numberMatches = [...line.matchAll(numbersPattern)];
        const num = numberMatches.find(
          (match) =>
            match.index! <= j - 1 && match.index! + match[0].length > j - 1,
        );
        ratioNumbers.push(parseInt(num![0], 10));
      }
      const bottomRight = schema[i + 1][j + 1].match(digitPattern);
      if (bottomRight) {
        const line = schema[i + 1];
        const numberMatches = [...line.matchAll(numbersPattern)];
        const num = numberMatches.find(
          (match) =>
            match.index! <= j + 1 && match.index! + match[0].length > j + 1,
        );
        ratioNumbers.push(parseInt(num![0], 10));
      }
    }
    return ratioNumbers;
  });

  const answer2 = gearRatioNumbers
    .filter((ratio) => ratio.length === 2)
    .map((ratio) => ratio[0] * ratio[1])
    .reduce((acc, ratio) => acc + ratio, 0);

  return { answer1, answer2 };
}

console.log(main());
