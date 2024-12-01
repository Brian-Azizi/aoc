import { races, TheRace } from "./input6";

type Option = {
  chargingTime: number;
  racingTime: number;
  speed: number;
  distanceTravelled: number;
};

const part1 = () => {
  return races
    .map((race) => {
      const options: Option[] = [];
      for (let chargingTime = 0; chargingTime <= race.time; chargingTime++) {
        const speed = chargingTime;
        const racingTime = race.time - chargingTime;
        const distanceTravelled = speed * racingTime;
        options.push({ chargingTime, racingTime, speed, distanceTravelled });
      }
      return options.filter((o) => o.distanceTravelled > race.record).length;
    })
    .reduce((acc, w) => acc * w, 1);
};

const beatsRecord = (chargingTime: number) =>
  chargingTime * (TheRace.time - chargingTime) > TheRace.record;

const part2 = () => {
  let result = 0;

  let chargingTime = TheRace.time / 2;
  while (beatsRecord(chargingTime)) {
    result++;
    chargingTime++;
  }

  chargingTime = TheRace.time / 2 - 1;
  while (beatsRecord(chargingTime)) {
    result++;
    chargingTime--;
  }

  return result;
};

console.dir({ part1: part1(), part2: part2() }, { depth: null });
