/** @param {NS} ns **/

import { getServers, pwn, numPorts } from '/inc/include.js';

export async function main(ns) {
  /* Script to attack all servers with max threads */
  const arg = ns.flags([["debug", false]]);
  ns.disableLog('ALL');
  const script = '/hack/hack.js';
  var script_args = [];
  var neededRam = ns.getScriptRam(script);
  var earnableThreshold = 0;
  var keepFree = 5;
  if (arg.debug) ns.tail();

  if (arg.debug) ns.print('----PWNing servers---');

  while (true) {

    var portTakers = numPorts(ns);
    var servers = getServers(ns, true); //returns list of all servers
    var pwnd = [];
    var earnable = [];

    /* pwn all pwnable servers and look for money on pwnt servers */
    for (let x = 0; x < servers.length; x++) {

      let isPwnd = ns.hasRootAccess(servers[x]);
      // pwn servers
      if (!pwnd.includes(servers[x]) && !isPwnd &&
        ns.getServerNumPortsRequired(servers[x]) <= portTakers) {
        pwn(ns, servers[x]);
        pwnd.push(servers[x]);
        if (arg.debug) {
          ns.print('Gained root on ' + servers[x]);
        } else ns.toast(servers[x] + ' PWNT!');
        isPwnd = true;
      } else if (isPwnd && !pwnd.includes(servers[x])) pwnd.push(servers[x]);
      // copy hack script
      if (!ns.fileExists(script, servers[x])) ns.scp(script, servers[x]);
      // find earnable servers and add to array
      if (isPwnd) {
        let maxMoney = ns.getServerMaxMoney(servers[x]);
        if (maxMoney > earnableThreshold && !earnable.includes(servers[x]) &&
          ns.getServerRequiredHackingLevel(servers[x]) <= ns.getHackingLevel()) {
          earnable.push([maxMoney, servers[x]]);
          if (arg.debug) ns.print('Added '+servers[x])+' as earnable.';
        }
      }
    }

    // hack all earnable servers from all pwnt servers
    if (earnable.length > 0) { //Don't do this if there are no targets.
      let hackMe = [];
      for (let i = 0; i < pwnd.length; i++) {

        hackMe = [...earnable]; // copy array to new ref
        
        hackMe.sort(function (a, b) { return a[0] - b[0]; }).reverse();

        let usableRAM = ns.getServerMaxRam(pwnd[i]) - ns.getServerUsedRam(pwnd[i]);
        if (pwnd[i] == 'home') usableRAM = usableRAM - keepFree;

        if (usableRAM < neededRam) continue;

        let perHostRAM = usableRAM / hackMe.length;
        // if not enough RAM, remove least valuable servers 
        while (perHostRAM < neededRam) {
          hackMe.pop();
          perHostRAM = usableRAM / hackMe.length;
        }

        var myCount = hackMe.length;

        let totalCash = hackMe.reduce((partialSum, a) => partialSum + a[0], 0);
        let totalThreads = Math.floor(usableRAM / neededRam);
        
        if(arg.debug){ 
          ns.print(hackMe);
          ns.print(totalCash+':'+totalThreads+':'+myThreads);
        }

        for (let i2 = 0; i2 < hackMe.length; i2++) {
          //simplify
          let server = hackMe[i2][1];
          let targetMax = hackMe[i2][0];
          //get number of threads to use for this hack
          let myPercent = targetMax / totalCash;
          let myThreads = Math.floor(totalThreads * myPercent);
          if (myThreads < 1) myThreads = 1;
          //variables to send to hacking script
          script_args[0] = server;
          script_args[1] = targetMax;
          script_args[2] = ns.getServerMinSecurityLevel(hackMe[i2][1]);;
          script_args[3] = myThreads;
          //hack server
          ns.exec(script, pwnd[i], myThreads, ...script_args);
          if (arg.debug) ns.print('Hacking ' + server + ' from ' + pwnd[i] + ' with ' + myThreads + ' threads.');
          else ns.toast('Hacking ' + server + ' from ' + pwnd[i] + ' with ' + myThreads + ' threads.');
        }
        //show info on hack
        if (myCount > 0) {
          if (arg.debug) ns.print('Hacking ' + myCount + ' servers from ' + pwnd[i]);
          else ns.toast('Hacking ' + myCount + ' servers from ' + pwnd[i]);
        }
      }
    }
    await ns.asleep(10000);
  }
}