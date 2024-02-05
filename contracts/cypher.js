/** @param {NS} ns */

/* Encrypts/Decrypts Vignette cypher */

export async function main(ns) {
  const args = ns.flags([["help", false]]);
  if(args.help || args._.length < 1){
    ns.tprint("Encrypts/Decrypts Vignette cypher.")
    ns.tprint("Useage: run "+ns.getScriptName()+" PLAINTEXT KEY");
    return;
  }

  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  let row = alpha.map((x) => String.fromCharCode(x));
  var cypher = [];
  let plainText = args._[0];
  let keyword = args._[1];
  var fullKey = '';
  var printSquare = false;
  var output = '';

  while(fullKey.length < plainText.length) fullKey = fullKey + keyword;

  if(printSquare) ns.tprint('  '+alphabet.join(' '));  
  for(var i=0; i<26; i++){
    for(var i2=0; i2<26; i2++){
      let a = alphabet[i];
      let b = alphabet[i2];
      cypher[a+b] = row[i2];
    }
    if(printSquare) ns.tprint(alphabet[i]+' '+row.join(' '));
    let letter = row.shift();
    row.push(letter);
  }

  for(var i=0; i<plainText.length; i++){
    let a = plainText.substring(i,i+1).toUpperCase();
    let b = fullKey.substring(i,i+1).toUpperCase();
    output += cypher[a+b];
  }

  ns.tprint(output);

}