import {input3} from './input3'
import {sum, toInt} from "../../utils";


const three1 = (input: string) => {
    const matches = input.match(/mul\(\d{1,3},\d{1,3}\)/g)
    if (!matches) return 0
    const products = matches.map(match => {
        const [bef, aft] = match.split(',')
        const a = toInt(bef.split('(')[1])
        const b = toInt(aft.split(')')[0])

        return a * b
    })

    return sum(products)
}

const three2 = (input: string) => {
    const donts = input.split("don't()")
    let sum = 0
    donts.forEach(((d, i) => {
        if (i === 0) {
            sum += three1(d)
            return
        }
        const dos = d.split('do()')
        const [_, ...rest] = dos
        sum += three1(rest.join(""))
    }))

    return sum
}

console.log(three1(input3))
console.log(three2(input3))