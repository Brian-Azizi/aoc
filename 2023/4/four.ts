import { INPUT_4 } from "./INPUT_4";

const four = () => {
  const cards = INPUT_4.trim()
    .split("\n")
    .map((row) => row.trim().match(/^Card\s+\d+:(.*)$/)![1])
    .map((row) => {
      const [winners, numbers] = row.split("|");
      return {
        winners: winners
          .split(" ")
          .filter((n) => n !== "")
          .map((n) => parseInt(n.trim(), 10)),
        numbers: numbers
          .trim()
          .split(" ")
          .filter((n) => n !== "")
          .map((n) => parseInt(n, 10)),
      };
    })
    .map(
      ({ winners, numbers }) =>
        numbers.filter((n) => winners.includes(n)).length,
    );

  const N = cards.length;

  const copies = new Array(N).fill(1);
  cards.forEach((cardWinnerCount, cardNumber) => {
    for (
      let i = cardNumber + 1;
      i < Math.min(cardNumber + cardWinnerCount + 1, N);
      i++
    )
      copies[i] += copies[cardNumber];
  });

  const totalCards = copies.reduce((acc, score) => acc + score, 0);

  const score = cards
    .map((count) => (count ? Math.pow(2, count - 1) : 0))
    .reduce((acc, score) => acc + score, 0);

  return { answer1: score, answer2: totalCards };
};

console.log(four());
