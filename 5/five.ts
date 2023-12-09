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

const ranger = (rangeInput: string) => {
  const rangeMap = rangeInput
    .trim()
    .split("\n")
    .map((row) => {
      const [destStart, sourceStart, rangeLength] = row
        .trim()
        .split(" ")
        .map((n) => parseInt(n, 10));
      return { destStart, sourceStart, rangeLength };
    });

  return (value: number): number => {
    for (const range of rangeMap)
      if (
        value >= range.sourceStart &&
        value < range.sourceStart + range.rangeLength
      )
        return range.destStart + (value - range.sourceStart);
    return value;
  };
};

const reverseRanger = (rangeInput: string) => {
  const rangeMap = rangeInput
    .trim()
    .split("\n")
    .map((row) => {
      const [destStart, sourceStart, rangeLength] = row
        .trim()
        .split(" ")
        .map((n) => parseInt(n, 10));
      return { destStart, sourceStart, rangeLength };
    });

  return (value: number): number => {
    for (const range of rangeMap)
      if (
        value >= range.destStart &&
        value < range.destStart + range.rangeLength
      )
        return range.sourceStart + (value - range.destStart);
    return value;
  };
};

const isSeed = (input: number) => {
  for (let i = 0; i < seeds.length; i += 2) {
    const [startSeed, length] = [seeds[i], seeds[i + 1]];
    if (input >= startSeed && input < startSeed + length) return true;
  }
  return false;
};

const seed2soil = ranger(seed2soilInput);
const soil2fert = ranger(soil2fertInput);
const fert2water = ranger(fert2waterInput);
const water2light = ranger(water2lightInput);
const light2temp = ranger(light2tempInput);
const temp2hum = ranger(temp2humInput);
const hum2loc = ranger(hum2locInput);

const soil2seed = reverseRanger(seed2soilInput);
const fert2soil = reverseRanger(soil2fertInput);
const water2fert = reverseRanger(fert2waterInput);
const light2water = reverseRanger(water2lightInput);
const temp2light = reverseRanger(light2tempInput);
const hum2temp = reverseRanger(temp2humInput);
const loc2hum = reverseRanger(hum2locInput);

const getLocation = (seed: number) =>
  hum2loc(
    temp2hum(light2temp(water2light(fert2water(soil2fert(seed2soil(seed)))))),
  );

const five = () => {
  const locations = seeds.map(getLocation);
  const answer1 = Math.min(...locations);

  // part 2
  let found = false;
  let locationToCheck = 0;
  while (!found) {
    const potentialSeed = soil2seed(
      fert2soil(
        water2fert(light2water(temp2light(hum2temp(loc2hum(locationToCheck))))),
      ),
    );
    console.log(`Loc ${locationToCheck} \t Seed ${potentialSeed}`);
    if (isSeed(potentialSeed)) found = true;
    else locationToCheck++;
  }

  return { answer1, answer2: locationToCheck };
};

console.log(five());
