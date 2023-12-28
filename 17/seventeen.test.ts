import { isValid } from "./seventeen";

test.each<[string, boolean]>([
  ["", true],
  [">", true],
  ["><", false],
  ["^v", false],
  [">>", true],
  [">>>", true],
  [">>>>", false],
  [">>>^<", true],
  [">>>^<<<<", false],
])("17", (input, out) => {
  expect(isValid(input)).toBe(out);
});
