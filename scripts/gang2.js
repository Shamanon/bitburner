/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  const members = ['Bill', 'Dave', 'Chong', 'Cheech', 'Zendaya', 'Scarlet', 'Alba', 'Gauge', 'Chris', 'Cabel', 'Rowdy', 'Dan'];
  while (true) {
    var myGang = ns.gang.getMemberNames();
    if (ns.gang.canRecruitMember()) {
      let x = myGang.length;
      ns.gang.recruitMember(members[x]);
      ns.gang.setMemberTask(members[x], 'Territory Warfare');
    }
    var us = ns.gang.getGangInformation();
    for (let i = 0; i < myGang.length; i++) {
      let member = myGang[i];
      let info = ns.gang.getAscensionResult(member);
      let stats = ns.gang.getMemberInformation(member);
      if (info && myGang.length > 11) {
        if (us.territory < 1) {
          ns.gang.setMemberTask(member, 'Train Combat');
          await ns.sleep(5000);
          ns.gang.setMemberTask(member, 'Territory Warfare');
        } else ns.gang.setMemberTask(member, 'Human Trafficking');
        if (info.strength > 1.5) {
          ns.gang.ascendMember(member);
          ns.print(member + " ascended!");
        }
        let others = ns.gang.getOtherGangInformation();
        var ready = true;
        for (const prop in others) {
          if (others[prop].power > us.power) ready = false;
        }
        if (ready && us.territory < 1) {
          ns.gang.setTerritoryWarfare(true);
        } else if (us.territory == 1) {
          ns.gang.setTerritoryWarfare(false);
        }

      } else if (info && info.strength > 2.5) {
        ns.gang.ascendMember(member);
        ns.print(member + " ascended!");
      }
      let equip = ns.gang.getEquipmentNames(member);
      for (let thing of equip) {
        if (ns.gang.getEquipmentCost(thing) < ns.getServerMoneyAvailable('home')) {
          if (ns.gang.purchaseEquipment(member, thing))
            ns.print('Purchased ' + thing + ' for ' + member);
        } else
          continue;
      }
      if (myGang.length < 12) {
        let hlevel = stats.str;
        if (hlevel > 2000) {
          ns.gang.setMemberTask(member, 'Human Trafficking');
        } else if (hlevel > 1000) {
          ns.gang.setMemberTask(member, 'Run a Con');
        } else if (hlevel > 15) {
          ns.gang.setMemberTask(member, 'Mug People');
        } else ns.gang.setMemberTask(member, 'Territory Warfare');
      }
      if(us.wantedPenalty > 5) ns.gang.setMemberTask(member, 'Vigilante Justice');
    }
    //ns.exit();
    await ns.sleep(1000);
  }
}