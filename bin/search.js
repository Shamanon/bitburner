/*
  Find server by a search string and optionally print comand to connect to it.
  I reccomend aliasing it like this: alias search="run search.js"
*/
import { getServers } from '/inc/include.js';
/** @param {NS} ns **/
export async function main(ns) {
    /* search for a hostname and trace path to it*/
    function trace(path) {
        while (path[0] !== "home")
            path.unshift(ns.scan(path[0])[0]);
        ns.tprint(path.join('-->'));
        if (conCom == 1)
            ns.tprint("Go: connect " + path.join('; connect '));
    }
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1) {
        ns.tprint("This script searches for and shows path to a host.\nAdd a 1 on the end to generate connect commaand.");
        ns.tprint(`Usage: run ${ns.getScriptName()} SEARCHTERM GENERATECOMMAND`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} csec`);
        return;
    }
    const term = args._[0];
    const conCom = args._[1];
    let scanned = getServers(ns, true);
    ns.tprint("Searching for hosts conaing " + term);
    let found = false;
    for (let i = 0; i < scanned.length; i++) {
        let text = scanned[i].toLowerCase();
        if (text.search(term.toLowerCase()) != -1) {
            ns.tprint("Found: " + scanned[i]);
            trace([scanned[i]]);
            found = true;
        }
    }
    if (!found)
        ns.tprint("No resutls for " + term);
}