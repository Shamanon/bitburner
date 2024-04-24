/** @param {NS} ns */
import { numPorts } from '/inc/include.js';
export async function main(ns) {
  ns.killall();
  const args = ns.flags([['mkserv', false], ['gangs', false], ['blade', false], ['hnet', false]]);
  ns.disableLog('ALL');
  ns.run('/ext/autoinfiltrate.js');
  ns.run('/sing/backdoor.js');
  ns.run('/hack/hackN2.js');
  if (args.gangs) ns.run('/scripts/gang.js');
  if (args.blade) {
    ns.run('/scripts/blade.js');
    ns.run('/scripts/electricSheep.js');
  }
  var loop = true;
  var tor = false;
  const scripts = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
  while (loop) {
    let ports = numPorts(ns);
    if (ns.getServerMoneyAvailable('home') >= 200000 && !tor) {
      ns.singularity.purchaseTor();
      ns.print('router purchased');
      tor = true;
    }
    if (tor && ports < 5) for (let prog of scripts) ns.singularity.purchaseProgram(prog);
    ports = numPorts(ns);
    if (ports == 5) {
      loop = false;
      ns.print('all scripts owned');
    } else await ns.sleep(5000);
  }

  if (args.mkserv) ns.run('/hack/mkServers.js');

  if (args.hnet) ns.run('/scripts/hacknet.js', 1, '--upgrade');
  loop = true;
  while (loop) {
    let cost = ns.singularity.getUpgradeHomeRamCost();
    let cash = ns.getServerMoneyAvailable('home');
    if (cash >= cost) {
      ns.singularity.upgradeHomeRam();
      ns.print('Home RAM upgraded.')
    }
    cost = ns.singularity.getUpgradeHomeCoresCost();
    cash = ns.getServerMoneyAvailable('home');
    if (cash >= cost) {
      ns.singularity.upgradeHomeCores();
      ns.print("Home Cores Upgraded.")
    }
    await ns.sleep(5000);
  }
}