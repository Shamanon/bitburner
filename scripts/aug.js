/** @param {NS} ns */
export async function main(ns) {
  const NFG = "NeuroFlux Governor";
  const FAC = "NiteSec";
  while(true){
    let cash = ns.getServerMoneyAvailable('home');
    if(ns.singularity.getAugmentationPrice(NFG) < cash){
      ns.singularity.purchaseAugmentation(FAC, NFG);
    }
    await ns.sleep(2000);
  }
}