import {
  fert2waterInput,
  hum2locInput,
  light2tempInput,
  seed2soilInput,
  seedsInput,
  soil2fertInput,
  temp2humInput,
  water2lightInput,
} from "./Input_5";

const seeds = seedsInput
  .trim()
  .split(" ")
  .map((s) => parseInt(s, 10));

type Range = {
  destStart: number;
  destEnd: number;
  rangeLength: number;
};
type RangeMap = Range & {
  sourceStart: number;
  sourceEnd: number;
};
const getRangeMap = (rangeInput: string): RangeMap[] =>
  rangeInput
    .trim()
    .split("\n")
    .map((row) => {
      const [destStart, sourceStart, rangeLength] = row
        .trim()
        .split(" ")
        .map((n) => parseInt(n, 10));
      return {
        destStart,
        sourceStart,
        rangeLength,
        sourceEnd: sourceStart + rangeLength,
        destEnd: destStart + rangeLength,
      };
    });

const seed2soilMap = getRangeMap(seed2soilInput);
const soil2fertMap = getRangeMap(soil2fertInput);
const fert2waterMap = getRangeMap(fert2waterInput);
const water2lightMap = getRangeMap(water2lightInput);
const light2tempMap = getRangeMap(light2tempInput);
const temp2humMap = getRangeMap(temp2humInput);
const hum2locMap = getRangeMap(hum2locInput);

const ranger =
  (rangeMap: RangeMap[]) =>
  (value: number): number => {
    for (const range of rangeMap)
      if (
        value >= range.sourceStart &&
        value < range.sourceStart + range.rangeLength
      )
        return range.destStart + (value - range.sourceStart);
    return value;
  };

const seed2soil = ranger(seed2soilMap);
const soil2fert = ranger(soil2fertMap);
const fert2water = ranger(fert2waterMap);
const water2light = ranger(water2lightMap);
const light2temp = ranger(light2tempMap);
const temp2hum = ranger(temp2humMap);
const hum2loc = ranger(hum2locMap);

const getLocation = (seed: number) =>
  hum2loc(
    temp2hum(light2temp(water2light(fert2water(soil2fert(seed2soil(seed)))))),
  );

function sortBy<T>(arr: T[], key: keyof T) {
  return arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
}

function validate(pair: Range, maps: RangeMap[]) {
  const { destStart: start, destEnd: end, rangeLength } = pair;
  const sortedMaps = sortBy(maps, "sourceStart");
  const first = sortedMaps[0];
  const last = sortedMaps[sortedMaps.length - 1];
  let valid = true;
  valid &&= start === first.sourceStart;
  valid &&= end === last.sourceEnd;
  let total = first.rangeLength;
  for (let i = 0; i < sortedMaps.length - 1; i++) {
    const [curr, next] = [sortedMaps[i], sortedMaps[i + 1]];
    valid &&= curr.sourceEnd === next.sourceStart;
    total += next.rangeLength;
  }
  valid &&= total === rangeLength;

  if (!valid) throw new Error("invalid");
}

