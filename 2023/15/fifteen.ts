import { input15, test15 } from "./input_15";
import { sum, toInt } from "../utils";

const INPUT = input15.split(",");
// const INPUT = input15.split(",");

const hashString = (input: string): number => {
  let result = 0;
  for (const char of input) {
    result += char.charCodeAt(0);
    result *= 17;
    result %= 256;
  }

  return result;
};

const part1 = sum(INPUT.map(hashString));
console.log(part1);

console.log(hashString("pc"));

// part 2

const getLabel = (input: string) => {
  const [label, strength] = input.split(/[-=]/);
  const box = hashString(label);
  return { input, label, strength: strength ? toInt(strength) : null, box };
};

const part2 = () => {
  const BOXES: Record<
    number,
    Record<string, { strength: number; position: number; box: number }>
  > = {};
  const BOX_SIZES: Record<number, number> = {};
  INPUT.forEach((instruction) => {
    const { label, strength, box } = getLabel(instruction);
    if (!BOXES[box]) {
      BOXES[box] = {};
      BOX_SIZES[box] = 0;
    }
    if (!strength) {
      if (BOXES[box][label]) {
        const emptyPosition = BOXES[box][label].position;
        delete BOXES[box][label];
        BOX_SIZES[box]--;
        Object.values(BOXES[box]).forEach((b) => {
          if (b.position > emptyPosition) b.position--;
        });
      }
    } else {
      if (BOXES[box][label]) {
        BOXES[box][label].strength = strength;
      } else {
        BOXES[box][label] = { box, strength, position: BOX_SIZES[box] };
        BOX_SIZES[box]++;
      }
    }
  });

  const power = sum(
    Object.values(BOXES)
      .map((box) =>
        Object.values(box).map(
          (lens) => (lens.box + 1) * (lens.position + 1) * lens.strength,
        ),
      )
      .flat(),
  );

  return [BOXES, power];
};
console.dir(part2(), { depth: null });
