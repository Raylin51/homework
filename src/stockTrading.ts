/*
***************************
  题目：股票交易的最佳时机
***************************
*/
const trading = (prices: number[]): number => {
    let min = prices[0]
    let maxIncome = 0
    prices.map(item => {
        if (item < min) {
            min = item
        } else {
            maxIncome = Math.max(maxIncome, item - min)
        }
    })
    return maxIncome
}