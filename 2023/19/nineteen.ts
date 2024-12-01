import { input19, test19 } from "./input-19";
import { ll, toInt } from "../../utils";

const INPUT = input19;
// const INPUT = test19;

const [WORKFLOWS, PARTS] = INPUT.trim().split("\n\n");

type Part = { x: number; m: number; a: number; s: number };
type Prop = keyof Part;

const parts = PARTS.trim()
  .split("\n")
  .map((row) => row.trim().slice(1, -1))
  .map((row) => {
    const [X, M, A, S] = row.split(",");
    const part: Part = {
      x: toInt(X.split("=")[1]),
      m: toInt(M.split("=")[1]),
      a: toInt(A.split("=")[1]),
      s: toInt(S.split("=")[1]),
    };
    return part;
  });

type Rule =
  | {
      prop: Prop;
      operator: "<" | ">";
      value: number;
      destination: string;
      workflow: string;
      i: number;
    }
  | {
      destination: string;
      prop: null;
      operator: null;
      value: null;
      i: number;
      workflow: string;
    };

type Workflow = {
  label: string;
  rules: Rule[];
};

type Workflows = Record<string, Workflow>;
const workflows: Workflows = WORKFLOWS.trim()
  .split("\n")
  .map((row) => row.trim())
  .map((row) => {
    const startBracket = row.indexOf("{");
    const label = row.slice(0, startBracket);
    const RULES = row.slice(startBracket + 1, -1).split(",");
    const rules: Rule[] = RULES.map((rule, i) => {
      const colonIndex = rule.indexOf(":");
      if (colonIndex === -1) {
        return {
          destination: rule,
          workflow: label,
          i,
          prop: null,
          operator: null,
          value: null,
        };
      }
      const [condition, destination] = rule.split(":");
      const prop = condition[0] as Prop;
      const operator = condition[1] as "<" | ">";
      const value = toInt(condition.slice(2));
      return { destination, prop, operator, value, i, workflow: label };
    });
    return { label, rules };
  })
  .reduce<Workflows>((acc, wf) => {
    acc[wf.label] = wf;
    return acc;
  }, {});

const applyWorkflow = (part: Part, label: string): "A" | "R" => {
  if (label === "A" || label === "R") return label;
  const wf = workflows[label];
  for (const rule of wf.rules) {
    if (!rule.prop) return applyWorkflow(part, rule.destination);
    const prop = part[rule.prop];
    switch (rule.operator) {
      case ">": {
        if (prop > rule.value) return applyWorkflow(part, rule.destination);
        break;
      }
      case "<":
        if (prop < rule.value) return applyWorkflow(part, rule.destination);
    }
  }

  throw new Error("No Return");
};

const part1 = () => {
  const ACCEPTED: Part[] = [];
  const REJECTED: Part[] = [];
  parts.forEach((part) => {
    const result = applyWorkflow(part, "in");
    if (result === "A") ACCEPTED.push(part);
    else REJECTED.push(part);
  });

  return ACCEPTED.reduce((a, r) => a + r.x + r.m + r.a + r.s, 0);
};

ll(part1());

type Tree = Record<
  string,
  { parent: string | null; left: Tree | "A" | "R"; right: Tree | "A" | "R" }
>;
type Rules = {
  label: string;
  above: string | null;
  below: string | null;
  parent: string | null;
}[];
const fail = () => {
  // const tree: Tree = {};
  // tree["root"] = { parent: null };
  const rules: Rules = [];
  const start = workflows["in"].rules[0];
  addRule(rules)(start, null);
  console.log(rules);
};

const toLabel = (rule: Rule) =>
  rule.prop ? `${rule.prop}-${rule.value}` : rule.destination;

const addRule = (rules: Rules) => (rule: Rule, parent: string | null) => {
  if (!rule.prop) {
    if (rule.destination === "A" || rule.destination === "R") {
      rules.push({
        label: toLabel(rule),
        parent,
        above: null,
        below: null,
      });
    } else {
      const next = workflows[rule.destination]?.rules[0];
      if (next.prop) {
        addRule(rules)(next, parent);
      } else
        rules.push({
          label: toLabel(rule),
          parent,
          above: null,
          below: null,
        });
    }
  } else {
    const LEFT = workflows[rule.destination]?.rules[0] || rule.destination;
    const _RIGHT = workflows[rule.workflow].rules[rule.i + 1];
    const RIGHT = _RIGHT.prop
      ? _RIGHT
      : workflows[_RIGHT.destination]?.rules[0] || _RIGHT.destination;
    const [left, right] = rule.operator === "<" ? [LEFT, RIGHT] : [RIGHT, LEFT];

    const label = toLabel(rule);
    rules.push({
      label,
      parent,
      above: toLabel(left),
      below: toLabel(right),
    });

    if (left.prop) addRule(rules)(left, label);
    if (right.prop) addRule(rules)(right, label);
  }
};

const otherFail = () => {
  const p = (x: number, m: number, a: number, s: number) => ({ x, m, a, s });

  const MAX = 400;
  const STEP = 10;

  let count = 0;
  let last: "R" | "A" = "R";
  const bounderies = [];
  for (let x = 0; x < MAX; x += STEP) {
    console.log({ x });
    for (let m = 0; m < MAX; m += STEP) {
      for (let a = 0; a < MAX; a += STEP) {
        for (let s = 0; s < MAX; s += STEP) {
          const part = p(x, m, a, s);
          const result = applyWorkflow(part, "in");
          if (result !== last) {
            last = result;
            bounderies.push({ p: part, r: result });
          }
        }
      }
    }
  }

  console.log(bounderies);
};

const part2 = () => {

}