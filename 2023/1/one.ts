import { INPUT1 } from "./INPUT-1";

const DIGITS = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};
type Digit = keyof typeof DIGITS;

const main = () =>
  INPUT1.trim()
    .split("\n")
    .map((line) =>
      line.replaceAll(
        /(one|two|three|four|five|six|seven|eight|nine)/g,
        (match) => DIGITS[match as Digit],
      ),
    )
    .map((line) => line.match(/\d/g))
    .map((matches) => [matches?.[0], matches?.slice(-1)[0]].join(""))
    .map((str) => parseInt(str, 10))
    .reduce((acc, num) => acc + num, 0);

console.log(main());
