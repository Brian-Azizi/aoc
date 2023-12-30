import { input17, test17 } from "./input-17";
import { toInt } from "../utils";

const INPUT = input17;
// const INPUT = test17;

type Node = { dir: "v" | "h"; i: number; j: number };
const node = (dir: "v" | "h", i: number, j: number): Node => ({ dir, i, j });

class Graph {
  private readonly maxMoves: number;
  private readonly minMoves: number;
  private readonly GRID: number[][];
  constructor(input: string, minMoves: number, maxMoves: number) {
    this.minMoves = minMoves;
    this.maxMoves = maxMoves;
    this.GRID = input
      .trim()
      .split("\n")
      .map((row) =>
        row
          .trim()
          .split("")
          .map((cost) => toInt(cost)),
      );
  }
  get M() {
    return this.GRID[0].length;
  }
  get N() {
    return this.GRID.length;
  }
  private isOob(i: number, j: number): boolean {
    return i < 0 || i >= this.N || j < 0 || j >= this.M;
  }

  public neighbours(node: Node): Node[] {
    const { dir, i, j } = node;
    let result: Node[] = [];
    for (let k = this.minMoves; k <= this.maxMoves; k++) {
      if (dir === "v") {
        !this.isOob(i, j + k) && result.push({ dir: "h", i: i, j: j + k });
        !this.isOob(i, j - k) && result.push({ dir: "h", i: i, j: j - k });
      } else {
        !this.isOob(i + k, j) && result.push({ dir: "v", i: i + k, j: j });
        !this.isOob(i - k, j) && result.push({ dir: "v", i: i - k, j: j });
      }
    }
    return result;
  }
  public cost(a: Node, b: Node): number {
    if (a.dir === b.dir) throw new Error("A");
    if (a.dir === "v") if (a.i !== b.i) throw new Error("B");
    if (a.dir === "h") if (a.j !== b.j) throw new Error("C");

    const index = a.dir === "v" ? "j" : "i";
    const steps = a.dir === "v" ? b.j - a.j : b.i - a.i;
    const sign = steps > 0 ? 1 : -1;

    let result = 0;
    for (let k = 1; k <= Math.abs(steps); k++) {
      const [deltaI, deltaJ] = index === "j" ? [0, k * sign] : [k * sign, 0];
      result += this.GRID[a.i + deltaI][a.j + deltaJ];
    }
    return result;
  }

  get LAST() {
    return { i: this.N - 1, j: this.M - 1 };
  }
}

class PriorityQueue<T> {
  private data: Record<number, T[]>;
  private size: number;
  private currentPriority: number | null;
  constructor() {
    this.data = {};
    this.size = 0;
    this.currentPriority = null;
  }

  public put(element: T, priority: number): void {
    if (this.data[priority]) this.data[priority].push(element);
    else this.data[priority] = [element];

    this.size++;
    if (this.currentPriority === null || priority < this.currentPriority) {
      this.currentPriority = priority;
    }
  }

  public get(): T | null {
    if (this.empty() || this.currentPriority === null) return null;
    const result = this.data[this.currentPriority].pop();
    if (this.data[this.currentPriority].length === 0) {
      delete this.data[this.currentPriority];
      const nextPriority = toInt(Object.keys(this.data).sort()[0]);
      this.currentPriority = isNaN(nextPriority) ? null : nextPriority;
    }
    this.size--;
    return result!;
  }

  public empty(): boolean {
    return this.size === 0;
  }
}

const toStr = (node: Node): string => `${node.dir}(${node.i},${node.j})`;

const runSearch = (min: number, max: number) => {
  const graph = new Graph(INPUT, min, max);
  const frontier = new PriorityQueue<Node>();
  frontier.put(node("v", 0, 0), 0);
  frontier.put(node("h", 0, 0), 0);
  const cameFrom: Record<string, Node> = {};
  const costSoFar: Record<string, number> = {
    [toStr(node("v", 0, 0))]: 0,
    [toStr(node("h", 0, 0))]: 0,
  };

  while (!frontier.empty()) {
    const current = frontier.get()!;
    for (const next of graph.neighbours(current)) {
      const newCost = costSoFar[toStr(current)] + graph.cost(current, next);

      if (!(toStr(next) in costSoFar) || newCost < costSoFar[toStr(next)]) {
        costSoFar[toStr(next)] = newCost;
        const priority = newCost;
        frontier.put(next, priority);
        cameFrom[toStr(next)] = current;
      }
    }
  }

  const result = Math.min(
    costSoFar[toStr(node("h", graph.LAST.i, graph.LAST.j))],
    costSoFar[toStr(node("v", graph.LAST.i, graph.LAST.j))],
  );

  return result;
};

const part1 = runSearch(1, 3);
const part2 = runSearch(4, 10);

console.log({ part1, part2 });
