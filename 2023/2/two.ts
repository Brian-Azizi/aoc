import { INPUT_2 } from "./INPUT-2";

type Reveal = {
  blue?: number;
  red?: number;
  green?: number;
};
type FullReveal = Required<Reveal>;
type Color = keyof Reveal;

const MAX_BALLS: FullReveal = {
  red: 12,
  green: 13,
  blue: 14,
};

function main() {
  const games = INPUT_2.trim()
    .split("\n")
    .map((line) => {
      const [idString, revealsString] = line.split(":");
      const reveals = revealsString.split(";").map((reveal) =>
        reveal
          .trim()
          .split(",")
          .reduce<Reveal>((acc, balls) => {
            const [amount, key] = balls.trim().split(" ");
            acc[key as Color] = parseInt(amount, 10);
            return acc;
          }, {}),
      );
      const id = parseInt(idString.split("Game ")[1], 10);

      return { id, reveals };
    });

  const answer1 = games
    .filter((game) =>
      game.reveals.every(
        (reveal) =>
          (reveal.blue || 0) <= MAX_BALLS.blue &&
          (reveal.red || 0) <= MAX_BALLS.red &&
          (reveal.green || 0) <= MAX_BALLS.green,
      ),
    )
    .reduce((acc, game) => acc + game.id, 0);

  const answer2 = games
    .map(({ id, reveals }) => ({
      id,
      power: power(
        reveals.reduce<FullReveal>(
          (acc, reveal) => {
            return {
              red: Math.max(acc.red, reveal.red || 0),
              blue: Math.max(acc.blue, reveal.blue || 0),
              green: Math.max(acc.green, reveal.green || 0),
            };
          },
          { red: 0, green: 0, blue: 0 },
        ),
      ),
    }))
    .reduce((acc, game) => acc + game.power, 0);

  return { answer1, answer2 };
}

const power = (reveal: FullReveal) => reveal.blue * reveal.red * reveal.green;

console.log(JSON.stringify(main(), null, 2));
