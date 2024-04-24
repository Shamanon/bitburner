/** @param {NS} ns **/
export async function main(ns) {
    // Purchase server script.
    // This is a modified version of ServerMaker.js from github
    //ns.tprint(servers);
    var lowestRAM = 99999999;
    var currentRAM = 99999999;
    var highestRAM = 8;
    var targetserver = 'home';
    var host = '';
    var keepGoing = true;
    var wait = 10000;
    ns.tail();
    ns.disableLog('ALL');
    while (keepGoing) {
        let servers = (ns.getPurchasedServers());
        let servernumber = servers.length;
        let highestserver = servernumber;
        for (let i = 0; i < servers.length; i++) {
            currentRAM = (ns.getServerMaxRam(servers[i]));
            if (lowestRAM > currentRAM) {
                lowestRAM = currentRAM;
                targetserver = servers[i];
            }
            if (highestRAM < currentRAM)
                highestRAM = currentRAM;
            servernumber = (servers[i].slice(servers[i].length - 2));
            let servernumber3digit = (servers[i].slice(servers[i].length - 3));
            if (parseInt(servernumber3digit) > parseInt(servernumber))
                servernumber = servernumber3digit;
            if (parseInt(servernumber) > highestserver)
                highestserver = parseInt(servernumber);
        }
        if (lowestRAM == 1048576) {
            keepGoing = false;
            ns.print('All upgraded! Goodbye!');
            ns.exit();
        }
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(highestRAM * 8)) {
            if (servers.length == ns.getPurchasedServerLimit()) {
                ns.killall(targetserver);
                ns.deleteServer(targetserver);
            }
            host = "RAM" + highestRAM * 8 + "-" + (highestserver + 1);
            ns.purchaseServer(host, highestRAM * 8);
        }
        else if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(highestRAM * 4)) {
            if (servers.length == ns.getPurchasedServerLimit()) {
                ns.killall(targetserver);
                ns.deleteServer(targetserver);
            }
            host = "RAM" + highestRAM * 4 + "-" + (highestserver + 1);
            ns.purchaseServer(host, highestRAM * 4);
        }
        else if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(highestRAM * 2)) {
            if (servers.length == ns.getPurchasedServerLimit()) {
                ns.killall(targetserver);
                ns.deleteServer(targetserver);
            }
            host = "RAM" + highestRAM * 2 + "-" + (highestserver + 1);
            ns.purchaseServer(host, highestRAM * 2);
        }
        else if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(highestRAM) && servers.length < ns.getPurchasedServerLimit()) {
            host = "RAM" + highestRAM + "-" + (highestserver + 1);
            ns.purchaseServer(host, highestRAM);
        }
        else if (lowestRAM < highestRAM && servers.length == ns.getPurchasedServerLimit()) {
            if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(highestRAM)) {
                ns.killall(targetserver);
                ns.deleteServer(targetserver);
                host = "RAM" + highestRAM + "-" + (highestserver + 1);
                ns.purchaseServer(host, highestRAM);
            }
            else
                while (lowestRAM < (highestRAM / 2)) {
                    if (lowestRAM < highestRAM / 2 && servers.length == ns.getPurchasedServerLimit()) {
                        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(highestRAM / 2)) {
                            ns.killall(targetserver);
                            ns.deleteServer(targetserver);
                            host = "RAM" + highestRAM / 2 + "-" + (highestserver + 1);
                            ns.purchaseServer(host, highestRAM / 2);
                            highestRAM = lowestRAM;
                        }
                    }
                    highestRAM = highestRAM / 2;
                }
        }
        if (host != '') {
            ns.print('Added server: ' + host);
            host = '';
        }
        lowestRAM = 99999999;
        await (ns.asleep(wait));
    }
}