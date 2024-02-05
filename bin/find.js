/** param {NS} ns **/
export function main(ns) { 
    let path  = [ns.args[0]];
    while(path[0] !== "home") path.unshift(ns.scan(path[0])[0]);
    const doc = eval('document');
    const terminalInput = doc.getElementById("terminal-input");
    terminalInput.value=path.join(";connect ");
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({target:terminalInput});
    terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
}
export const autocomplete = data => data.servers