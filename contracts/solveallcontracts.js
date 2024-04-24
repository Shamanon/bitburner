/** @param {NS} ns */
export async function main(ns) {
    // Logging
    ns.disableLog('ALL');
    //ns.disableLog('scan');
    ns.tail();
    // Globals
    const solveContractScript = "/contracts/solvecontract.js";
    let infiniteLoopProtection = 9999;
    // Variables
    let discoveredServers = [];
    let serversToScan = ["home"];
    let contracts = [];
    ns.print("-------------------------------------------------------------");
    ns.print("Searching for servers...");
    while (serversToScan.length > 0 && infiniteLoopProtection-- > 0) {
        let purchasedServers = ns.getPurchasedServers();
        let currentServer = serversToScan.pop(); // Get the next host to be scanned
        for (const connectedServer of ns.scan(currentServer)) {
            if (!discoveredServers.includes(connectedServer)) {
                // Add hostname if not already added and not owned
                if (!purchasedServers.includes(connectedServer))
                    serversToScan.push(connectedServer);
            }
        }
        discoveredServers.push(currentServer);
    }
    ns.print(discoveredServers.length + " total servers found.");
    ns.print("-------------------------------------------------------------");
    for (const serverName of discoveredServers) {
        let contractsOnServer = 0;
        let files = ns.ls(serverName);
        //ns.print(files + "files on " + serverName);
        for (const fileName of files) {
            if (fileName.includes(".cct")) {
                let contract = {};
                contract.server = serverName;
                contract.type = ns.codingcontract.getContractType(fileName, serverName);
                contract.fileName = fileName;
                contract.data = ns.codingcontract.getData(fileName, serverName);
                contracts.push(contract);
                contractsOnServer += 1;
            }
        }
        ns.print(contractsOnServer + " contracts on " + serverName);
    }
    ns.print(contracts.length + " total contracts found.");
    ns.print("-------------------------------------------------------------");
    // Solve found contracts
    for (const contract of contracts) {
        let processID, scriptLog;
        ns.print("Solving " + contract.fileName + "...");
        // Use JSON Strigify function to pass an object to a script
        //	processID = ns.exec('/contracts/test.js', 'home', 1);
        processID = ns.run(solveContractScript, 1, JSON.stringify(contract));
        // Sleep a bit while process starts before pulling its log
        await ns.sleep(500);
        scriptLog = ns.getScriptLogs(solveContractScript, 'home', JSON.stringify(contract));
        //ns.print(scriptLog);
        // Display results from solving script to this script's tail window
        // Note: Log is returned as an array, so we have to loop through it
        for (let line of scriptLog) {
            ns.print(line);
        }
        // Sleep a bit to prevent timeout while solving contract
        await ns.sleep(500);
    }
    ns.print("-------------------------------------------------------------");
    ns.print("Completed solving all " + contracts.length + " found contracts.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sdmVhbGxjb250cmFjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJhY3RzL3NvbHZlYWxsY29udHJhY3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzVCLFVBQVU7SUFDVixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFVixVQUFVO0lBQ1YsTUFBTSxtQkFBbUIsR0FBRyw2QkFBNkIsQ0FBQztJQUMxRCxJQUFJLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUVsQyxZQUFZO0lBQ1osSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDM0IsSUFBSSxhQUFhLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFHbkIsRUFBRSxDQUFDLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDO0lBQzFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUVyQyxPQUFPLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ2hFLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDaEQsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsa0NBQWtDO1FBRTNFLEtBQUssTUFBTSxlQUFlLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUNyRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUNqRCxrREFBa0Q7Z0JBQ2xELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO29CQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDckY7U0FDRDtRQUVELGlCQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUN0QztJQUVELEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLENBQUM7SUFDN0QsRUFBRSxDQUFDLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDO0lBRTFFLEtBQUssTUFBTSxVQUFVLElBQUksaUJBQWlCLEVBQUU7UUFDM0MsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU5Qiw2Q0FBNkM7UUFFN0MsS0FBSyxNQUFNLFFBQVEsSUFBSSxLQUFLLEVBQUU7WUFDN0IsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM5QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBRWxCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO2dCQUM3QixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDeEUsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBQzdCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUVoRSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QixpQkFBaUIsSUFBSSxDQUFDLENBQUM7YUFDdkI7U0FDRDtRQUVELEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLENBQUM7S0FDNUQ7SUFHRCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcseUJBQXlCLENBQUMsQ0FBQztJQUN2RCxFQUFFLENBQUMsS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7SUFFMUUsd0JBQXdCO0lBQ3hCLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO1FBQ2pDLElBQUksU0FBUyxFQUFFLFNBQVMsQ0FBQztRQUV6QixFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRWpELDJEQUEyRDtRQUMzRCx3REFBd0Q7UUFDeEQsU0FBUyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVyRSwwREFBMEQ7UUFDMUQsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLFNBQVMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFcEYsc0JBQXNCO1FBRXRCLG1FQUFtRTtRQUNuRSxtRUFBbUU7UUFDbkUsS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLEVBQUM7WUFDMUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNmO1FBRUQsd0RBQXdEO1FBQ3hELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNwQjtJQUVELEVBQUUsQ0FBQyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztJQUMxRSxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztBQUM3RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBwYXJhbSB7TlN9IG5zICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihucykge1xuXHQvLyBMb2dnaW5nXG5cdG5zLmRpc2FibGVMb2coJ0FMTCcpO1xuXHQvL25zLmRpc2FibGVMb2coJ3NjYW4nKTtcblx0bnMudGFpbCgpO1xuXG5cdC8vIEdsb2JhbHNcblx0Y29uc3Qgc29sdmVDb250cmFjdFNjcmlwdCA9IFwiL2NvbnRyYWN0cy9zb2x2ZWNvbnRyYWN0LmpzXCI7XG5cdGxldCBpbmZpbml0ZUxvb3BQcm90ZWN0aW9uID0gOTk5OTtcblxuXHQvLyBWYXJpYWJsZXNcblx0bGV0IGRpc2NvdmVyZWRTZXJ2ZXJzID0gW107XG5cdGxldCBzZXJ2ZXJzVG9TY2FuID0gW1wiaG9tZVwiXTtcblx0bGV0IGNvbnRyYWN0cyA9IFtdO1xuXG5cblx0bnMucHJpbnQoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXHRucy5wcmludChcIlNlYXJjaGluZyBmb3Igc2VydmVycy4uLlwiKTtcblxuXHR3aGlsZSAoc2VydmVyc1RvU2Nhbi5sZW5ndGggPiAwICYmIGluZmluaXRlTG9vcFByb3RlY3Rpb24tLSA+IDApIHtcblx0XHRsZXQgcHVyY2hhc2VkU2VydmVycyA9IG5zLmdldFB1cmNoYXNlZFNlcnZlcnMoKTtcblx0XHRsZXQgY3VycmVudFNlcnZlciA9IHNlcnZlcnNUb1NjYW4ucG9wKCk7IC8vIEdldCB0aGUgbmV4dCBob3N0IHRvIGJlIHNjYW5uZWRcblxuXHRcdGZvciAoY29uc3QgY29ubmVjdGVkU2VydmVyIG9mIG5zLnNjYW4oY3VycmVudFNlcnZlcikpIHtcblx0XHRcdGlmICghZGlzY292ZXJlZFNlcnZlcnMuaW5jbHVkZXMoY29ubmVjdGVkU2VydmVyKSkge1xuXHRcdFx0XHQvLyBBZGQgaG9zdG5hbWUgaWYgbm90IGFscmVhZHkgYWRkZWQgYW5kIG5vdCBvd25lZFxuXHRcdFx0XHRpZiAoIXB1cmNoYXNlZFNlcnZlcnMuaW5jbHVkZXMoY29ubmVjdGVkU2VydmVyKSkgc2VydmVyc1RvU2Nhbi5wdXNoKGNvbm5lY3RlZFNlcnZlcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZGlzY292ZXJlZFNlcnZlcnMucHVzaChjdXJyZW50U2VydmVyKTtcblx0fVxuXG5cdG5zLnByaW50KGRpc2NvdmVyZWRTZXJ2ZXJzLmxlbmd0aCArIFwiIHRvdGFsIHNlcnZlcnMgZm91bmQuXCIpO1xuXHRucy5wcmludChcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cblx0Zm9yIChjb25zdCBzZXJ2ZXJOYW1lIG9mIGRpc2NvdmVyZWRTZXJ2ZXJzKSB7XG5cdFx0bGV0IGNvbnRyYWN0c09uU2VydmVyID0gMDtcblx0XHRsZXQgZmlsZXMgPSBucy5scyhzZXJ2ZXJOYW1lKTtcblxuXHRcdC8vbnMucHJpbnQoZmlsZXMgKyBcImZpbGVzIG9uIFwiICsgc2VydmVyTmFtZSk7XG5cblx0XHRmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIGZpbGVzKSB7XG5cdFx0XHRpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCIuY2N0XCIpKSB7XG5cdFx0XHRcdGxldCBjb250cmFjdCA9IHt9O1xuXG5cdFx0XHRcdGNvbnRyYWN0LnNlcnZlciA9IHNlcnZlck5hbWU7XG5cdFx0XHRcdGNvbnRyYWN0LnR5cGUgPSBucy5jb2Rpbmdjb250cmFjdC5nZXRDb250cmFjdFR5cGUoZmlsZU5hbWUsIHNlcnZlck5hbWUpO1xuXHRcdFx0XHRjb250cmFjdC5maWxlTmFtZSA9IGZpbGVOYW1lO1xuXHRcdFx0XHRjb250cmFjdC5kYXRhID0gbnMuY29kaW5nY29udHJhY3QuZ2V0RGF0YShmaWxlTmFtZSwgc2VydmVyTmFtZSk7XG5cblx0XHRcdFx0Y29udHJhY3RzLnB1c2goY29udHJhY3QpO1xuXHRcdFx0XHRjb250cmFjdHNPblNlcnZlciArPSAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG5zLnByaW50KGNvbnRyYWN0c09uU2VydmVyICsgXCIgY29udHJhY3RzIG9uIFwiICsgc2VydmVyTmFtZSk7XG5cdH1cblxuXG5cdG5zLnByaW50KGNvbnRyYWN0cy5sZW5ndGggKyBcIiB0b3RhbCBjb250cmFjdHMgZm91bmQuXCIpO1xuXHRucy5wcmludChcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cblx0Ly8gU29sdmUgZm91bmQgY29udHJhY3RzXG5cdGZvciAoY29uc3QgY29udHJhY3Qgb2YgY29udHJhY3RzKSB7XG5cdFx0bGV0IHByb2Nlc3NJRCwgc2NyaXB0TG9nO1xuXG5cdFx0bnMucHJpbnQoXCJTb2x2aW5nIFwiICsgY29udHJhY3QuZmlsZU5hbWUgKyBcIi4uLlwiKTtcblxuXHRcdC8vIFVzZSBKU09OIFN0cmlnaWZ5IGZ1bmN0aW9uIHRvIHBhc3MgYW4gb2JqZWN0IHRvIGEgc2NyaXB0XG5cdFx0Ly9cdHByb2Nlc3NJRCA9IG5zLmV4ZWMoJy9jb250cmFjdHMvdGVzdC5qcycsICdob21lJywgMSk7XG5cdFx0cHJvY2Vzc0lEID0gbnMucnVuKHNvbHZlQ29udHJhY3RTY3JpcHQsIDEsIEpTT04uc3RyaW5naWZ5KGNvbnRyYWN0KSk7XG5cblx0XHQvLyBTbGVlcCBhIGJpdCB3aGlsZSBwcm9jZXNzIHN0YXJ0cyBiZWZvcmUgcHVsbGluZyBpdHMgbG9nXG5cdFx0YXdhaXQgbnMuc2xlZXAoNTAwKTtcblx0XHRzY3JpcHRMb2cgPSBucy5nZXRTY3JpcHRMb2dzKHNvbHZlQ29udHJhY3RTY3JpcHQsICdob21lJywgSlNPTi5zdHJpbmdpZnkoY29udHJhY3QpKTtcblxuXHRcdC8vbnMucHJpbnQoc2NyaXB0TG9nKTtcblxuXHRcdC8vIERpc3BsYXkgcmVzdWx0cyBmcm9tIHNvbHZpbmcgc2NyaXB0IHRvIHRoaXMgc2NyaXB0J3MgdGFpbCB3aW5kb3dcblx0XHQvLyBOb3RlOiBMb2cgaXMgcmV0dXJuZWQgYXMgYW4gYXJyYXksIHNvIHdlIGhhdmUgdG8gbG9vcCB0aHJvdWdoIGl0XG5cdFx0Zm9yIChsZXQgbGluZSBvZiBzY3JpcHRMb2cpe1xuXHRcdFx0bnMucHJpbnQobGluZSk7XG5cdFx0fVxuXG5cdFx0Ly8gU2xlZXAgYSBiaXQgdG8gcHJldmVudCB0aW1lb3V0IHdoaWxlIHNvbHZpbmcgY29udHJhY3Rcblx0XHRhd2FpdCBucy5zbGVlcCg1MDApO1xuXHR9XG5cblx0bnMucHJpbnQoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXHRucy5wcmludChcIkNvbXBsZXRlZCBzb2x2aW5nIGFsbCBcIiArIGNvbnRyYWN0cy5sZW5ndGggKyBcIiBmb3VuZCBjb250cmFjdHMuXCIpO1xufSJdfQ==