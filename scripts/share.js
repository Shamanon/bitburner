/** @param {NS} ns **/
export async function main(ns) {
    // Logging
    ns.disableLog('ALL');
    //ns.tail();
    // Main
    while (true) {
        ns.print("Time: " + new Date().toLocaleTimeString());
        await ns.share();
        let sharePower = ns.getSharePower();
        ns.print("Share Power is " + sharePower);
        ns.print("--------------------------------");
    }
}