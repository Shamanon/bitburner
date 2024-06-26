/** @param {NS} ns */
/* Encrypts/Decrypts Vignette cypher */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1) {
        ns.tprint("Encrypts/Decrypts Vignette cypher.");
        ns.tprint("Useage: run " + ns.getScriptName() + " PLAINTEXT KEY");
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
    while (fullKey.length < plainText.length)
        fullKey = fullKey + keyword;
    if (printSquare)
        ns.tprint('  ' + alphabet.join(' '));
    for (var i = 0; i < 26; i++) {
        for (var i2 = 0; i2 < 26; i2++) {
            let a = alphabet[i];
            let b = alphabet[i2];
            cypher[a + b] = row[i2];
        }
        if (printSquare)
            ns.tprint(alphabet[i] + ' ' + row.join(' '));
        let letter = row.shift();
        row.push(letter);
    }
    for (var i = 0; i < plainText.length; i++) {
        let a = plainText.substring(i, i + 1).toUpperCase();
        let b = fullKey.substring(i, i + 1).toUpperCase();
        output += cypher[a + b];
    }
    ns.tprint(output);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyYWN0cy9jeXBoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUJBQXFCO0FBRXJCLHVDQUF1QztBQUV2QyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzNCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsSUFBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztRQUNoQyxFQUFFLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUE7UUFDL0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxHQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsT0FBTztLQUNSO0lBRUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDeEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWhCLE9BQU0sT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTTtRQUFFLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBRXJFLElBQUcsV0FBVztRQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuRCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFDO1FBQ3JCLEtBQUksSUFBSSxFQUFFLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2QjtRQUNELElBQUcsV0FBVztZQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbEI7SUFFRCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9DLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZCO0lBRUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBwYXJhbSB7TlN9IG5zICovXG5cbi8qIEVuY3J5cHRzL0RlY3J5cHRzIFZpZ25ldHRlIGN5cGhlciAqL1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihucykge1xuICBjb25zdCBhcmdzID0gbnMuZmxhZ3MoW1tcImhlbHBcIiwgZmFsc2VdXSk7XG4gIGlmKGFyZ3MuaGVscCB8fCBhcmdzLl8ubGVuZ3RoIDwgMSl7XG4gICAgbnMudHByaW50KFwiRW5jcnlwdHMvRGVjcnlwdHMgVmlnbmV0dGUgY3lwaGVyLlwiKVxuICAgIG5zLnRwcmludChcIlVzZWFnZTogcnVuIFwiK25zLmdldFNjcmlwdE5hbWUoKStcIiBQTEFJTlRFWFQgS0VZXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFscGhhID0gQXJyYXkuZnJvbShBcnJheSgyNikpLm1hcCgoZSwgaSkgPT4gaSArIDY1KTtcbiAgY29uc3QgYWxwaGFiZXQgPSBhbHBoYS5tYXAoKHgpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoeCkpO1xuICBsZXQgcm93ID0gYWxwaGEubWFwKCh4KSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHgpKTtcbiAgdmFyIGN5cGhlciA9IFtdO1xuICBsZXQgcGxhaW5UZXh0ID0gYXJncy5fWzBdO1xuICBsZXQga2V5d29yZCA9IGFyZ3MuX1sxXTtcbiAgdmFyIGZ1bGxLZXkgPSAnJztcbiAgdmFyIHByaW50U3F1YXJlID0gZmFsc2U7XG4gIHZhciBvdXRwdXQgPSAnJztcblxuICB3aGlsZShmdWxsS2V5Lmxlbmd0aCA8IHBsYWluVGV4dC5sZW5ndGgpIGZ1bGxLZXkgPSBmdWxsS2V5ICsga2V5d29yZDtcblxuICBpZihwcmludFNxdWFyZSkgbnMudHByaW50KCcgICcrYWxwaGFiZXQuam9pbignICcpKTsgIFxuICBmb3IodmFyIGk9MDsgaTwyNjsgaSsrKXtcbiAgICBmb3IodmFyIGkyPTA7IGkyPDI2OyBpMisrKXtcbiAgICAgIGxldCBhID0gYWxwaGFiZXRbaV07XG4gICAgICBsZXQgYiA9IGFscGhhYmV0W2kyXTtcbiAgICAgIGN5cGhlclthK2JdID0gcm93W2kyXTtcbiAgICB9XG4gICAgaWYocHJpbnRTcXVhcmUpIG5zLnRwcmludChhbHBoYWJldFtpXSsnICcrcm93LmpvaW4oJyAnKSk7XG4gICAgbGV0IGxldHRlciA9IHJvdy5zaGlmdCgpO1xuICAgIHJvdy5wdXNoKGxldHRlcik7XG4gIH1cblxuICBmb3IodmFyIGk9MDsgaTxwbGFpblRleHQubGVuZ3RoOyBpKyspe1xuICAgIGxldCBhID0gcGxhaW5UZXh0LnN1YnN0cmluZyhpLGkrMSkudG9VcHBlckNhc2UoKTtcbiAgICBsZXQgYiA9IGZ1bGxLZXkuc3Vic3RyaW5nKGksaSsxKS50b1VwcGVyQ2FzZSgpO1xuICAgIG91dHB1dCArPSBjeXBoZXJbYStiXTtcbiAgfVxuXG4gIG5zLnRwcmludChvdXRwdXQpO1xuXG59Il19