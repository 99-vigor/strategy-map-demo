export const toDigits = (num: number, digits: number) => {
    const tenPow = Math.pow(10, digits)
    return Math.round(num * tenPow) / tenPow
}
