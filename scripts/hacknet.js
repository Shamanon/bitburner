/** @param {NS} ns */
import { getServers } from '/inc/include.js';
export async function main(ns) {
  const args = ns.flags([['upgrade', false], ['focus', false]]);
  function myMoney() {
    return ns.getServerMoneyAvailable("home");
  }
  ns.disableLog("ALL");
  //ns.disableLog("sleep");
  const upgrade = args.upgrade;
  const desiredLevel = 300; // max 300
  const desiredRam = 8192; // max 8192
  const desiredCores = 128; // max 128
  const desiredCache = 15; // max 15
  const secDiv = 1;
  const spendOn = 'Reduce Minimum Security';
  const spendOn2 = 'Increase Maximum Money'

  var pwnd = [];

  while (true) {
    var cnt = ns.hacknet.numNodes();
    var cash = myMoney();
    var servers = getServers(ns, false);
    for (let x = 0; x < servers.length; x++) {
      let thisServ = ns.getServer(servers[x]);
      if (thisServ.hasAdminRights &&
        thisServ.requiredHackingSkill <= ns.getHackingLevel() / secDiv &&
        thisServ.serverGrowth > 10) {
        let maxMoney = thisServ.moneyMax;
        let secLevel = thisServ.minDifficulty;
        if ((maxMoney < 10000000000000 && maxMoney > 0) || secLevel > 1) {
          let rating = (thisServ.serverGrowth * maxMoney * 
            (ns.getHackingLevel() - thisServ.requiredHackingSkill)) /
            (ns.formulas.hacking.hackTime(thisServ,ns.getPlayer()) + 
              ns.formulas.hacking.growTime(thisServ,ns.getPlayer()) + 
              ns.formulas.hacking.weakenTime(thisServ,ns.getPlayer()));
          pwnd.push([rating, servers[x]]);
        }
      }
    }
    pwnd.sort(function (a, b) { return a[0] - b[0]; }).reverse();
    for (let serv of pwnd) {
      let thisServ = ns.getServer(serv[1]);
      if (ns.hacknet.hashCost(spendOn) < ns.hacknet.numHashes() && thisServ.minDifficulty > 1) {
        ns.hacknet.spendHashes(spendOn, serv[1]);
        ns.print(serv[1] + ':' + spendOn + ' ' + thisServ.minDifficulty);
      }
      if (ns.hacknet.hashCost(spendOn2) < ns.hacknet.numHashes() && thisServ.moneyMax < 10000000000000) {
        ns.hacknet.spendHashes(spendOn2, serv[1]);
        ns.print(serv[1] + ':' + spendOn2 + ' ' + thisServ.moneyMax);
      }
    }
    if (!upgrade) {
      await ns.sleep(5000);
      continue;
    }
    if (cash > ns.hacknet.getPurchaseNodeCost() && cnt < 20) {
      ns.hacknet.purchaseNode();
    }
    for (var i = 0; i < cnt; i++) {
      if (ns.hacknet.getNodeStats(i).level < desiredLevel) {
        let cost = ns.hacknet.getLevelUpgradeCost(i, 1);
        cash = myMoney();
        if (cash > cost) ns.hacknet.upgradeLevel(i, 1);
      }
      if (ns.hacknet.getNodeStats(i).cores < desiredCores) {
        let cost = ns.hacknet.getCoreUpgradeCost(i, 1);
        cash = myMoney();
        if (cash > cost) ns.hacknet.upgradeCore(i, 1);
      }
      if (ns.hacknet.getNodeStats(i).ram < desiredRam) {
        let cost = ns.hacknet.getRamUpgradeCost(i, 1);
        cash = myMoney();
        if (cash > cost) ns.hacknet.upgradeRam(i, 1);
      }
      if (ns.hacknet.getNodeStats(i).cache < desiredCache) {
        let cost = ns.hacknet.getCacheUpgradeCost(i, 1);
        cash = myMoney();
        if (cash > cost) ns.hacknet.upgradeCache(i, 1);
      }
      if (args.focus) i = cnt;
    }
    await (ns.sleep(1000));
  }
}