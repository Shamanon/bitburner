/** @param {NS} ns **/

import { getServers, pwn, numPorts } from '/inc/include.js';

export async function main(ns) {
  /* Script to attack all servers with max threads */
  ns.disableLog('ALL');
  var hostname = 'home';
  const script = '/hack/hack.js'; /* Script, hard coded. (Code forked from deploy.js) */
  var script_args = [];
  var neededRam = ns.getScriptRam(script);

  while (true) {

    var portTakers = numPorts(ns);
    var servers = getServers(ns, true);
    var pwnd = [];
    var maxMoney = [];
    var earnable = [];
    var earnableThreshold = 100000; //min value for maxMoney 

    /* pwn all pwnable servers */
    for (var server of servers) {
      let isPwnd = ns.hasRootAccess(server);

      if (!pwnd.includes(server) && !isPwnd &&
        ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() &&
        ns.getServerNumPortsRequired(server) <= portTakers) {
        pwn(ns, server);
        pwnd.push(server);
        ns.toast(server + ' PWN!');
      } else if (isPwnd && !pwnd.includes(server)) pwnd.push(server);

      if (!ns.fileExists(script, server)) ns.scp(script, server);

      maxMoney[server] = ns.getServerMaxMoney(server);
      if (maxMoney[server] > earnableThreshold && !earnable.includes(server) && isPwnd) earnable.push(server);
    }

    if (earnable.length > 0) { //Don't do this if there are no targets.
      for (let i = 0; i < pwnd.length; i++) {
        var maxServerRAM = ns.getServerMaxRam(pwnd[i]);
        var usedServerRAM = ns.getServerUsedRam(pwnd[i]);
        if (pwnd[i] == 'home') {
          usedServerRAM = usedServerRAM + 30;
        }
        var maxThreads = Math.floor(maxServerRAM - usedServerRAM);
        var generalThreads = Math.floor(maxThreads / earnable.length);
        var bonusServers = maxThreads % earnable.length;
        let myCount = 0;
        if (maxThreads >= 1) {
          for (let i2 = 0; i2 < earnable.length; i2++) {
            var targetMax = ns.getServerMaxMoney(earnable[i2]);
            var targetMin = ns.getServerMinSecurityLevel(earnable[i2]);
            script_args[0] = earnable[i2];
            script_args[1] = targetMax;
            script_args[2] = targetMin;
            if (maxThreads < neededRam) break;
            myCount++;
            if (i2 < bonusServers) {
              ns.print(earnable[i2] + '@' + pwnd[i] + ' with ' + (generalThreads + 1) + ' threads.');
              ns.exec(script, pwnd[i], (generalThreads + 1), ...script_args);
            } else if (generalThreads > 0) {
              ns.exec(script, pwnd[i], (generalThreads), ...script_args);
              ns.print(earnable[i2] + '@' + pwnd[i] + ' with ' + (generalThreads) + ' threads.');
            }
          }
        }
        if (myCount > 0) ns.toast('Hacking ' + myCount + ' servers from ' + pwnd[i]);
      }
    }
    await ns.asleep(10000);
  }
}