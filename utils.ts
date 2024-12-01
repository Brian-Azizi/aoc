export function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result,
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

export function sum(...nums: number[] | (readonly number[])[]): number {
  let tot = 0;
  for (const x of nums) {
    if (typeof x === "number") {
      tot += x;
    } else {
      for (const y of x) {
        tot += y;
      }
    }
  }
  return tot;
}

export function toInt(x: string): number {
  return parseInt(x, 10);
}

export function isEqual(x: any[], y: any[]): boolean {
  if (x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) {
      return false;
    }
  }
  return true;
}

export function transpose(x: string[]): string[] {
  const N = x.length;
  const M = x[0].length;
  const result: string[] = [];
  for (let i = 0; i < M; i++) {
    result.push("");
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      result[j] += x[i][j];
    }
  }

  return result;
}

export const getDimensions = (input: string | any[][]): [number, number] => {
  if (typeof input === "string") {
    const rows = input.trim().split("\n");
    return [rows.length, rows[0].length];
  }
  return [input.length, input[0].length];
};

export const ll = (x: any) => console.dir(x, { depth: null });
