/** @param {NS} ns */
export async function main(ns) {

  var skip = [];
  skip.push('home','darkweb');
  var hosts = [];
  const args = ns.flags([["debug", false]]);

  function serverOut(i){
    for(let out of i){
      if(!skip.includes(out)){
        skip.push(out);
        hosts.push(out);
        serverOut(ns.scan(out));
      }
    }
  }

  for(let server of ns.scan(ns.getHostname())){
    if(!skip.includes(server)){
      hosts.push(server);
      serverOut(ns.scan(server));
    }
  }

  if(args.debug) ns.tprint(hosts.join(','));
  return(hosts);

}