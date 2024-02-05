/** @param {NS} ns */
import { getServers, getPath, numPorts } from "/inc/include.js";

export async function main(ns) {
  
  for(var host of getServers(ns)){
    ns.tprint(host+': '+getPath(ns,host));
  }

  //ns.tprint(numPorts(ns));

}