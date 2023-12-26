import { Direction, getHistKey, isValid } from "./seventeen";

test.each<[Direction[], boolean]>([
  [[], true],
  [[">"], true],
  [[">", "<"], false],
  [["^", "v"], false],
  [[">", ">"], true],
  [[">", ">", ">"], true],
  [[">", ">", ">", ">"], false],
  [[">", ">", ">", "^", "<"], true],
  [[">", ">", ">", "^", "<", "<", "<", "<"], false],
])("17", (input, out) => {
  expect(isValid(input)).toBe(out);
});

test.each<[Direction[], string]>([
  [[], "*"],
  [[">"], ">"],
  [[">", "<"], "<"],
  [["^", "v"], "v"],
  [[">", ">"], ">>"],
  [[">", ">", ">"], ">>>"],
  [["^", ">", ">", ">"], ">>>"],
  [[">", ">", ">", "^", "<"], "<"],
])("17 2", (input, out) => {
  expect(getHistKey(input)).toBe(out);
});
