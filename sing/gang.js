/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var names = ['Rick', 'Morty', 'Summer', 'Beth', 'Jerry', 'Poopy', 'GearHead', 'BirdPerson', 'Squanch', 'Schwifty', 'Unity', 'Jessica'];
  while (ns.heart.break() < 54000) {
    if (ns.singularity.getCrimeChance('Homicide') > 50)
      ns.singularity.commitCrime('Homicide');
    else {
      let facts = ns.getPlayer().factions;
      for (let fact of facts) {
        if (ns.singularity.workForFaction(fact, 'field')) breaK();
      }
    }
    await ns.sleep(600000);
  }
  ns.gang.createGang('Nitesec');
  for(let i = 0; names.length() > 9; i++) ns.gang.recruitMember(names.shift());

  while (true) {
    var myGang = ns.gang.getMemberNames();
    for (let member of myGang) {
      ns.gang.setMemberTask(member, 'Territory Warfare');
      let equip = ns.gang.getEquipmentNames(member);
      for (let thing of equip) {
        if (ns.gang.getEquipmentCost(thing) < ns.getServerMoneyAvailable('home'))
          ns.gang.purchaseEquipment(member, thing);
        else
          continue;
      }
      //let info = ns.gang.getMemberInformation(member);
      //if (ns.formulas.gang.ascensionPointsGain(info.hack_exp) > 2) ns.gang.ascendMember(member);
    }
    //ns.exit();
    await ns.sleep(60000);
  }
}