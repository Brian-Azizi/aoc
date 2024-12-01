import { input11 } from "./input11";

const main = (expansionFactor: number) => {
  const map = input11
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));

  const rowsWithGalaxies = new Set();
  const colsWithGalaxies = new Set();

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "#") {
        rowsWithGalaxies.add(row);
        colsWithGalaxies.add(col);
      }
    }
  }

  const galaxies: [number, number][] = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "#") {
        galaxies.push([row, col]);
      }
    }
  }

  let total = 0;
  const rowOrColWithGalaxies = [rowsWithGalaxies, colsWithGalaxies] as const;
  for (let gal of galaxies) {
    for (const gal2 of galaxies) {
      const colDist = computeDist("col")(
        gal,
        gal2,
        rowOrColWithGalaxies,
        expansionFactor,
      );
      const rowDist = computeDist("row")(
        gal,
        gal2,
        rowOrColWithGalaxies,
        expansionFactor,
      );
      total += rowDist + colDist;
    }
  }

  return total / 2;
};

const computeDist =
  (rowOrCol: "row" | "col") =>
  (
    gal: [number, number],
    gal2: [number, number],
    rowOrColWithGalaxies: Readonly<[Set<any>, Set<any>]>,
    expansionFactor: number,
  ) => {
    const index = rowOrCol === "row" ? 0 : 1;
    const start = Math.min(gal[index], gal2[index]);
    const end = Math.max(gal[index], gal2[index]);
    let dist = 0;
    for (let i = start; i < end; i++) {
      if (rowOrColWithGalaxies[index].has(i)) {
        dist += 1;
      } else {
        dist += expansionFactor;
      }
    }
    return dist;
  };

console.dir({ p1: main(2), p2: main(1000000) });
