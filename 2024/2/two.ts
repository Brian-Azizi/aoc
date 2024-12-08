import {Input2} from "./Input-2";
import {sum, toInt} from "../../utils";

const reports = Input2.trim().split("\n").map(line => line.trim().split(' ').map(toInt));

const isSafeDist = (a: number | null, b: number | null) => {
    if (a === null || b === null) return true
    const diff = b - a
    return diff >= 1 && diff <= 3;
}

const isSafeDist2 = (a: number, b: number, c: number): boolean | 'a' | 'b' | 'c' => {
    if (isSafeDist(a, b) && isSafeDist(b, c)) return true

    if (isSafeDist(a, b)) return 'c'
    if (isSafeDist(a, c)) return 'b'
    if (isSafeDist(b, c)) return 'a'
    return false
}

function isReportSafe(report: number[]) {
    if (report.length === 0) return true
    if (report.length === 1) return true
    if (report.length === 2) return isSafeDist(report[0], report[1]) || isSafeDist(report[1], report[0]);

    let isSafe = true
    const isIncreasing = report[1] > report[0]

    for (let i = 1; i < report.length; i++) {
        const a = report[i - 1]
        const b = report[i]
        if (isIncreasing) {
            isSafe = isSafeDist(a, b)
        } else {
            isSafe = isSafeDist(b, a)
        }
        if (!isSafe) break
    }

    return isSafe
}

function isReportTolerableSafe(report: number[]) {
    if (isReportSafe(report)) return true
    for (let i = 0; i < report.length; i++) {
        const cutReport = [...report.slice(0, i), ...report.slice(i + 1)];
        if (isReportSafe(cutReport)) return true
    }
    return false
}


const one = () => {
    const safeReports = reports.filter(isReportSafe)
    return safeReports.length
}
console.log(one())


const two = () => {
    const safeReports = reports.filter(isReportTolerableSafe)
    return safeReports.length
}

console.log(two())

