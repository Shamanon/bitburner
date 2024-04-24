let options;
const argsSchema = [
    ['github', 'alainbryden'],
    ['repository', 'bitburner-scripts'],
    ['branch', 'main'],
    ['download', []],
    ['new-file', []],
    ['subfolder', ''],
    ['extension', ['.js', '.ns', '.txt', '.script']],
    ['omit-folder', ['Temp/']], // Folders to omit when getting a list of files to update (TODO: This may be obsolete now that we get a list of files from github itself.)
];
export function autocomplete(data, args) {
    data.flags(argsSchema);
    const lastFlag = args.length > 1 ? args[args.length - 2] : null;
    if (["--download", "--subfolder", "--omit-folder"].includes(lastFlag))
        return data.scripts;
    return [];
}
/** @param {NS} ns
 * Will try to download a fresh version of every file on the current server.
 * You are responsible for:
 * - Backing up your save / scripts first (try `download *` in the terminal)
 * - Ensuring you have no local changes that you don't mind getting overwritten **/
export async function main(ns) {
    options = ns.flags(argsSchema);
    // Once upon a time, the game API required folders to have a leading slash
    // As of 2.3.1, not only is this no longer needed, but it can break the game.
    if (options.subfolder)
        options.subfolder = trimSlash(options.subfolder); // Remove the leading slash
    const baseUrl = `raw.githubusercontent.com/${options.github}/${options.repository}/${options.branch}/`;
    const filesToDownload = options['new-file'].concat(options.download.length > 0 ? options.download : await repositoryListing(ns));
    for (const localFilePath of filesToDownload) {
        let fullLocalFilePath = pathJoin(options.subfolder, localFilePath);
        const remoteFilePath = `https://` + pathJoin(baseUrl, localFilePath);
        ns.print(`Trying to update "${fullLocalFilePath}" from ${remoteFilePath} ...`);
        if (await ns.wget(`${remoteFilePath}?ts=${new Date().getTime()}`, fullLocalFilePath) && rewriteFileForSubfolder(ns, fullLocalFilePath))
            ns.tprint(`SUCCESS: Updated "${fullLocalFilePath}" to the latest from ${remoteFilePath}`);
        else
            ns.tprint(`WARNING: "${fullLocalFilePath}" was not updated. (Currently running, or not located at ${remoteFilePath}?)`);
    }
    ns.tprint(`INFO: Pull complete. If you have any questions or issues, head over to the Bitburner #alains-scripts Discord channel: ` +
        `https://discord.com/channels/415207508303544321/935667531111342200`);
    // Remove any temp files / scripts from the prior version
    ns.run(pathJoin(options.subfolder, `cleanup.js`));
}
/** Removes leading and trailing slashes from the specified string */
function trimSlash(s) {
    // Once upon a time, the game API required folders to have a leading slash
    // As of 2.3.1, not only is this no longer needed, but it can break the game.
    if (s.startsWith('/'))
        s = s.slice(1);
    if (s.endsWith('/'))
        s = s.slice(0, -1);
    return s;
}
/** Joins all arguments as components in a path, e.g. pathJoin("foo", "bar", "/baz") = "foo/bar/baz" **/
function pathJoin(...args) {
    return trimSlash(args.filter(s => !!s).join('/').replace(/\/\/+/g, '/'));
}
/** @param {NS} ns
 * Rewrites a file with path substitions to handle downloading to a subfolder. **/
export function rewriteFileForSubfolder(ns, path) {
    if (!options.subfolder || path.includes('git-pull.js'))
        return true;
    let contents = ns.read(path);
    // Replace subfolder reference in helpers.js getFilePath:
    contents = contents.replace(`const subfolder = ''`, `const subfolder = '${options.subfolder}/'`);
    // Replace any imports, which can't use getFilePath:
    contents = contents.replace(/from '(\.\/)?(.*)'/g, `from '${pathJoin(options.subfolder, '$2')}'`);
    ns.write(path, contents, 'w');
    return true;
}
/** @param {NS} ns
 * Gets a list of files to download, either from the github repository (if supported), or using a local directory listing **/
