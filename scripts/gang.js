/** @param {NS} ns */
export async function main(ns) {
  var myGang = ns.gang.getMemberNames();
  while (true) {
    for (let member of myGang) {

      //let tasks = ns.gang.getTaskNames(member);
      //let info = ns.gang.getMemberInformation(member);
      //ns.tprint(tasks);
      
      //ns.gang.setMemberTask(member, 'Territory Warfare');
      let equip = ns.gang.getEquipmentNames(member);
      for (let thing of equip) {
        if (ns.gang.getEquipmentCost(thing) < ns.getServerMoneyAvailable('home')) ns.gang.purchaseEquipment(member, thing);
        else ns.exit();
      }

      //let info = ns.gang.getMemberInformation(member);
      //if (ns.formulas.gang.ascensionPointsGain(info.hack_exp) > 2) ns.gang.ascendMember(member);
    }
    ns.exit();
    await ns.sleep(60000);
  }
}