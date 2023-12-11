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

  function getRowDist(gal: [number, number], gal2: [number, number]) {
    const start = Math.min(gal[0], gal2[0]);
    const end = Math.max(gal[0], gal2[0]);
    let dist = 0;
    for (let i = start; i < end; i++) {
      if (rowsWithGalaxies.has(i)) {
        dist += 1;
      } else {
        dist += expansionFactor;
      }
    }

    return dist;
  }

  function getColDist(gal: [number, number], gal2: [number, number]) {
    const start = Math.min(gal[1], gal2[1]);
    const end = Math.max(gal[1], gal2[1]);
    let dist = 0;
    for (let i = start; i < end; i++) {
      if (colsWithGalaxies.has(i)) {
        dist += 1;
      } else {
        dist += expansionFactor;
      }
    }

    return dist;
  }

  for (let gal of galaxies) {
    for (const gal2 of galaxies) {
      const rowDist = getRowDist(gal, gal2);
      const colDist = getColDist(gal, gal2);
      const distance = rowDist + colDist;

      total += distance;
    }
  }

  return total / 2;
};

console.dir({ p1: main(2), p2: main(1000000) });
