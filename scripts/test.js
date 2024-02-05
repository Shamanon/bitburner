/** @param {NS} ns */
import { getServers, getPath, numPorts, pwn } from "/inc/include.js";

export async function main(ns) {
  
  ns.tprint(numPorts(ns));
  //pwn(ns,'n00dles');
  /*
  for(var host of getServers(ns)){
    //ns.tprint(host+': '+getPath(ns,host))
    pwn(ns,host);
  }
  */

  //ns.tprint(numPorts(ns));

}