const mapRanges = (destPairs: Range[], map: RangeMap[]) => {
  const sortedPairs = sortBy(destPairs, "destStart");
  const sortedMaps = sortBy(map, "sourceStart");
  const result = sortedPairs.map((pair) => {
    const maps: RangeMap[] = [];
    sortedMaps.forEach((sm) => {
      // seedRange fully covers the map
      if (pair.destStart <= sm.sourceStart && pair.destEnd >= sm.sourceEnd) {
        maps.push(sm);
      }
      // seedRange fully covered by the map
      else if (
        pair.destStart >= sm.sourceStart &&
        pair.destEnd <= sm.sourceEnd
      ) {
        const destStart = sm.destStart + pair.destStart - sm.sourceStart;
        maps.push({
          sourceStart: pair.destStart,
          sourceEnd: pair.destEnd,
          rangeLength: pair.rangeLength,
          destStart,
          destEnd: destStart + pair.rangeLength,
        });
      }
      // seedRange left side covered by the map
      else if (
        pair.destStart >= sm.sourceStart &&
        pair.destStart < sm.sourceEnd
      ) {
        const destStart = sm.destStart + pair.destStart - sm.sourceStart;
        const rangeLength = sm.sourceEnd - pair.destStart;
        maps.push({
          sourceStart: pair.destStart,
          sourceEnd: sm.sourceEnd,
          rangeLength,
          destStart,
          destEnd: destStart + rangeLength,
        });
      }
      // seedRange right side covered by the map
      else if (pair.destEnd > sm.sourceStart && pair.destEnd <= sm.sourceEnd) {
        const rangeLength = pair.destEnd - sm.sourceStart;
        maps.push({
          sourceStart: sm.sourceStart,
          sourceEnd: pair.destEnd,
          rangeLength,
          destStart: sm.destStart,
          destEnd: sm.destStart + rangeLength,
        });
      }
    });
    // handle no coverage
    if (maps.length === 0) {
      maps.push({
        sourceStart: pair.destStart,
        sourceEnd: pair.destEnd,
        destStart: pair.destStart,
        destEnd: pair.destEnd,
        rangeLength: pair.rangeLength,
      });
    } else {
      // handle gaps at the start
      const start = maps[0];
      let startMap: RangeMap | null = null;
      if (start.sourceStart > pair.destStart) {
        const sourceStart = pair.destStart;
        const sourceEnd = start.sourceStart;
        const rangeLength = sourceEnd - sourceStart;
        startMap = {
          sourceStart,
          sourceEnd,
          rangeLength,
          destStart: sourceStart,
          destEnd: sourceEnd,
        };
      }
      // handle gaps at the end
      const end = maps[maps.length - 1];
      let endMap: RangeMap | null = null;
      if (end.sourceEnd < pair.destEnd) {
        const sourceStart = end.sourceEnd;
        const sourceEnd = pair.destEnd;
        const rangeLength = sourceEnd - sourceStart;
        endMap = {
          sourceStart,
          sourceEnd,
          rangeLength,
          destStart: sourceStart,
          destEnd: sourceEnd,
        };
      }
      // handle gaps in between
      const inBetweenMaps: RangeMap[] = [];
      for (let i = 0; i < maps.length - 1; i++) {
        const [curr, next] = [maps[i], maps[i + 1]];
        if (curr.sourceEnd < next.sourceStart) {
          const sourceStart = curr.sourceEnd;
          const sourceEnd = next.sourceStart;
          const rangeLength = sourceEnd - sourceStart;
          inBetweenMaps.push({
            sourceStart,
            sourceEnd,
            rangeLength,
            destStart: sourceStart,
            destEnd: sourceEnd,
          });
        }
      }

      if (startMap) maps.push(startMap);
      if (endMap) maps.push(endMap);
      inBetweenMaps.forEach((m) => maps.push(m));
    }

    validate(pair, maps);
    return {
      ...pair,
      maps,
    };
  });
  return result.flatMap((r) => r.maps);
};

const part2 = () => {
  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({
      destStart: seeds[i],
      destEnd: seeds[i] + seeds[i + 1],
      rangeLength: seeds[i + 1],
    });
  }

  const soilRanges = mapRanges(seedRanges, seed2soilMap);
  const fertRanges = mapRanges(soilRanges, soil2fertMap);
  const waterRanges = mapRanges(fertRanges, fert2waterMap);
  const lightRanges = mapRanges(waterRanges, water2lightMap);
  const tempRanges = mapRanges(lightRanges, light2tempMap);
  const humRanges = mapRanges(tempRanges, temp2humMap);
  const locRanges = mapRanges(humRanges, hum2locMap);
  const sortedLocs = sortBy(locRanges, "destStart");
  return sortedLocs[0].destStart;
};

const five = () => {
  const locations = seeds.map(getLocation);
  const answer1 = Math.min(...locations);

  return { answer1, answer2: part2() };
};

console.dir(five(), { depth: null });
