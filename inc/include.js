/* custom hacking frunctions */

// get list off all available servers
export function getServers(ns, getAll = false) {
  var skip = ['darkweb'];
  var hosts = [];

  function serverOut(i) {
    for (let out of i) {
      if (!skip.includes(out)) {
        skip.push(out);
        if (!hosts.includes(out)) hosts.push(out);
        serverOut(ns.scan(out));
      }
    }
  }

  for (let server of ns.scan(ns.getHostname())) {
    if (server.includes("RAM") && !getAll) skip.push(server);
    if (!skip.includes(server)) {
      hosts.push(server);
      serverOut(ns.scan(server));
    }
  }

  return hosts.sort();
  /* potential code to try later 
  const foundServers = new Set([`home`]);
  for (const server of foundServers){ 
    if(server.includes("RAM") && !getAll) skip.push(server);
    if(!skip.includes(server)){
      ns.scan(server).forEach(adjacentServer => foundServers.add(adjacentServer));
    }
  }
  return [...foundServers].sort();
  // Only servers you own (`home` & all purchased servers)
  const ownServers = getServers().filter(server => ns.getServer(server).purchasedByPlayer);
  // Only servers you don't own
  const otherServers = getServers().filter(server => !ns.getServer(server).purchasedByPlayer);

  */
}

// print path to server
export function getPath(ns, host) {
  let path = [host];
  while (path[0] !== "home") path.unshift(ns.scan(path[0])[0]);
  return path.join("-->");
}

// get server info
export function serverCheck(ns, target) {
  /* target */
  var info = ns.getServer(target);
  let maxRAM = ns.getServerMaxRam(target);
  let isRooted = ns.hasRootAccess(target);
  let reqHack = ns.getServerRequiredHackingLevel(target);
  let minSec = ns.getServerMinSecurityLevel(target);
  let maxMoney = ns.getServerMaxMoney(target);
  let backdoor = info.backdoorInstalled;
  return [target, maxRAM, isRooted, reqHack, minSec, maxMoney, backdoor];
}

// hack a server
export function pwn(ns, target) {
  const func = {
    'BruteSSH.exe' : ns.brutessh, 
    'FTPCrack.exe' : ns.ftpcrack, 
    'relaySMTP.exe' : ns.relaysmtp, 
    'HTTPWorm.exe' : ns.httpworm, 
    'SQLInject.exe' : ns.sqlinject, 
    'NUKE.exe' : ns.nuke
  }
  let i = 0;
  for (var script in func) {
    if (ns.fileExists(script)) {
      i++;
      func[script](target);
    }
  }
  return i;
}

// how many ports can I pwn?
export function numPorts(ns) {
  const scripts = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
  let i = 0;
  for (let script of scripts) {
    if (ns.fileExists(script)) {
      i++;
    }
  }
  return i;
}