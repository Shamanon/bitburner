/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let script = '/scripts/share.js';
    function deployShare(server) {
        if (!ns.fileExists(script, server))
            ns.scp(script, server, 'home');
        ns.killall(server); //Useful sometimes
        let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        let ramPerThread = ns.getScriptRam(script);
        let threadsAvailable = Math.floor(ramAvailable / ramPerThread) - 128;
        ns.tprint(threadsAvailable + " threads can be ran on " + server);
        if (threadsAvailable > 0) {
            //if (!threads) threads = threadsAvailable;
            ns.tprint("Starting share.js on " + server);
            ns.exec(script, server, threadsAvailable);
        }
        else {
            ns.tprint("NOT ENOUGH MEMORY ON " + server);
        }
    }
    if (host == 'ALL') {
        let myHosts = ns.getPurchasedServers();
        for (let i of myHosts) {
            deployShare(i);
        }
    }
    else
        deployShare(host);
}