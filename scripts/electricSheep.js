/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  const cities = ['Sector-12', 'Aevum', 'Volhaven', 'Chongqing', 'New Tokyo', 'Ishima'];
  var chaos = 5;
  var recruit = false;
  var analyze = 1; // how much time to spend on field analysis
  var diplo = 10; // how much time to spend on diplomacy
  while (true) {
    for (let city of cities) {
      ns.bladeburner.switchCity(city);
      let time = ns.bladeburner.getActionTime('general', 'Training');
      let stamina = ns.bladeburner.getStamina();
      if (stamina[0] < stamina[1] || stamina[1] < 100) {
        ns.bladeburner.startAction('general', 'Training');
        await ns.sleep(time + 10);
        stamina = ns.bladeburner.getStamina();
        time = ns.bladeburner.getActionTime('general', "Field Analysis");
        while (stamina[0] < stamina[1]) {
          ns.bladeburner.startAction('general', "Field Analysis");
          await ns.sleep((time * analyze) + 10);
          stamina = ns.bladeburner.getStamina();
        }
      }
      if (recruit) {
        time = ns.bladeburner.getActionTime('general', "Recruitment");
        ns.bladeburner.startAction('general', "Recruitment");
        await ns.sleep((time * 2) + 10);
      }
      let counter = diplo;
      while (ns.bladeburner.getCityChaos(city) > chaos) {
        time = ns.bladeburner.getActionTime('general', "Diplomacy");
        ns.bladeburner.startAction('general', "Diplomacy");
        await ns.sleep((time) + 10);
        counter -= 1;
        if (counter < 1) break;
      }
      let contracts = ns.bladeburner.getContractNames();
      for (let contract of contracts) {
        let chance = ns.bladeburner.getActionEstimatedSuccessChance('contracts', contract);
        ns.print(contract + ': ' + chance);
        if (chance[0] > 0.8 && chance[1] == 1) {
          let time = ns.bladeburner.getActionTime('contracts', contract);
          ns.bladeburner.startAction('contract', contract);
          await ns.sleep((time * 2) + 10);
        }
      }
      let ops = ns.bladeburner.getOperationNames();
      for (let op of ops) {
        let chance = ns.bladeburner.getActionEstimatedSuccessChance('ops', op);
        ns.print(op + ': ' + chance);
        if ((chance[0] > 0.8 && chance[1] == 1) && op != 'Raid' && op != 'Sting Operation') {
          let time = ns.bladeburner.getActionTime('ops', op);
          ns.bladeburner.startAction('ops', op);
          await ns.sleep((time * 2) + 10);
        }
      }
      var x = false;
      var blop = ns.bladeburner.getNextBlackOp();

      let chance = ns.bladeburner.getActionEstimatedSuccessChance('blackop', blop.name);
      if ((chance[0] > 0.75) && ns.bladeburner.getRank() >= blop.rank) {
        ns.bladeburner.setTeamSize('blackops', blop.name, 2);
        let time = ns.bladeburner.getActionTime('blackop', blop.name);
        if (ns.bladeburner.startAction('blackops', blop.name)) await ns.sleep(time + 10);
        x = true;
      }

      if (x) recruit = true;
      else recruit = false;
    }
    if (chaos > 200) chaos -= 200;
    else if (chaos > 50) chaos -= 50;
    await ns.sleep(10);
  }
}