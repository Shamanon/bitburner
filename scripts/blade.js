/** @param {NS} ns */
export async function main(ns) {
  var cont = true;
  var level = 10;
  var counter = 0;
  while (cont) {
    for (let skill of ns.bladeburner.getSkillNames()) {
      if (ns.bladeburner.getSkillLevel(skill) < level && !(skill == "Overclock" && level > 90)) {
        while (ns.bladeburner.getSkillPoints() < ns.bladeburner.getSkillUpgradeCost(skill)) {
          await ns.sleep(30000);
        }
        ns.bladeburner.upgradeSkill(skill);
        counter++;

      }
    }
    if (counter == 0) level += 5;
    counter = 0;
  }
}