async function repositoryListing(ns, folder = '') {
    // Note: Limit of 60 free API requests per day, don't over-do it
    const listUrl = `https://api.github.com/repos/${options.github}/${options.repository}/contents/${folder}?ref=${options.branch}`;
    let response = null;
    try {
        response = await fetch(listUrl); // Raw response
        // Expect an array of objects: [{path:"", type:"[file|dir]" },{...},...]
        response = await response.json(); // Deserialized
        // Sadly, we must recursively retrieve folders, which eats into our 60 free API requests per day.
        const folders = response.filter(f => f.type == "dir").map(f => f.path);
        let files = response.filter(f => f.type == "file").map(f => f.path)
            .filter(f => options.extension.some(ext => f.endsWith(ext)));
        ns.print(`The following files exist at ${listUrl}\n${files.join(", ")}`);
        for (const folder of folders)
            files = files.concat((await repositoryListing(ns, folder))
                .map(f => `/${f}`)); // Game requires folders to have a leading slash
        return files;
    }
    catch (error) {
        if (folder !== '')
            throw error; // Propagate the error if this was a recursive call.
        ns.tprint(`WARNING: Failed to get a repository listing (GitHub API request limit of 60 reached?): ${listUrl}` +
            `\nResponse Contents (if available): ${JSON.stringify(response ?? '(N/A)')}\nError: ${String(error)}`);
        // Fallback, assume the user already has a copy of all files in the repo, and use it as a directory listing
        return ns.ls('home').filter(name => options.extension.some(ext => f.endsWith(ext)) &&
            !options['omit-folder'].some(dir => name.startsWith(dir)));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LXB1bGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXh0L2dpdC1wdWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxDQUFDO0FBQ1osTUFBTSxVQUFVLEdBQUc7SUFDZixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUM7SUFDekIsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLENBQUM7SUFDbkMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO0lBQ2xCLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztJQUNoQixDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7SUFDaEIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ2pCLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLDBJQUEwSTtDQUN6SyxDQUFDO0FBRUYsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSTtJQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hFLElBQUksQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUVEOzs7O21GQUltRjtBQUNuRixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQ3pCLE9BQU8sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9CLDBFQUEwRTtJQUMxRSw2RUFBNkU7SUFDN0UsSUFBSSxPQUFPLENBQUMsU0FBUztRQUNqQixPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7SUFDakYsTUFBTSxPQUFPLEdBQUcsNkJBQTZCLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDdkcsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0saUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqSSxLQUFLLE1BQU0sYUFBYSxJQUFJLGVBQWUsRUFBRTtRQUN6QyxJQUFJLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sY0FBYyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLGlCQUFpQixVQUFVLGNBQWMsTUFBTSxDQUFDLENBQUM7UUFDL0UsSUFBSSxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxjQUFjLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixDQUFDLElBQUksdUJBQXVCLENBQUMsRUFBRSxFQUFFLGlCQUFpQixDQUFDO1lBQ2xJLEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLGlCQUFpQix3QkFBd0IsY0FBYyxFQUFFLENBQUMsQ0FBQzs7WUFFMUYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLGlCQUFpQiw0REFBNEQsY0FBYyxJQUFJLENBQUMsQ0FBQTtLQUM5SDtJQUNELEVBQUUsQ0FBQyxNQUFNLENBQUMsd0hBQXdIO1FBQzlILG9FQUFvRSxDQUFDLENBQUM7SUFDMUUseURBQXlEO0lBQ3pELEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUQscUVBQXFFO0FBQ3JFLFNBQVMsU0FBUyxDQUFDLENBQUM7SUFDaEIsMEVBQTBFO0lBQzFFLDZFQUE2RTtJQUM3RSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1FBQ2pCLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFFRCx3R0FBd0c7QUFDeEcsU0FBUyxRQUFRLENBQUMsR0FBRyxJQUFJO0lBQ3JCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRUQ7a0ZBQ2tGO0FBQ2xGLE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxFQUFFLEVBQUUsSUFBSTtJQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztRQUNsRCxPQUFPLElBQUksQ0FBQztJQUNoQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLHlEQUF5RDtJQUN6RCxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0IsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFDakcsb0RBQW9EO0lBQ3BELFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM5QixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRUQ7NkhBQzZIO0FBQzdILEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUU7SUFDNUMsZ0VBQWdFO0lBQ2hFLE1BQU0sT0FBTyxHQUFHLGdDQUFnQyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFVLGFBQWEsTUFBTSxRQUFRLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUMvSCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDcEIsSUFBSTtRQUNBLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWU7UUFDaEQsd0VBQXdFO1FBQ3hFLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWU7UUFDakQsaUdBQWlHO1FBQ2pHLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsT0FBTyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTztZQUN4QixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0saUJBQWlCLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUNyRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdEQUFnRDtRQUM3RSxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1osSUFBSSxNQUFNLEtBQUssRUFBRTtZQUFFLE1BQU0sS0FBSyxDQUFDLENBQUMsb0RBQW9EO1FBQ3BGLEVBQUUsQ0FBQyxNQUFNLENBQUMsMEZBQTBGLE9BQU8sRUFBRTtZQUN6Ryx1Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFlBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRywyR0FBMkc7UUFDM0csT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5RSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRTtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgb3B0aW9ucztcbmNvbnN0IGFyZ3NTY2hlbWEgPSBbXG4gICAgWydnaXRodWInLCAnYWxhaW5icnlkZW4nXSxcbiAgICBbJ3JlcG9zaXRvcnknLCAnYml0YnVybmVyLXNjcmlwdHMnXSxcbiAgICBbJ2JyYW5jaCcsICdtYWluJ10sXG4gICAgWydkb3dubG9hZCcsIFtdXSwgLy8gQnkgZGVmYXVsdCwgYWxsIHN1cHBvcnRlZCBmaWxlcyBpbiB0aGUgcmVwb3NpdG9yeSB3aWxsIGJlIGRvd25sb2FkZWQuIE92ZXJyaWRlIHdpdGgganVzdCBhIHN1YnNldCBvZiBmaWxlcyBoZXJlXG4gICAgWyduZXctZmlsZScsIFtdXSwgLy8gSWYgYSByZXBvc2l0b3J5IGxpc3RpbmcgZmFpbHMsIG9ubHkgZmlsZXMgcmV0dXJuZWQgYnkgbnMubHMoKSB3aWxsIGJlIGRvd25sb2FkZWQuIFlvdSBjYW4gYWRkIGFkZGl0aW9uYWwgZmlsZXMgdG8gc2VlayBvdXQgaGVyZS5cbiAgICBbJ3N1YmZvbGRlcicsICcnXSwgLy8gQ2FuIGJlIHNldCB0byBkb3dubG9hZCB0byBhIHN1Yi1mb2xkZXIgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgcmVtb3RlIHJlcG9zaXRvcnkgc3RydWN0dXJlXG4gICAgWydleHRlbnNpb24nLCBbJy5qcycsICcubnMnLCAnLnR4dCcsICcuc2NyaXB0J11dLCAvLyBGaWxlcyB0byBkb3dubG9hZCBieSBleHRlbnNpb25cbiAgICBbJ29taXQtZm9sZGVyJywgWydUZW1wLyddXSwgLy8gRm9sZGVycyB0byBvbWl0IHdoZW4gZ2V0dGluZyBhIGxpc3Qgb2YgZmlsZXMgdG8gdXBkYXRlIChUT0RPOiBUaGlzIG1heSBiZSBvYnNvbGV0ZSBub3cgdGhhdCB3ZSBnZXQgYSBsaXN0IG9mIGZpbGVzIGZyb20gZ2l0aHViIGl0c2VsZi4pXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0b2NvbXBsZXRlKGRhdGEsIGFyZ3MpIHtcbiAgICBkYXRhLmZsYWdzKGFyZ3NTY2hlbWEpO1xuICAgIGNvbnN0IGxhc3RGbGFnID0gYXJncy5sZW5ndGggPiAxID8gYXJnc1thcmdzLmxlbmd0aCAtIDJdIDogbnVsbDtcbiAgICBpZiAoW1wiLS1kb3dubG9hZFwiLCBcIi0tc3ViZm9sZGVyXCIsIFwiLS1vbWl0LWZvbGRlclwiXS5pbmNsdWRlcyhsYXN0RmxhZykpXG4gICAgICAgIHJldHVybiBkYXRhLnNjcmlwdHM7XG4gICAgcmV0dXJuIFtdO1xufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgXG4gKiBXaWxsIHRyeSB0byBkb3dubG9hZCBhIGZyZXNoIHZlcnNpb24gb2YgZXZlcnkgZmlsZSBvbiB0aGUgY3VycmVudCBzZXJ2ZXIuXG4gKiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvcjpcbiAqIC0gQmFja2luZyB1cCB5b3VyIHNhdmUgLyBzY3JpcHRzIGZpcnN0ICh0cnkgYGRvd25sb2FkICpgIGluIHRoZSB0ZXJtaW5hbClcbiAqIC0gRW5zdXJpbmcgeW91IGhhdmUgbm8gbG9jYWwgY2hhbmdlcyB0aGF0IHlvdSBkb24ndCBtaW5kIGdldHRpbmcgb3ZlcndyaXR0ZW4gKiovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihucykge1xuICAgIG9wdGlvbnMgPSBucy5mbGFncyhhcmdzU2NoZW1hKTtcbiAgICAvLyBPbmNlIHVwb24gYSB0aW1lLCB0aGUgZ2FtZSBBUEkgcmVxdWlyZWQgZm9sZGVycyB0byBoYXZlIGEgbGVhZGluZyBzbGFzaFxuICAgIC8vIEFzIG9mIDIuMy4xLCBub3Qgb25seSBpcyB0aGlzIG5vIGxvbmdlciBuZWVkZWQsIGJ1dCBpdCBjYW4gYnJlYWsgdGhlIGdhbWUuXG4gICAgaWYgKG9wdGlvbnMuc3ViZm9sZGVyKVxuICAgICAgICBvcHRpb25zLnN1YmZvbGRlciA9IHRyaW1TbGFzaChvcHRpb25zLnN1YmZvbGRlcik7IC8vIFJlbW92ZSB0aGUgbGVhZGluZyBzbGFzaFxuICAgIGNvbnN0IGJhc2VVcmwgPSBgcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8ke29wdGlvbnMuZ2l0aHVifS8ke29wdGlvbnMucmVwb3NpdG9yeX0vJHtvcHRpb25zLmJyYW5jaH0vYDtcbiAgICBjb25zdCBmaWxlc1RvRG93bmxvYWQgPSBvcHRpb25zWyduZXctZmlsZSddLmNvbmNhdChvcHRpb25zLmRvd25sb2FkLmxlbmd0aCA+IDAgPyBvcHRpb25zLmRvd25sb2FkIDogYXdhaXQgcmVwb3NpdG9yeUxpc3RpbmcobnMpKTtcbiAgICBmb3IgKGNvbnN0IGxvY2FsRmlsZVBhdGggb2YgZmlsZXNUb0Rvd25sb2FkKSB7XG4gICAgICAgIGxldCBmdWxsTG9jYWxGaWxlUGF0aCA9IHBhdGhKb2luKG9wdGlvbnMuc3ViZm9sZGVyLCBsb2NhbEZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgcmVtb3RlRmlsZVBhdGggPSBgaHR0cHM6Ly9gICsgcGF0aEpvaW4oYmFzZVVybCwgbG9jYWxGaWxlUGF0aCk7XG4gICAgICAgIG5zLnByaW50KGBUcnlpbmcgdG8gdXBkYXRlIFwiJHtmdWxsTG9jYWxGaWxlUGF0aH1cIiBmcm9tICR7cmVtb3RlRmlsZVBhdGh9IC4uLmApO1xuICAgICAgICBpZiAoYXdhaXQgbnMud2dldChgJHtyZW1vdGVGaWxlUGF0aH0/dHM9JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gLCBmdWxsTG9jYWxGaWxlUGF0aCkgJiYgcmV3cml0ZUZpbGVGb3JTdWJmb2xkZXIobnMsIGZ1bGxMb2NhbEZpbGVQYXRoKSlcbiAgICAgICAgICAgIG5zLnRwcmludChgU1VDQ0VTUzogVXBkYXRlZCBcIiR7ZnVsbExvY2FsRmlsZVBhdGh9XCIgdG8gdGhlIGxhdGVzdCBmcm9tICR7cmVtb3RlRmlsZVBhdGh9YCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5zLnRwcmludChgV0FSTklORzogXCIke2Z1bGxMb2NhbEZpbGVQYXRofVwiIHdhcyBub3QgdXBkYXRlZC4gKEN1cnJlbnRseSBydW5uaW5nLCBvciBub3QgbG9jYXRlZCBhdCAke3JlbW90ZUZpbGVQYXRofT8pYClcbiAgICB9XG4gICAgbnMudHByaW50KGBJTkZPOiBQdWxsIGNvbXBsZXRlLiBJZiB5b3UgaGF2ZSBhbnkgcXVlc3Rpb25zIG9yIGlzc3VlcywgaGVhZCBvdmVyIHRvIHRoZSBCaXRidXJuZXIgI2FsYWlucy1zY3JpcHRzIERpc2NvcmQgY2hhbm5lbDogYCArXG4gICAgICAgIGBodHRwczovL2Rpc2NvcmQuY29tL2NoYW5uZWxzLzQxNTIwNzUwODMwMzU0NDMyMS85MzU2Njc1MzExMTEzNDIyMDBgKTtcbiAgICAvLyBSZW1vdmUgYW55IHRlbXAgZmlsZXMgLyBzY3JpcHRzIGZyb20gdGhlIHByaW9yIHZlcnNpb25cbiAgICBucy5ydW4ocGF0aEpvaW4ob3B0aW9ucy5zdWJmb2xkZXIsIGBjbGVhbnVwLmpzYCkpO1xufVxuXG4vKiogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIGZyb20gdGhlIHNwZWNpZmllZCBzdHJpbmcgKi9cbmZ1bmN0aW9uIHRyaW1TbGFzaChzKSB7XG4gICAgLy8gT25jZSB1cG9uIGEgdGltZSwgdGhlIGdhbWUgQVBJIHJlcXVpcmVkIGZvbGRlcnMgdG8gaGF2ZSBhIGxlYWRpbmcgc2xhc2hcbiAgICAvLyBBcyBvZiAyLjMuMSwgbm90IG9ubHkgaXMgdGhpcyBubyBsb25nZXIgbmVlZGVkLCBidXQgaXQgY2FuIGJyZWFrIHRoZSBnYW1lLlxuICAgIGlmIChzLnN0YXJ0c1dpdGgoJy8nKSlcbiAgICAgICAgcyA9IHMuc2xpY2UoMSk7XG4gICAgaWYgKHMuZW5kc1dpdGgoJy8nKSlcbiAgICAgICAgcyA9IHMuc2xpY2UoMCwgLTEpO1xuICAgIHJldHVybiBzO1xufVxuXG4vKiogSm9pbnMgYWxsIGFyZ3VtZW50cyBhcyBjb21wb25lbnRzIGluIGEgcGF0aCwgZS5nLiBwYXRoSm9pbihcImZvb1wiLCBcImJhclwiLCBcIi9iYXpcIikgPSBcImZvby9iYXIvYmF6XCIgKiovXG5mdW5jdGlvbiBwYXRoSm9pbiguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRyaW1TbGFzaChhcmdzLmZpbHRlcihzID0+ICEhcykuam9pbignLycpLnJlcGxhY2UoL1xcL1xcLysvZywgJy8nKSk7XG59XG5cbi8qKiBAcGFyYW0ge05TfSBuc1xuICogUmV3cml0ZXMgYSBmaWxlIHdpdGggcGF0aCBzdWJzdGl0aW9ucyB0byBoYW5kbGUgZG93bmxvYWRpbmcgdG8gYSBzdWJmb2xkZXIuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIHJld3JpdGVGaWxlRm9yU3ViZm9sZGVyKG5zLCBwYXRoKSB7XG4gICAgaWYgKCFvcHRpb25zLnN1YmZvbGRlciB8fCBwYXRoLmluY2x1ZGVzKCdnaXQtcHVsbC5qcycpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBsZXQgY29udGVudHMgPSBucy5yZWFkKHBhdGgpO1xuICAgIC8vIFJlcGxhY2Ugc3ViZm9sZGVyIHJlZmVyZW5jZSBpbiBoZWxwZXJzLmpzIGdldEZpbGVQYXRoOlxuICAgIGNvbnRlbnRzID0gY29udGVudHMucmVwbGFjZShgY29uc3Qgc3ViZm9sZGVyID0gJydgLCBgY29uc3Qgc3ViZm9sZGVyID0gJyR7b3B0aW9ucy5zdWJmb2xkZXJ9LydgKTtcbiAgICAvLyBSZXBsYWNlIGFueSBpbXBvcnRzLCB3aGljaCBjYW4ndCB1c2UgZ2V0RmlsZVBhdGg6XG4gICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKC9mcm9tICcoXFwuXFwvKT8oLiopJy9nLCBgZnJvbSAnJHtwYXRoSm9pbihvcHRpb25zLnN1YmZvbGRlciwgJyQyJyl9J2ApO1xuICAgIG5zLndyaXRlKHBhdGgsIGNvbnRlbnRzLCAndycpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgXG4gKiBHZXRzIGEgbGlzdCBvZiBmaWxlcyB0byBkb3dubG9hZCwgZWl0aGVyIGZyb20gdGhlIGdpdGh1YiByZXBvc2l0b3J5IChpZiBzdXBwb3J0ZWQpLCBvciB1c2luZyBhIGxvY2FsIGRpcmVjdG9yeSBsaXN0aW5nICoqL1xuYXN5bmMgZnVuY3Rpb24gcmVwb3NpdG9yeUxpc3RpbmcobnMsIGZvbGRlciA9ICcnKSB7XG4gICAgLy8gTm90ZTogTGltaXQgb2YgNjAgZnJlZSBBUEkgcmVxdWVzdHMgcGVyIGRheSwgZG9uJ3Qgb3Zlci1kbyBpdFxuICAgIGNvbnN0IGxpc3RVcmwgPSBgaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8ke29wdGlvbnMuZ2l0aHVifS8ke29wdGlvbnMucmVwb3NpdG9yeX0vY29udGVudHMvJHtmb2xkZXJ9P3JlZj0ke29wdGlvbnMuYnJhbmNofWBcbiAgICBsZXQgcmVzcG9uc2UgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gobGlzdFVybCk7IC8vIFJhdyByZXNwb25zZVxuICAgICAgICAvLyBFeHBlY3QgYW4gYXJyYXkgb2Ygb2JqZWN0czogW3twYXRoOlwiXCIsIHR5cGU6XCJbZmlsZXxkaXJdXCIgfSx7Li4ufSwuLi5dXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOyAvLyBEZXNlcmlhbGl6ZWRcbiAgICAgICAgLy8gU2FkbHksIHdlIG11c3QgcmVjdXJzaXZlbHkgcmV0cmlldmUgZm9sZGVycywgd2hpY2ggZWF0cyBpbnRvIG91ciA2MCBmcmVlIEFQSSByZXF1ZXN0cyBwZXIgZGF5LlxuICAgICAgICBjb25zdCBmb2xkZXJzID0gcmVzcG9uc2UuZmlsdGVyKGYgPT4gZi50eXBlID09IFwiZGlyXCIpLm1hcChmID0+IGYucGF0aCk7XG4gICAgICAgIGxldCBmaWxlcyA9IHJlc3BvbnNlLmZpbHRlcihmID0+IGYudHlwZSA9PSBcImZpbGVcIikubWFwKGYgPT4gZi5wYXRoKVxuICAgICAgICAgICAgLmZpbHRlcihmID0+IG9wdGlvbnMuZXh0ZW5zaW9uLnNvbWUoZXh0ID0+IGYuZW5kc1dpdGgoZXh0KSkpO1xuICAgICAgICBucy5wcmludChgVGhlIGZvbGxvd2luZyBmaWxlcyBleGlzdCBhdCAke2xpc3RVcmx9XFxuJHtmaWxlcy5qb2luKFwiLCBcIil9YCk7XG4gICAgICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpXG4gICAgICAgICAgICBmaWxlcyA9IGZpbGVzLmNvbmNhdCgoYXdhaXQgcmVwb3NpdG9yeUxpc3RpbmcobnMsIGZvbGRlcikpXG4gICAgICAgICAgICAgICAgLm1hcChmID0+IGAvJHtmfWApKTsgLy8gR2FtZSByZXF1aXJlcyBmb2xkZXJzIHRvIGhhdmUgYSBsZWFkaW5nIHNsYXNoXG4gICAgICAgIHJldHVybiBmaWxlcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoZm9sZGVyICE9PSAnJykgdGhyb3cgZXJyb3I7IC8vIFByb3BhZ2F0ZSB0aGUgZXJyb3IgaWYgdGhpcyB3YXMgYSByZWN1cnNpdmUgY2FsbC5cbiAgICAgICAgbnMudHByaW50KGBXQVJOSU5HOiBGYWlsZWQgdG8gZ2V0IGEgcmVwb3NpdG9yeSBsaXN0aW5nIChHaXRIdWIgQVBJIHJlcXVlc3QgbGltaXQgb2YgNjAgcmVhY2hlZD8pOiAke2xpc3RVcmx9YCArXG4gICAgICAgICAgICBgXFxuUmVzcG9uc2UgQ29udGVudHMgKGlmIGF2YWlsYWJsZSk6ICR7SlNPTi5zdHJpbmdpZnkocmVzcG9uc2UgPz8gJyhOL0EpJyl9XFxuRXJyb3I6ICR7U3RyaW5nKGVycm9yKX1gKTtcbiAgICAgICAgLy8gRmFsbGJhY2ssIGFzc3VtZSB0aGUgdXNlciBhbHJlYWR5IGhhcyBhIGNvcHkgb2YgYWxsIGZpbGVzIGluIHRoZSByZXBvLCBhbmQgdXNlIGl0IGFzIGEgZGlyZWN0b3J5IGxpc3RpbmdcbiAgICAgICAgcmV0dXJuIG5zLmxzKCdob21lJykuZmlsdGVyKG5hbWUgPT4gb3B0aW9ucy5leHRlbnNpb24uc29tZShleHQgPT4gZi5lbmRzV2l0aChleHQpKSAmJlxuICAgICAgICAgICAgIW9wdGlvbnNbJ29taXQtZm9sZGVyJ10uc29tZShkaXIgPT4gbmFtZS5zdGFydHNXaXRoKGRpcikpKTtcbiAgICB9XG59Il19