import {
  seedsInput,
  seed2soilInput,
  soil2fertInput,
  fert2waterInput,
  water2lightInput,
  light2tempInput,
  temp2humInput,
  hum2locInput,
} from "./Input_5";

const seeds = seedsInput
  .trim()
  .split(" ")
  .map((s) => parseInt(s, 10));

type RangeMap = { destStart: number; sourceStart: number; rangeLength: number };
type RangeMapWithEnd = RangeMap & { sourceEnd: number };
const getRangeMap = (rangeInput: string): RangeMap[] =>
  rangeInput
    .trim()
    .split("\n")
    .map((row) => {
      const [destStart, sourceStart, rangeLength] = row
        .trim()
        .split(" ")
        .map((n) => parseInt(n, 10));
      return { destStart, sourceStart, rangeLength };
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

const reverseRanger =
  (rangeMap: RangeMap[]) =>
  (value: number): number => {
    for (const range of rangeMap)
      if (
        value >= range.destStart &&
        value < range.destStart + range.rangeLength
      )
        return range.sourceStart + (value - range.destStart);
    return value;
  };

const isSeed = (input: number) => {
  for (let i = 0; i < seeds.length; i += 2) {
    const [startSeed, length] = [seeds[i], seeds[i + 1]];
    if (input >= startSeed && input < startSeed + length) return true;
  }
  return false;
};

const seed2soil = ranger(seed2soilMap);
const soil2fert = ranger(soil2fertMap);
const fert2water = ranger(fert2waterMap);
const water2light = ranger(water2lightMap);
const light2temp = ranger(light2tempMap);
const temp2hum = ranger(temp2humMap);
const hum2loc = ranger(hum2locMap);

const soil2seed = reverseRanger(seed2soilMap);
const fert2soil = reverseRanger(soil2fertMap);
const water2fert = reverseRanger(fert2waterMap);
const light2water = reverseRanger(water2lightMap);
const temp2light = reverseRanger(light2tempMap);
const hum2temp = reverseRanger(temp2humMap);
const loc2hum = reverseRanger(hum2locMap);

const getLocation = (seed: number) =>
  hum2loc(
    temp2hum(light2temp(water2light(fert2water(soil2fert(seed2soil(seed)))))),
  );

function sortBy<T>(arr: T[], key: keyof T) {
  return arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
}

const part2 = () => {
  const seedPairs = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedPairs.push({ start: seeds[i], end: seeds[i] + seeds[i + 1] });
  }
  const sortedSeeds = sortBy(seedPairs, "start");
  const sortedSoilMaps: RangeMapWithEnd[] = sortBy(
    seed2soilMap,
    "sourceStart",
  ).map((m) => ({
    ...m,
    sourceEnd: m.sourceStart + m.rangeLength,
  }));

  const seedsWithSoilMaps = sortedSeeds.map((seed) => {
    const soils: RangeMapWithEnd[] = [];
    sortedSoilMaps.forEach((sm) => {
      // seedRange fully covers the map
      if (seed.start <= sm.sourceStart && seed.end >= sm.sourceEnd) {
        soils.push(sm);
      }
      // seedRange fully covered by the map
      else if (seed.start >= sm.sourceStart && seed.end <= sm.sourceEnd) {
        soils.push(sm);
      }
      // seedRange left side covered by the map
      else if (seed.start >= sm.sourceStart && seed.start < sm.sourceEnd) {
        soils.push({
          sourceStart: seed.start,
          sourceEnd: sm.sourceEnd,
          rangeLength: sm.sourceEnd - seed.start,
          destStart: sm.destStart + seed.start - sm.sourceStart,
        });
      }
      // seedRange right side covered by the map
      else if (seed.end > sm.sourceStart && seed.end <= sm.sourceEnd) {
        soils.push({
          sourceStart: sm.sourceStart,
          sourceEnd: seed.end,
          rangeLength: seed.end - sm.sourceStart,
          destStart: sm.destStart,
        });
      }
    });
    return {
      ...seed,
      soils,
    };
  });

  console.dir(seedsWithSoilMaps, { depth: null });
  return null;
};

const five = () => {
  const locations = seeds.map(getLocation);
  const answer1 = Math.min(...locations);

  // part 2
  // let found = false;
  // let locationToCheck = 0;
  // while (!found) {
  //   const potentialSeed = soil2seed(
  //     fert2soil(
  //       water2fert(light2water(temp2light(hum2temp(loc2hum(locationToCheck))))),
  //     ),
  //   );
  //   console.log(`Loc ${locationToCheck} \t Seed ${potentialSeed}`);
  //   if (isSeed(potentialSeed)) found = true;
  //   else locationToCheck++;
  // }

  return { answer1, answer2: part2() };
};

console.dir(five());
