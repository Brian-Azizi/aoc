import { input12 } from "./input12";

type Entry = "." | "#" | "?";
type Reading = { entry: Entry[]; check: number[] };

const READINGS: Reading[] = input12
  .trim()
  .split("\n")
  .map((row) => {
    const [entries, checks] = row.trim().split(" ");
    const entry = entries.trim().split("") as Entry[];
    const check = checks
      .trim()
      .split(",")
      .map((n) => parseInt(n, 10));
    return { entry, check };
  });

console.log(READINGS);
