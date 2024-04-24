/** @param {NS} ns */
export async function main(ns) {
    var imDone = false;
    var server = ns.getHostname();
    var sLevel = ns.getServerRequiredHackingLevel(server);
    var myLevel;
    while (!imDone) {
        myLevel = ns.getHackingLevel();
        if (myLevel >= sLevel) {
            //ns.alert(server+' ready to backdoor!');
            imDone = true;
            ns.exit();
        }
        await ns.sleep(600000);
    }
}