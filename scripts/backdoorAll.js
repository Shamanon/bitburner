/** @param {NS} ns **/
export async function main(ns) {
/* Script to copy "SmolHack.js" to all servers with ram */

	function serverCheck(target) {
		/* target */
		let maxRAM = ns.getServerMaxRam(target);
		let isRooted = ns.hasRootAccess(target);
		let reqHack = ns.getServerRequiredHackingLevel(target);
		let minSec = ns.getServerMinSecurityLevel(target);
		let maxMoney = ns.getServerMaxMoney(target);
		return [target, maxRAM, isRooted, reqHack, minSec, maxMoney]
	}
  function backdoor(host){
    ns.tprint('No backdoor, copying script to '+host);
    ns.scp('backdoor.js',host);
    ns.exec('backdoor.js',host);
    isDone.push(host);
  }

	var hostname = 'home';
	var script_args = []
	
	let servers = serverCheck(hostname);
	let scanned = [hostname];
	let scanner2 = [];
	let scanner3 = [];
	let scanner = ns.scan(hostname);
	let checkme = 1;
	let rootable = [];
	let earnable = [];
  var isDone = ns.getPurchasedServers();
  isDone.push("home","darkweb");

	ns.tprint(servers);

	/* As long as there's something to scan, scan*/
	while (checkme > 0) {
		/* Loop through the SCANNER object, scanning identified servers..*/
		for (let i = 0; i < scanner.length; i++) {
			/* If the server isn't in the SERVERS list, scan it, add it to the scanned list. */
			if (servers.indexOf(scanner[i]) == -1) {
				servers.push(serverCheck(scanner[i]));

				if (ns.getServerMaxMoney(scanner[i]) > 0) {
					if (ns.getServerRequiredHackingLevel(scanner[i]) <= ns.getHackingLevel()) {
						earnable.push(scanner[i]);
					}
				}

				let scanner2 = (ns.scan(scanner[i]));
				/* Check the scan results just retrieved to see if they are unique, and if they've already been scanned.  */
				for (let i2 = 0; i2 < scanner2.length; i2++) {
					if (scanned.indexOf(scanner2[i2]) == -1) {
						scanner3.push(scanner2[i2]);
					}
				}
				scanned.push(scanner[i]);
			}
		}
		scanner = scanner3;
		scanner3 = [];
		checkme = scanner.length;

	}
	for (let i = 0; i < scanned.length; i++) {
    if(ns.getServer(scanned[i]).backdoorInstalled && isDone.indexOf(scanned[i]) == -1){
      ns.tprint(scanned[i]+' already has a backdoor!');
    }else if(isDone.indexOf(scanned[i]) == -1){
      ns.tprint(scanned[i]+' needs backdoor.')
      backdoor(scanned[i]);
    }
		
	}

}