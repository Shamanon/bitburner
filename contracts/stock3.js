/** @param {NS} ns */
export async function main(ns) {
  let data = [85,80,99,107,151,83,194,21,82,151,175,101,87,188,88,166,7,55,113,53,74,116,103,140,60,146,198,61,44,24,95,89,131,68,132,10,93,55,57,64,53,81];
  let hold1 = Number.MIN_SAFE_INTEGER
  let hold2 = Number.MIN_SAFE_INTEGER
  let release1 = 0
  let release2 = 0
  for (const price of data) {
    release2 = Math.max(release2, hold2 + price)
    hold2 = Math.max(hold2, release1 - price)
    release1 = Math.max(release1, hold1 + price)
    hold1 = Math.max(hold1, price * -1)
  }
  ns.tprint(release2);
}