import {input5} from './input5'
import {sum, toInt} from "../../utils";

const [rulesInput, updateInputs] = input5.trim().split('\n\n')
const RULES = rulesInput.trim().split('\n').map(rule => rule.split('|').map(toInt))
const UPDATES = updateInputs.trim().split('\n').map(update => update.split(',').map(toInt))


type RulesMap = Record<number, { before: Set<number>, after: Set<number> }>;

function createRulesMap(rules: number[][]): RulesMap {
    const rulesMap: RulesMap = {}

    rules.forEach(rule => {
        const [a, b] = rule
        if (!rulesMap[a]) {
            rulesMap[a] = {before: new Set<number>(), after: new Set<number>()}
        }
        rulesMap[a].after.add(b)

        if (!rulesMap[b]) {
            rulesMap[b] = {before: new Set<number>(), after: new Set<number>()}
        }
        rulesMap[b].before.add(a)
    })
    return rulesMap
}

const checkUpdate = (rulesMap: RulesMap) => (update: number[]): boolean => {
    for (let i = 0; i < update.length; i++) {
        const page = update[i]
        const before = update.slice(0, i)
        if (before.some(value => rulesMap[page].after.has(value))) {
            return false
        }

        const after = update.slice(i + 1)
        if (after.some(value => rulesMap[page].before.has(value))) {
            return false
        }
    }
    return true
}

const part1 = () => {
    const rulesMap = createRulesMap(RULES);

    const validUpdates = UPDATES.filter(checkUpdate(rulesMap))
    const middles = validUpdates.map(update => update[(update.length - 1)/2])
    return sum(middles)
}

const part2 = () => {
    const rulesMap = createRulesMap(RULES);

    const invalidUpdates = UPDATES.filter(update => !checkUpdate(rulesMap)(update))
    const fixedUpdates = invalidUpdates.map(fixUpdate(rulesMap))
    const middles = fixedUpdates.map(update => update[(update.length - 1)/2])
    return sum(middles)
}

const fixUpdate = (rulesMap: RulesMap) => (update: number[]): number[] => {
    return update.sort((a, b) => {
        if (rulesMap[a].after.has(b)) return 1
        if (rulesMap[a].before.has(b)) return -1
        if (rulesMap[b].after.has(a)) return -1
        if (rulesMap[b].before.has(a)) return 1
        return 0
    })
}

console.log(part1())
console.log(part2())