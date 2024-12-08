import {input4} from './input4'

const four1 = (input: string) => {
    const grid = input.split('\n').map(line => line.trim().split(''))
    let counter = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (searchRight(i, j, grid)) counter++
            if (searchLeft(i, j, grid)) counter++
            if (searchUp(i, j, grid)) counter++
            if (searchDown(i, j, grid)) counter++
            if (searchUpRight(i, j, grid)) counter++
            if (searchDownRight(i, j, grid)) counter++
            if (searchDownLeft(i, j, grid)) counter++
            if (searchUpLeft(i, j, grid)) counter++
        }
    }

    return counter
}

const searchRight = (i: number, j: number, grid: string[][]) => {
    if (j + 3 >= grid[i].length) return false
    return grid[i][j] === "X" && grid[i][j + 1] === "M" && grid[i][j + 2] === "A" && grid[i][j + 3] === "S"
}

const searchLeft = (i: number, j: number, grid: string[][]) => {
    if (j - 3 < 0) return false
    return grid[i][j] === "X" && grid[i][j - 1] === "M" && grid[i][j - 2] === "A" && grid[i][j - 3] === "S"
}

const searchUp = (i: number, j: number, grid: string[][]) => {
    if (i - 3 < 0) return false
    return grid[i][j] === "X" && grid[i - 1][j] === "M" && grid[i - 2][j] === "A" && grid[i - 3][j] === "S"
}

const searchDown = (i: number, j: number, grid: string[][]) => {
    if (i + 3 >= grid.length) return false
    return grid[i][j] === "X" && grid[i + 1][j] === "M" && grid[i + 2][j] === "A" && grid[i + 3][j] === "S"
}

const searchUpRight = (i: number, j: number, grid: string[][]) => {
    if (i - 3 < 0) return false
    if (j + 3 >= grid[i].length) return false
    return grid[i][j] === "X" && grid[i - 1][j + 1] === "M" && grid[i - 2][j + 2] === "A" && grid[i - 3][j + 3] === "S"
}

const searchDownRight = (i: number, j: number, grid: string[][]) => {
    if (i + 3 >= grid.length) return false
    if (j + 3 >= grid[i].length) return false
    return grid[i][j] === "X" && grid[i + 1][j + 1] === "M" && grid[i + 2][j + 2] === "A" && grid[i + 3][j + 3] === "S"
}

const searchDownLeft = (i: number, j: number, grid: string[][]) => {
    if (i + 3 >= grid.length) return false
    if (j - 3 < 0) return false
    return grid[i][j] === "X" && grid[i + 1][j - 1] === "M" && grid[i + 2][j - 2] === "A" && grid[i + 3][j - 3] === "S"
}

const searchUpLeft = (i: number, j: number, grid: string[][]) => {
    if (i - 3 < 0) return false
    if (j - 3 < 0) return false
    return grid[i][j] === "X" && grid[i - 1][j - 1] === "M" && grid[i - 2][j - 2] === "A" && grid[i - 3][j - 3] === "S"
}

const four2 = (input: string) => {
    const grid = input.split('\n').map(line => line.trim().split(''))
    let counter = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (isXmas(i, j, grid)) counter++
        }
    }

    return counter
}

const isXmas = (i: number, j: number, grid: string[][]) => {
    if (i - 1 < 0) return false
    if (j - 1 < 0) return false
    if (i + 1 >= grid.length) return false
    if (j + 1 >= grid[i].length) return false

    return isMas(grid[i-1][j-1], grid[i][j], grid[i + 1][j + 1]) && isMas(grid[i-1][j+1], grid[i][j], grid[i + 1][j - 1])
}

const isMas = (a: string, b: string, c: string) => {
    return `${a}${b}${c}` === "MAS" || `${a}${b}${c}` === "SAM"
}


console.log(four1(input4.trim()))
console.log(four2(input4.trim()))