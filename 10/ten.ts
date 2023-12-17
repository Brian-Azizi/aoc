import { input10 } from "./input10";

type Pipe = "F" | "L" | "J" | "7" | "|" | "-";
type Field = Pipe | "." | "S";
type Flow = "up" | "down" | "left" | "right";

const S = "|";

const MAP: Field[][] = input10
  .trim()
  .split("\n")
  .map((row) => row.trim().split("") as Field[]);

const hashedMap: Record<
  string,
  { pipe: Pipe; next: string; previous: string }
> = {};
const asKey = (i: number, j: number) => `${i}-${j}`;

let startingKey: string;

for (let i = 0; i < MAP.length; i++) {
  for (let j = 0; j < MAP[0].length; j++) {
    const field = MAP[i][j];

    const key = `${i}-${j}`;
    if (field === "S") {
      startingKey = key;
    }
    switch (field) {
      case "-": {
        hashedMap[key] = {
          pipe: field,
          previous: asKey(i, j - 1),
          next: asKey(i, j + 1),
        };
        break;
      }
      case "|":
      case "S": {
        hashedMap[key] = {
          pipe: field === "S" ? S : field,
          previous: asKey(i - 1, j),
          next: asKey(i + 1, j),
        };
        break;
      }
      case "L": {
        hashedMap[key] = {
          pipe: field,
          previous: asKey(i - 1, j),
          next: asKey(i, j + 1),
        };
        break;
      }
      case "F": {
        hashedMap[key] = {
          pipe: field,
          previous: asKey(i + 1, j),
          next: asKey(i, j + 1),
        };
        break;
      }
      case "7": {
        hashedMap[key] = {
          pipe: field,
          previous: asKey(i + 1, j),
          next: asKey(i, j - 1),
        };
        break;
      }
      case "J": {
        hashedMap[key] = {
          pipe: field,
          previous: asKey(i - 1, j),
          next: asKey(i, j - 1),
        };
        break;
      }
    }
  }
}

const FlowMap: Record<Pipe, Record<Flow, Flow | "ERROR">> = {
  "|": {
    up: "up",
    down: "down",
    left: "ERROR",
    right: "ERROR",
  },
  "-": {
    up: "ERROR",
    down: "ERROR",
    left: "left",
    right: "right",
  },
  "7": {
    up: "left",
    down: "ERROR",
    left: "ERROR",
    right: "down",
  },
  L: {
    up: "ERROR",
    down: "right",
    left: "up",
    right: "ERROR",
  },
  F: {
    up: "right",
    down: "ERROR",
    left: "down",
    right: "ERROR",
  },
  J: {
    up: "ERROR",
    down: "left",
    left: "ERROR",
    right: "up",
  },
};

const getFlow = (lastFlow: Flow, currentPipe: Pipe): Flow => {
  const nextFlow = FlowMap[currentPipe][lastFlow];
  if (nextFlow === "ERROR") throw new Error(`${lastFlow}, ${currentPipe}`);
  return nextFlow;
};
const getLoop = () => {
  let last = startingKey;
  const lastFlow = "up";
  let current = hashedMap[startingKey].previous;
  let currentFlow = getFlow(lastFlow, hashedMap[current].pipe);

  const loopMap: Record<string, Flow> = {
    [last]: lastFlow,
    [current]: currentFlow,
  };

  while (current !== startingKey) {
    const next =
      hashedMap[current].previous === last
        ? hashedMap[current].next
        : hashedMap[current].previous;
    last = current;
    current = next;
    currentFlow = getFlow(currentFlow, hashedMap[next].pipe);
    loopMap[next] = currentFlow;
  }
  return loopMap;
};

const LOOP = getLoop();
const LoopList = Object.keys(LOOP);
const N = MAP.length;
const M = MAP[0].length;

const parseKey = (key: string) => {
  return key.split("-").map((s) => parseInt(s, 10)) as [number, number];
};

const getInnerArea = () => {
  // if flow is up, assume inside is to the left
  const handledKeys = new Set<string>();
  let area = 0;
  LoopList.forEach((key) => {
    const currentFlow = LOOP[key];

    if (handledKeys.has(key)) return;
    handledKeys.add(key);

    if (currentFlow === "down") {
      let [i, j] = parseKey(key);
      j++;
      while (!LOOP[asKey(i, j)]) {
        area++;
        j++;
      }
      handledKeys.add(asKey(i, j));
    }
    if (currentFlow === "up") {
      let [i, j] = parseKey(key);
      j--;
      while (!LOOP[asKey(i, j)]) {
        area++;
        j--;
      }
      handledKeys.add(asKey(i, j));
    }
  });
  console.log(handledKeys.size / 2);
  return area;
};

console.dir(
  { part1: LoopList.length / 2, part2: getInnerArea() },
  { depth: null },
);
