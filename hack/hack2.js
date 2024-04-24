/** @param {NS} ns **/
export async function main(ns) {
    /* Developed off basic_hack.js
      this version takes into account the use of hacknet servers 
      to modify the server we are hacking
    */
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    const threads = args._[1];
    if (args.help || !hostname) {
        ns.tprint("This script will generate money by hacking a target server.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }
    //Abort script if server has no money capacity.//
    if (ns.getServerMaxMoney(hostname) == 0) {
        ns.tprint("Aborting, server does not make money.");
        return;
    }

    while (true) {
        if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname) + 2) {
            await ns.weaken(hostname);
        }
        else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname) * 0.75) {
            await ns.grow(hostname);
        }
        else {
            await ns.hack(hostname);
            ns.exit();
        }
    }
}