/** @param {NS} ns */
export async function main(ns) {
  function myMoney() {
    return ns.getServerMoneyAvailable("home");
  }

  ns.disableLog("getServerMoneyAvailable");
  //ns.disableLog("sleep");
  var desiredLevel = 100; // max 200
  var desiredRam = 8; // max 64
  var desiredCores = 2; // max 16
  var cnt = ns.hacknet.numNodes();
  var res;
  var cash = myMoney();
  
  for (var i = 0; i < cnt; i++) {
    while (ns.hacknet.getNodeStats(i).level < desiredLevel) {
      let cost = ns.hacknet.getLevelUpgradeCost(i, 1);
      cash = myMoney();
      if(cash < cost) {
        ns.print(i+" Levelup needs $" + cost + " . Have $" + cash);
        await ns.sleep(300000);
        cash = myMoney();
      }
      res = ns.hacknet.upgradeLevel(i, 1);
    }
    while (ns.hacknet.getNodeStats(i).cores < desiredCores){
      let cost = ns.hacknet.getCoreUpgradeCost(i,1);
      cash = myMoney();
      if(cash < cost) {
        ns.print(i+" Coreup needs $" + cost + " . Have $" + cash);
        await ns.sleep(300000);
        cash = myMoney();
      }
      res = ns.hacknet.upgradeCore(i, 1);
    }
    while (ns.hacknet.getNodeStats(i).ram < desiredRam){
      let cost = ns.hacknet.getRamUpgradeCost(i,1);
      cash = myMoney();
      if(cash < cost) {
        ns.print(i+" Ramup need $" + cost + " . Have $" + cash);
        await ns.sleep(300000);
        cash = myMoney();
      }
      res = ns.hacknet.upgradeRam(i, 1);
    }   
  }


  ns.print("All nodes upgraded to level " + desiredLevel);


}