import {INPUT1} from './INPUT-1'
import {sum, toInt} from "../../utils";

const list1: number[] = []
const list2: number[] = []
INPUT1.trim().split('\n').forEach((line) => {
    const [a, b] = line.split('   ')
    list1.push(toInt(a))
    list2.push(toInt(b))
})

const sortedList1 = list1.sort()
const sortedList2 = list2.sort()

const diffs = sortedList1.map((a, i) => {
    const b = sortedList2[i]
    return Math.abs(a - b)
})

console.log(sum(diffs))

const counter: Record<number, number> = {}

list2.forEach(n => {
    if (!counter[n]) counter[n] = 0
    counter[n] += 1
})

const sims = list1.map(a => {
    const n = counter[a] ?? 0
    return a * n
})

console.log(sum(sims))