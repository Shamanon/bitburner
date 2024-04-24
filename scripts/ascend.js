/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  var myGang = ns.gang.getMemberNames();
  while (true) {
    for (let member of myGang) {
      let info = ns.gang.getAscensionResult(member);
      if (info.hack > 1.5) {
        ns.gang.ascendMember(member);
        ns.print(member + " ascended!");
      }
    }
    await ns.sleep(60000);
  }
}