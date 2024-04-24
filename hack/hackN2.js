/** @param {NS} ns **/
import { getServers, pwn, numPorts } from '/inc/include.js';
export async function main(ns) {
  /* Script to attack all servers with max threads */
  const arg = ns.flags([["debug", false], ["hnet", false]]);
  ns.disableLog('ALL');
  const script = '/hack/hack2.js';
  var script_args = [];
  var neededRam = ns.getScriptRam(script);
  var earnableThreshold = 1;
  var keepFree = ns.getServerMaxRam('home') * .025;
  const div = 1;
  if (arg.debug)
    ns.tail();
  if (arg.debug)
    ns.print('----PWNing servers---');
  while (true) {
    var portTakers = numPorts(ns);
    var servers = getServers(ns, true); //returns list of all servers
    servers.unshift('home');
    var pwnd = [];
    var earnable = [];
    /* pwn all pwnable servers and look for money on pwnt servers */
    for (let x = 0; x < servers.length; x++) {
      if (servers[x].includes("hacknet-server") && !arg.hnet) continue;
      let thisServ = ns.getServer(servers[x]);
      let isPwnd = thisServ.hasAdminRights;
      // pwn servers
      if (!pwnd.includes(servers[x]) && !isPwnd &&
        thisServ.numOpenPortsRequired <= portTakers) {
        pwn(ns, servers[x]);
        pwnd.push([thisServ.maxRam, servers[x]]);
        if (arg.debug) {
          ns.print('Gained root on ' + servers[x]);
        }
        else
          ns.toast(servers[x] + ' PWNT!');
        isPwnd = true;
      }
      else if (isPwnd && !pwnd.includes(servers[x]))
        pwnd.push([thisServ.maxRam, servers[x]]);
      // copy hack script
      if (!ns.fileExists(script, servers[x]))
        ns.scp(script, servers[x]);
      // find earnable servers and add to array
      if (isPwnd) {
        
        let maxMoney = thisServ.moneyMax;
        if (maxMoney > earnableThreshold && !earnable.includes(servers[x]) &&
          thisServ.requiredHackingSkill <= (ns.getHackingLevel()/div) + div - 1
          && thisServ.serverGrowth > 10) {
          let rating = (thisServ.serverGrowth * maxMoney * 
            (ns.getHackingLevel() - thisServ.requiredHackingSkill)) /
            (ns.formulas.hacking.hackTime(thisServ,ns.getPlayer()) + 
              ns.formulas.hacking.growTime(thisServ,ns.getPlayer()) + 
              ns.formulas.hacking.weakenTime(thisServ,ns.getPlayer()));
            
          earnable.push([rating, servers[x]]);
          if (arg.debug)
            ns.print('Added ' + servers[x]) + ' as earnable.';
        }
      }
    }
    // hack all earnable servers from all pwnt servers
    if (earnable.length > 0) { //Don't do this if there are no targets.
      let hackMe = [];
      let myHosts = [];
      var hi = 0;
      hackMe = [...earnable]; // copy array to new ref
      myHosts = [...pwnd];
      hackMe.sort(function (a, b) { return a[0] - b[0]; }).reverse();
      myHosts.sort(function (a, b) { return a[0] - b[0]; }).reverse();
      for (let i = 0; i < myHosts.length; i++) {
        let thatServ = ns.getServer(myHosts[i][1]);
        hi = i;
        while(hi >= hackMe.length) hi = hi-hackMe.length;
        let usableRAM = thatServ.maxRam - thatServ.ramUsed;
        if (myHosts[i][1] == 'home' && usableRAM < keepFree)
          continue;
        if (myHosts[i][1] == 'home')
          usableRAM = usableRAM - keepFree;
        if (usableRAM < neededRam)
          continue;
        let totalThreads = Math.floor(usableRAM / neededRam);
        if (arg.debug) {
          ns.print("hacking " + hackMe[hi][1] + " from " + myHosts[i][1]);
        }

        if (totalThreads < 1)
          continue;
        //variables to send to hacking script
        script_args[0] = hackMe[hi][1];
        script_args[1] = totalThreads;
        //hack server
        ns.exec(script, myHosts[i][1], totalThreads, ...script_args);
        if (arg.debug)
          ns.print('Hacking ' + hackMe[hi][1] + ' from ' + myHosts[i][1] + ' with ' + myThreads + ' threads.');

      }
    }
    await ns.asleep(100);
  }
}