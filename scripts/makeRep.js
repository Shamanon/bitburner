/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  while (true) {
    var doc = eval('document');
    /* select ecorp to infiltrate */
    let link = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.jss1.MuiBox-root.css-0 > p:nth-child(20) > span > b");
    if (link !== null) {
      ns.print("found link!");
      await link.click();
    }
    /* select infiltrate action */
    let infilButt = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.jss1.MuiBox-root.css-0 > div.MuiBox-root.css-1yit1qw > button");
    if (infilButt !== null) {
      ns.print("found infiltrate button!");
      await infilButt[Object.keys(infilButt)[1]].onClick(({ isTrusted: true }));
    }
    /* take the rep */
    let button = doc.querySelector("#root > div.jss1.MuiBox-root.css-0 > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-1p7xay4 > div > div > button");
    if (button !== null) {
      ns.print(button.textContent+" found button!");
      await button.click();
    }
    /* look for crashed game */
    let start = doc.querySelector("#root > div.jss1.MuiBox-root.css-0 > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-llg1yp > div > button:nth-child(1)");
    if (start !== null && start.textContent == 'Start') {
      await ns.sleep(1000)
      ns.print("game crashed, restarting!");
      await start.click();
    }
    await ns.sleep(100);
  }
}