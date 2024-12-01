import { input9 } from "./input9";

const READINGS = input9
  .trim()
  .split("\n")
  .map((row) =>
    row
      .trim()
      .split(" ")
      .map((value) => parseInt(value, 10)),
  );

const getNextReading = (sequence: number[]) => {
  let diffSequence = sequence;
  const sequences = [sequence];
  while (!diffSequence.every((n) => n === 0)) {
    diffSequence = getDiffSequence(diffSequence);
    sequences.push(diffSequence);
  }
  const next = [0];
  for (let i = 0; i < sequences.length - 1; i++) {
    const lastDiff = next[i];
    const nextReading =
      sequences[sequences.length - 2 - i].slice(-1)[0] + lastDiff;
    next.push(nextReading);
  }
  return next.slice(-1)[0];
};

const getPreviousReading = (sequence: number[]) => {
  let diffSequence = sequence;
  const sequences = [sequence];
  while (!diffSequence.every((n) => n === 0)) {
    diffSequence = getDiffSequence(diffSequence);
    sequences.push(diffSequence);
  }
  const previous = [0];
  for (let i = 0; i < sequences.length - 1; i++) {
    const lastDiff = previous[i];
    const previousReading = sequences[sequences.length - 2 - i][0] - lastDiff;
    previous.push(previousReading);
  }
  return previous.slice(-1)[0];
};

const getDiffSequence = (sequence: number[]) => {
  const result: number[] = [];
  for (let i = 1; i < sequence.length; i++)
    result.push(sequence[i] - sequence[i - 1]);
  return result;
};

const part1 = () => {
  return READINGS.map(getNextReading).reduce((a, n) => a + n, 0);
};

const part2 = () => {
  return READINGS.map(getPreviousReading).reduce((a, n) => a + n, 0);
};

console.dir({ part1: part1(), part2: part2() }, { depth: null });
