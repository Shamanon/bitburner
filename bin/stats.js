/** @param {NS} ns */
export async function main(ns) {
    var player = ns.getPlayer();
    var output = "";
    function printObject(player) {
        /*
        for(var key in player){
    
          if(typeof player[key] === 'object'){
            output += "\n"+key+":\n";
            for(var ob in player[key]){
              output += "-->"+ob+': '+player[key][ob]+"\n";
            }
          } else output += "\n"+key+': '+player[key]+"\n";
        }
        */
        Object.entries(player).forEach(([key, value]) => ns.tprint(key, value));
    }
    printObject(player);
    ns.tprint(output);
}