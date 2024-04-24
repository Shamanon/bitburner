import { getServers } from "/inc/include.js";
/** @param {NS} ns **/
export async function main(ns) {
    /* Script to backdoor all servers using HTML injection */
    ns.alert("Backdooring servers. Do not leave the terminal until this script completes.");
    const scanned = getServers(ns, false);
    for (let i = 0; i < scanned.length; i++) {
        if (ns.getServer(scanned[i]).backdoorInstalled) {
            continue;
        }
        else if (ns.getServer(scanned[i]).requiredHackingSkill <= ns.getHackingLevel() &&
            ns.getServer(scanned[i]).hasAdminRights) {
            ns.tprint("Backdooring " + scanned[i] + 'using HTML injection...');
            let host = scanned[i];
            let path = [host];
            while (path[0] !== "home")
                path.unshift(ns.scan(path[0])[0]);
            var doc = eval('document');
            const terminalInput = doc.getElementById("terminal-input");
            terminalInput.value = path.join(";connect ");
            let handler = Object.keys(terminalInput)[1];
            terminalInput[handler].onChange({ target: terminalInput });
            terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
            terminalInput.value = "backdoor";
            handler = Object.keys(terminalInput)[1];
            terminalInput[handler].onChange({ target: terminalInput });
            terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
            var done = false;
            while (!done) {
                let doc = eval("document");
                let tOut = Array.from(doc.getElementById("terminal").getElementsByTagName("li"));
                for (let li of tOut) {
                    if (li.textContent == "Backdoor on '" + host + "' successful!") {
                        done = true;
                        break;
                    }
                }
                await ns.sleep(500);
            }
            terminalInput.value = "home";
            handler = Object.keys(terminalInput)[1];
            terminalInput[handler].onChange({ target: terminalInput });
            terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
        }
    }
    ns.alert("Backdooring complete. You are free to leave the terminal.");
}