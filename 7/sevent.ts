import { input7 } from "./input7";

const isPart2 = true;

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type Hand = [Card, Card, Card, Card, Card];
type HandWithType = { hand: Hand; type: HandType };

type HandType =
  | "5same"
  | "4same"
  | "fullhouse"
  | "3same"
  | "2pair"
  | "pair"
  | "high";

const cardToRank: Record<Card, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11, // Part 1
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};
if (isPart2) cardToRank.J = 1;

const typeToRank: Record<HandType, number> = {
  high: 1,
  pair: 2,
  "2pair": 3,
  "3same": 4,
  fullhouse: 5,
  "4same": 6,
  "5same": 7,
};

type CardCount = Record<Card, number>;

const hands = input7
  .trim()
  .split("\n")
  .map((row) => {
    const [hand, bid] = row.trim().split(" ");
    return { hand: hand.split("") as Hand, bid: parseInt(bid, 10) };
  });

const getHandType = (hand: Hand): HandType => {
  const cardCount = countCards(hand);
  const cardFrequencies = [0, 0, 0, 0, 0];
  Object.values(cardCount)
    .filter((c) => c !== 0)
    .forEach((c) => cardFrequencies[c - 1]++);

  const [_, pairs, triples, quadruples, quintuples] = cardFrequencies;
  // console.log(hand, cardFrequencies);
  if (quintuples) return "5same";
  if (quadruples) return "4same";
  if (triples && pairs) return "fullhouse";
  if (triples) return "3same";
  if (pairs === 2) return "2pair";
  if (pairs) return "pair";
  return "high";
};

const countCards = (hand: Hand): CardCount => {
  const jCount = isPart2 ? hand.filter((card) => card === "J").length : 0;
  const filteredHand = hand.filter((card) => card !== "J");
  const result: CardCount = {
    A: 0,
    K: 0,
    Q: 0,
    J: 0,
    T: 0,
    "9": 0,
    "8": 0,
    "7": 0,
    "6": 0,
    "5": 0,
    "4": 0,
    "3": 0,
    "2": 0,
  };
  filteredHand.forEach((card) => result[card]++);
  let max = 0;
  let maxCard: Card = "A";
  Object.entries(result).forEach(([card, count]) => {
    if (count > max) {
      max = count;
      maxCard = card as Card;
    }
  });

  result[maxCard] += jCount;
  return result;
};

const compareTypes = (a: HandType, b: HandType) => {
  return typeToRank[a] - typeToRank[b];
};

const compareHands = (a: HandWithType, b: HandWithType) => {
  const rankComp = compareTypes(a.type, b.type);
  if (rankComp) return rankComp;
  for (let i = 0; i < 5; i++) {
    const cardComp = cardToRank[a.hand[i]] - cardToRank[b.hand[i]];
    if (cardComp) return cardComp;
  }
  return 0;
};

const part1 = () => {
  return hands
    .map((h) => ({ ...h, type: getHandType(h.hand) }))
    .sort(compareHands)
    .map((h, i) => ({ bid: h.bid, rank: i + 1 }))
    .reduce((acc, h) => acc + h.bid * h.rank, 0);
};
const part2 = () => {};

console.dir({ part1: part1(), part2: part2() }, { depth: null });
