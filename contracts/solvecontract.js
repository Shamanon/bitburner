/** @param {NS} ns */
export async function main(ns) {
    // Logging
    ns.disableLog('ALL');
    // Globals
    let infiniteLoopProtection = 9999;
    const contract = JSON.parse(ns.args[0]); // Use JSON parse function to decode object in a stringified argument
    // Contract Solutions Array
    const codingContractsSolutions = [{
            name: 'Find Largest Prime Factor',
            solver: function (data) {
                let fac = 2;
                let n = data;
                while (n > (fac - 1) * (fac - 1)) {
                    while (n % fac === 0) {
                        n = Math.round(n / fac);
                    }
                    ++fac;
                }
                return n === 1 ? fac - 1 : n;
            },
        },
        {
            name: 'Subarray with Maximum Sum',
            solver: function (data) {
                const nums = data.slice();
                for (let i = 1; i < nums.length; i++) {
                    nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
                }
                return Math.max.apply(Math, nums);
            },
        },
        {
            name: 'Total Ways to Sum',
            solver: function (data) {
                const ways = [1];
                ways.length = data + 1;
                ways.fill(0, 1);
                for (let i = 1; i < data; ++i) {
                    for (let j = i; j <= data; ++j) {
                        ways[j] += ways[j - i];
                    }
                }
                return ways[data];
            },
        },
        {
            name: 'Total Ways to Sum II',
            solver: function (data) {
                const n = data[0];
                const s = data[1];
                const ways = [1];
                ways.length = n + 1;
                ways.fill(0, 1);
                for (let i = 0; i < s.length; i++) {
                    for (let j = s[i]; j <= n; j++) {
                        ways[j] += ways[j - s[i]];
                    }
                }
                return ways[n];
            },
        },
        {
            name: 'Spiralize Matrix',
            solver: function (data) {
                const spiral = [];
                const m = data.length;
                const n = data[0].length;
                let u = 0;
                let d = m - 1;
                let l = 0;
                let r = n - 1;
                let k = 0;
                while (infiniteLoopProtection-- > 0) {
                    // Up
                    for (let col = l; col <= r; col++) {
                        spiral[k] = data[u][col];
                        ++k;
                    }
                    if (++u > d) {
                        break;
                    }
                    // Right
                    for (let row = u; row <= d; row++) {
                        spiral[k] = data[row][r];
                        ++k;
                    }
                    if (--r < l) {
                        break;
                    }
                    // Down
                    for (let col = r; col >= l; col--) {
                        spiral[k] = data[d][col];
                        ++k;
                    }
                    if (--d < u) {
                        break;
                    }
                    // Left
                    for (let row = d; row >= u; row--) {
                        spiral[k] = data[row][l];
                        ++k;
                    }
                    if (++l > r) {
                        break;
                    }
                }
                return spiral;
            },
        },
        {
            name: 'Array Jumping Game',
            solver: function (data) {
                const n = data.length;
                let i = 0;
                for (let reach = 0; i < n && i <= reach; ++i) {
                    reach = Math.max(i + data[i], reach);
                }
                const solution = i === n;
                return solution ? 1 : 0;
            },
        },
        {
            name: 'Array Jumping Game II',
            solver: function (data) {
                if (data[0] == 0)
                    return '0';
                const n = data.length;
                let reach = 0;
                let jumps = 0;
                let lastJump = -1;
                while (reach < n - 1) {
                    let jumpedFrom = -1;
                    for (let i = reach; i > lastJump; i--) {
                        if (i + data[i] > reach) {
                            reach = i + data[i];
                            jumpedFrom = i;
                        }
                    }
                    if (jumpedFrom === -1) {
                        jumps = 0;
                        break;
                    }
                    lastJump = jumpedFrom;
                    jumps++;
                }
                return jumps;
            },
        },
        {
            name: 'Merge Overlapping Intervals',
            solver: function (data) {
                const intervals = data.slice();
                intervals.sort(function (a, b) {
                    return a[0] - b[0];
                });
                const result = [];
                let start = intervals[0][0];
                let end = intervals[0][1];
                for (const interval of intervals) {
                    if (interval[0] <= end) {
                        end = Math.max(end, interval[1]);
                    }
                    else {
                        result.push([start, end]);
                        start = interval[0];
                        end = interval[1];
                    }
                }
                result.push([start, end]);
                const sanitizedResult = convert2DArrayToString(result);
                return sanitizedResult;
            },
        },
        {
            name: 'Generate IP Addresses',
            solver: function (data) {
                const ret = [];
                for (let a = 1; a <= 3; ++a) {
                    for (let b = 1; b <= 3; ++b) {
                        for (let c = 1; c <= 3; ++c) {
                            for (let d = 1; d <= 3; ++d) {
                                if (a + b + c + d === data.length) {
                                    const A = parseInt(data.substring(0, a), 10);
                                    const B = parseInt(data.substring(a, a + b), 10);
                                    const C = parseInt(data.substring(a + b, a + b + c), 10);
                                    const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
                                    if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                                        const ip = [A.toString(), '.', B.toString(), '.', C.toString(), '.', D.toString()].join('');
                                        if (ip.length === data.length + 3) {
                                            ret.push(ip);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return ret.toString(); // Answer expected is the string representation of this array
            },
        },
        {
            name: 'Algorithmic Stock Trader I',
            solver: function (data) {
                let maxCur = 0;
                let maxSoFar = 0;
                for (let i = 1; i < data.length; ++i) {
                    maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
                    maxSoFar = Math.max(maxCur, maxSoFar);
                }
                return maxSoFar.toString();
            },
        },
        {
            name: 'Algorithmic Stock Trader II',
            solver: function (data) {
                let profit = 0;
                for (let p = 1; p < data.length; ++p) {
                    profit += Math.max(data[p] - data[p - 1], 0);
                }
                return profit.toString();
            },
        },
        {
            name: 'Algorithmic Stock Trader III',
            solver: function (data) {
                let hold1 = Number.MIN_SAFE_INTEGER;
                let hold2 = Number.MIN_SAFE_INTEGER;
                let release1 = 0;
                let release2 = 0;
                for (const price of data) {
                    release2 = Math.max(release2, hold2 + price);
                    hold2 = Math.max(hold2, release1 - price);
                    release1 = Math.max(release1, hold1 + price);
                    hold1 = Math.max(hold1, price * -1);
                }
                return release2.toString();
            },
        },
        {
            name: 'Algorithmic Stock Trader IV',
            solver: function (data) {
                const k = data[0];
                const prices = data[1];
                const len = prices.length;
                if (len < 2) {
                    return 0;
                }
                if (k > len / 2) {
                    let res = 0;
                    for (let i = 1; i < len; ++i) {
                        res += Math.max(prices[i] - prices[i - 1], 0);
                    }
                    return res;
                }
                const hold = [];
                const rele = [];
                hold.length = k + 1;
                rele.length = k + 1;
                for (let i = 0; i <= k; ++i) {
                    hold[i] = Number.MIN_SAFE_INTEGER;
                    rele[i] = 0;
                }
                let cur;
                for (let i = 0; i < len; ++i) {
                    cur = prices[i];
                    for (let j = k; j > 0; --j) {
                        rele[j] = Math.max(rele[j], hold[j] + cur);
                        hold[j] = Math.max(hold[j], rele[j - 1] - cur);
                    }
                }
                return rele[k];
            },
        },
        {
            name: 'Minimum Path Sum in a Triangle',
            solver: function (data) {
                const n = data.length;
                const dp = data[n - 1].slice();
                for (let i = n - 2; i > -1; --i) {
                    for (let j = 0; j < data[i].length; ++j) {
                        dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
                    }
                }
                return dp[0];
            },
        },
        {
            name: 'Unique Paths in a Grid I',
            solver: function (data) {
                const n = data[0]; // Number of rows
                const m = data[1]; // Number of columns
                const currentRow = [];
                currentRow.length = n;
                for (let i = 0; i < n; i++) {
                    currentRow[i] = 1;
                }
                for (let row = 1; row < m; row++) {
                    for (let i = 1; i < n; i++) {
                        currentRow[i] += currentRow[i - 1];
                    }
                }
                return currentRow[n - 1];
            },
        },
        {
            name: 'Unique Paths in a Grid II',
            solver: function (data) {
                const obstacleGrid = [];
                obstacleGrid.length = data.length;
                for (let i = 0; i < obstacleGrid.length; ++i) {
                    obstacleGrid[i] = data[i].slice();
                }
                for (let i = 0; i < obstacleGrid.length; i++) {
                    for (let j = 0; j < obstacleGrid[0].length; j++) {
                        if (obstacleGrid[i][j] == 1) {
                            obstacleGrid[i][j] = 0;
                        }
                        else if (i == 0 && j == 0) {
                            obstacleGrid[0][0] = 1;
                        }
                        else {
                            obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
                        }
                    }
                }
                return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1];
            },
        },
        {
            name: 'Shortest Path in a Grid',
            solver: function (data) {
                //slightly adapted and simplified to get rid of MinHeap usage, and construct a valid path from potential candidates   
                //MinHeap replaced by simple array acting as queue (breadth first search)  
                const width = data[0].length;
                const height = data.length;
                const dstY = height - 1;
                const dstX = width - 1;
                const distance = new Array(height);
                //const prev: [[number, number] | undefined][] = new Array(height);
                const queue = [];
                for (let y = 0; y < height; y++) {
                    distance[y] = new Array(width).fill(Infinity);
                    //prev[y] = new Array(width).fill(undefined) as [undefined];
                }
                function validPosition(y, x) {
                    return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
                }
                // List in-bounds and passable neighbors
                function* neighbors(y, x) {
                    if (validPosition(y - 1, x))
                        yield [y - 1, x]; // Up
                    if (validPosition(y + 1, x))
                        yield [y + 1, x]; // Down
                    if (validPosition(y, x - 1))
                        yield [y, x - 1]; // Left
                    if (validPosition(y, x + 1))
                        yield [y, x + 1]; // Right
                }
                // Prepare starting point
                distance[0][0] = 0;
                //## Original version
                // queue.push([0, 0], 0);
                // // Take next-nearest position and expand potential paths from there
                // while (queue.size > 0) {
                //   const [y, x] = queue.pop() as [number, number];
                //   for (const [yN, xN] of neighbors(y, x)) {
                //     const d = distance[y][x] + 1;
                //     if (d < distance[yN][xN]) {
                //       if (distance[yN][xN] == Infinity)
                //         // Not reached previously
                //         queue.push([yN, xN], d);
                //       // Found a shorter path
                //       else queue.changeWeight(([yQ, xQ]) => yQ == yN && xQ == xN, d);
                //       //prev[yN][xN] = [y, x];
                //       distance[yN][xN] = d;
                //     }
                //   }
                // }
                //Simplified version. d < distance[yN][xN] should never happen for BFS if d != infinity, so we skip changeweight and simplify implementation
                //algo always expands shortest path, distance != infinity means a <= lenght path reaches it, only remaining case to solve is infinity    
                queue.push([0, 0]);
                while (queue.length > 0) {
                    const [y, x] = queue.shift();
                    for (const [yN, xN] of neighbors(y, x)) {
                        if (distance[yN][xN] == Infinity) {
                            queue.push([yN, xN]);
                            distance[yN][xN] = distance[y][x] + 1;
                        }
                    }
                }
                // No path at all?
                if (distance[dstY][dstX] == Infinity)
                    return "";
                //trace a path back to start
                let path = "";
                let [yC, xC] = [dstY, dstX];
                while (xC != 0 || yC != 0) {
                    const dist = distance[yC][xC];
                    for (const [yF, xF] of neighbors(yC, xC)) {
                        if (distance[yF][xF] == dist - 1) {
                            path = (xC == xF ? (yC == yF + 1 ? "D" : "U") : (xC == xF + 1 ? "R" : "L")) + path;
                            [yC, xC] = [yF, xF];
                            break;
                        }
                    }
                }
                return path;
            }
        },
        {
            name: 'Sanitize Parentheses in Expression',
            solver: function (data) {
                let left = 0;
                let right = 0;
                const res = [];
                for (let i = 0; i < data.length; ++i) {
                    if (data[i] === '(') {
                        ++left;
                    }
                    else if (data[i] === ')') {
                        left > 0 ? --left : ++right;
                    }
                }
                function dfs(pair, index, left, right, s, solution, res) {
                    if (s.length === index) {
                        if (left === 0 && right === 0 && pair === 0) {
                            for (let i = 0; i < res.length; i++) {
                                if (res[i] === solution) {
                                    return;
                                }
                            }
                            res.push(solution);
                        }
                        return;
                    }
                    if (s[index] === '(') {
                        if (left > 0) {
                            dfs(pair, index + 1, left - 1, right, s, solution, res);
                        }
                        dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
                    }
                    else if (s[index] === ')') {
                        if (right > 0)
                            dfs(pair, index + 1, left, right - 1, s, solution, res);
                        if (pair > 0)
                            dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
                    }
                    else {
                        dfs(pair, index + 1, left, right, s, solution + s[index], res);
                    }
                }
                dfs(0, 0, left, right, data, '', res);
                return res;
            },
        },
        {
            name: 'Find All Valid Math Expressions',
            solver: function (data) {
                const num = data[0];
                const target = data[1];
                function helper(res, path, num, target, pos, evaluated, multed) {
                    if (pos === num.length) {
                        if (target === evaluated) {
                            res.push(path);
                        }
                        return;
                    }
                    for (let i = pos; i < num.length; ++i) {
                        if (i != pos && num[pos] == '0') {
                            break;
                        }
                        const cur = parseInt(num.substring(pos, i + 1));
                        if (pos === 0) {
                            helper(res, path + cur, num, target, i + 1, cur, cur);
                        }
                        else {
                            helper(res, path + '+' + cur, num, target, i + 1, evaluated + cur, cur);
                            helper(res, path + '-' + cur, num, target, i + 1, evaluated - cur, -cur);
                            helper(res, path + '*' + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
                        }
                    }
                }
                if (num == null || num.length === 0) {
                    return [];
                }
                const result = [];
                helper(result, '', num, target, 0, 0, 0);
                return result;
            },
        },
        {
            //Taken from https://github.com/danielyxie/bitburner/blob/dev/src/utils/HammingCodeTools.ts and converted to js by Discord: H3draut3r#6722
            name: 'HammingCodes: Integer to Encoded Binary',
            solver: function (value) {
                // Calculates the needed amount of parityBits 'without' the "overall"-Parity
                const HammingSumOfParity = lengthOfDBits => lengthOfDBits == 0 ? 0 : lengthOfDBits < 3 ? lengthOfDBits + 1 :
                    Math.ceil(Math.log2(lengthOfDBits * 2)) <= Math.ceil(Math.log2(1 + lengthOfDBits + Math.ceil(Math.log2(lengthOfDBits)))) ?
                        Math.ceil(Math.log2(lengthOfDBits) + 1) : Math.ceil(Math.log2(lengthOfDBits));
                const data = value.toString(2).split(""); // first, change into binary string, then create array with 1 bit per index
                const sumParity = HammingSumOfParity(data.length); // get the sum of needed parity bits (for later use in encoding)
                const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
                // function count for specific entries in the array, for later use
                const build = ["x", "x", ...data.splice(0, 1)]; // init the "pre-build"
                for (let i = 2; i < sumParity; i++)
                    build.push("x", ...data.splice(0, Math.pow(2, i) - 1)); // add new paritybits and the corresponding data bits (pre-building array)
                // Get the index numbers where the parity bits "x" are placed
                const parityBits = build.map((e, i) => [e, i]).filter(([e, _]) => e == "x").map(([_, i]) => i);
                for (const index of parityBits) {
                    const tempcount = index + 1; // set the "stepsize" for the parityBit
                    const temparray = []; // temporary array to store the extracted bits
                    const tempdata = [...build]; // only work with a copy of the build
                    while (tempdata[index] !== undefined) {
                        // as long as there are bits on the starting index, do "cut"
                        const temp = tempdata.splice(index, tempcount * 2); // cut stepsize*2 bits, then...
                        temparray.push(...temp.splice(0, tempcount)); // ... cut the result again and keep the first half
                    }
                    temparray.splice(0, 1); // remove first bit, which is the parity one
                    build[index] = (count(temparray, "1") % 2).toString(); // count with remainder of 2 and"toString" to store the parityBit
                } // parity done, now the "overall"-parity is set
                build.unshift((count(build, "1") % 2).toString()); // has to be done as last element
                return build.join(""); // return the build as string
            },
        },
        {
            name: 'HammingCodes: Encoded Binary to Integer',
            solver: function (data) {
                //check for altered bit and decode
                const build = data.split(""); // ye, an array for working, again
                const testArray = []; //for the "truthtable". if any is false, the data has an altered bit, will check for and fix it
                const sumParity = Math.ceil(Math.log2(data.length)); // sum of parity for later use
                const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
                // the count.... again ;)
                let overallParity = build.splice(0, 1).join(""); // store first index, for checking in next step and fix the build properly later on
                testArray.push(overallParity == (count(build, "1") % 2).toString() ? true : false); // first check with the overall parity bit
                for (let i = 0; i < sumParity; i++) {
                    // for the rest of the remaining parity bits we also "check"
                    const tempIndex = Math.pow(2, i) - 1; // get the parityBits Index
                    const tempStep = tempIndex + 1; // set the stepsize
                    const tempData = [...build]; // get a "copy" of the build-data for working
                    const tempArray = []; // init empty array for "testing"
                    while (tempData[tempIndex] != undefined) {
                        // extract from the copied data until the "starting" index is undefined
                        const temp = [...tempData.splice(tempIndex, tempStep * 2)]; // extract 2*stepsize
                        tempArray.push(...temp.splice(0, tempStep)); // and cut again for keeping first half
                    }
                    const tempParity = tempArray.shift(); // and again save the first index separated for checking with the rest of the data
                    testArray.push(tempParity == (count(tempArray, "1") % 2).toString() ? true : false);
                    // is the tempParity the calculated data? push answer into the 'truthtable'
                }
                let fixIndex = 0; // init the "fixing" index and start with 0
                for (let i = 1; i < sumParity + 1; i++) {
                    // simple binary adding for every boolean in the testArray, starting from 2nd index of it
                    fixIndex += testArray[i] ? 0 : Math.pow(2, i) / 2;
                }
                build.unshift(overallParity); // now we need the "overall" parity back in it's place
                // try fix the actual encoded binary string if there is an error
                if (fixIndex > 0 && testArray[0] == false) { // if the overall is false and the sum of calculated values is greater equal 0, fix the corresponding hamming-bit           
                    build[fixIndex] = build[fixIndex] == "0" ? "1" : "0";
                }
                else if (testArray[0] == false) { // otherwise, if the the overallparity is the only wrong, fix that one           
                    overallParity = overallParity == "0" ? "1" : "0";
                }
                else if (testArray[0] == true && testArray.some((truth) => truth == false)) {
                    return 0; // ERROR: There's some strange going on... 2 bits are altered? How? This should not happen
                }
                // oof.. halfway through... we fixed an possible altered bit, now "extract" the parity-bits from the build
                for (let i = sumParity; i >= 0; i--) {
                    // start from the last parity down the 2nd index one
                    build.splice(Math.pow(2, i), 1);
                }
                build.splice(0, 1); // remove the overall parity bit and we have our binary value
                return parseInt(build.join(""), 2); // parse the integer with redux 2 and we're done!
            },
        },
        {
            name: 'Proper 2-Coloring of a Graph',
            solver: function (data) {
                // convert from edges to nodes
                const nodes = new Array(data[0]).fill(0).map(() => []);
                for (const e of data[1]) {
                    nodes[e[0]].push(e[1]);
                    nodes[e[1]].push(e[0]);
                }
                // solution graph starts out undefined and fills in with 0s and 1s
                const solution = new Array(data[0]).fill(undefined);
                let oddCycleFound = false;
                // recursive function for DFS
                const traverse = (index, color) => {
                    if (oddCycleFound) {
                        // leave immediately if an invalid cycle was found
                        return;
                    }
                    if (solution[index] === color) {
                        // node was already hit and is correctly colored
                        return;
                    }
                    if (solution[index] === (color ^ 1)) {
                        // node was already hit and is incorrectly colored: graph is uncolorable
                        oddCycleFound = true;
                        return;
                    }
                    solution[index] = color;
                    for (const n of nodes[index]) {
                        traverse(n, color ^ 1);
                    }
                };
                // repeat run for as long as undefined nodes are found, in case graph isn't fully connected
                while (!oddCycleFound && solution.some(e => e === undefined)) {
                    traverse(solution.indexOf(undefined), 0);
                }
                if (oddCycleFound)
                    return "[]"; // TODO: Bug #3755 in bitburner requires a string literal. Will this be fixed?
                return solution;
            },
        },
        {
            name: "Compression I: RLE Compression",
            solver: function (data) {
                //original code doesn't generate an answer, but validates it, fallback to this one-liner
                return data.replace(/([\w])\1{0,8}/g, (group, chr) => group.length + chr);
            }
        },
        {
            name: "Compression II: LZ Decompression",
            solver: function (compr) {
                let plain = "";
                for (let i = 0; i < compr.length;) {
                    const literal_length = compr.charCodeAt(i) - 0x30;
                    if (literal_length < 0 || literal_length > 9 || i + 1 + literal_length > compr.length) {
                        return null;
                    }
                    plain += compr.substring(i + 1, i + 1 + literal_length);
                    i += 1 + literal_length;
                    if (i >= compr.length) {
                        break;
                    }
                    const backref_length = compr.charCodeAt(i) - 0x30;
                    if (backref_length < 0 || backref_length > 9) {
                        return null;
                    }
                    else if (backref_length === 0) {
                        ++i;
                    }
                    else {
                        if (i + 1 >= compr.length) {
                            return null;
                        }
                        const backref_offset = compr.charCodeAt(i + 1) - 0x30;
                        if ((backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) || backref_offset > plain.length) {
                            return null;
                        }
                        for (let j = 0; j < backref_length; ++j) {
                            plain += plain[plain.length - backref_offset];
                        }
                        i += 2;
                    }
                }
                return plain;
            }
        },
        {
            name: "Compression III: LZ Compression",
            solver: function (plain) {
                let cur_state = Array.from(Array(10), () => Array(10).fill(null));
                let new_state = Array.from(Array(10), () => Array(10));
                function set(state, i, j, str) {
                    const current = state[i][j];
                    if (current == null || str.length < current.length) {
                        state[i][j] = str;
                    }
                    else if (str.length === current.length && Math.random() < 0.5) {
                        // if two strings are the same length, pick randomly so that
                        // we generate more possible inputs to Compression II
                        state[i][j] = str;
                    }
                }
                // initial state is a literal of length 1
                cur_state[0][1] = "";
                for (let i = 1; i < plain.length; ++i) {
                    for (const row of new_state) {
                        row.fill(null);
                    }
                    const c = plain[i];
                    // handle literals
                    for (let length = 1; length <= 9; ++length) {
                        const string = cur_state[0][length];
                        if (string == null) {
                            continue;
                        }
                        if (length < 9) {
                            // extend current literal
                            set(new_state, 0, length + 1, string);
                        }
                        else {
                            // start new literal
                            set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
                        }
                        for (let offset = 1; offset <= Math.min(9, i); ++offset) {
                            if (plain[i - offset] === c) {
                                // start new backreference
                                set(new_state, offset, 1, string + length + plain.substring(i - length, i));
                            }
                        }
                    }
                    // handle backreferences
                    for (let offset = 1; offset <= 9; ++offset) {
                        for (let length = 1; length <= 9; ++length) {
                            const string = cur_state[offset][length];
                            if (string == null) {
                                continue;
                            }
                            if (plain[i - offset] === c) {
                                if (length < 9) {
                                    // extend current backreference
                                    set(new_state, offset, length + 1, string);
                                }
                                else {
                                    // start new backreference
                                    set(new_state, offset, 1, string + "9" + offset + "0");
                                }
                            }
                            // start new literal
                            set(new_state, 0, 1, string + length + offset);
                            // end current backreference and start new backreference
                            for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
                                if (plain[i - new_offset] === c) {
                                    set(new_state, new_offset, 1, string + length + offset + "0");
                                }
                            }
                        }
                    }
                    const tmp_state = new_state;
                    new_state = cur_state;
                    cur_state = tmp_state;
                }
                let result = null;
                for (let len = 1; len <= 9; ++len) {
                    let string = cur_state[0][len];
                    if (string == null) {
                        continue;
                    }
                    string += len + plain.substring(plain.length - len, plain.length);
                    if (result == null || string.length < result.length) {
                        result = string;
                    }
                    else if (string.length == result.length && Math.random() < 0.5) {
                        result = string;
                    }
                }
                for (let offset = 1; offset <= 9; ++offset) {
                    for (let len = 1; len <= 9; ++len) {
                        let string = cur_state[offset][len];
                        if (string == null) {
                            continue;
                        }
                        string += len + "" + offset;
                        if (result == null || string.length < result.length) {
                            result = string;
                        }
                        else if (string.length == result.length && Math.random() < 0.5) {
                            result = string;
                        }
                    }
                }
                return result ?? "";
            }
        },
        {
            name: 'Encryption I: Caesar Cipher',
            solver: function (data) {
                // data = [plaintext, shift value]
                // build char array, shifting via map and join to final results
                const cipher = [...data[0]]
                    .map((a) => (a === " " ? a : String.fromCharCode(((a.charCodeAt(0) - 65 - data[1] + 26) % 26) + 65)))
                    .join("");
                return cipher;
            }
        },
        {
            name: "Encryption II: Vigenère Cipher",
            solver: function (data) {
                // data = [plaintext, keyword]
                // build char array, shifting via map and corresponding keyword letter and join to final results
                const cipher = [...data[0]]
                    .map((a, i) => {
                    return a === " "
                        ? a
                        : String.fromCharCode(((a.charCodeAt(0) - 2 * 65 + data[1].charCodeAt(i % data[1].length)) % 26) + 65);
                })
                    .join("");
                return cipher;
            }
        }];
    // Functions
    function convert2DArrayToString(arr) {
        const components = [];
        arr.forEach(function (e) {
            let s = e.toString();
            s = ['[', s, ']'].join('');
            components.push(s);
        });
        return components.join(',').replace(/\s/g, '');
    }
    ;
    function getSolution(contract) {
        const codingContractSolution = codingContractsSolutions.find((codingContractsSolutions) => codingContractsSolutions.name === contract.type);
        return codingContractSolution ? codingContractSolution.solver(contract.data) : "Unsolvable";
    }
    ;
    // Main
    contract.solution = getSolution(contract);
    ns.print("Type: " + contract.type);
    ns.print("Server: " + contract.server);
    ns.print("Answer: " + (contract.solution.length > 50 ? String(contract.solution).substring(0, 50) + "..." : contract.solution));
    if (contract.solution != "Unsolvable") {
        contract.result = ns.codingcontract.attempt(contract.solution, contract.fileName, contract.server, { returnReward: true });
        ns.print("Result: " + contract.result);
    }
    ns.print("-------------------------------------------------------------");
    await ns.sleep(5000);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sdmVjb250cmFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cmFjdHMvc29sdmVjb250cmFjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUM1QixVQUFVO0lBQ1YsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVyQixVQUFVO0lBQ1YsSUFBSSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7SUFDbEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxxRUFBcUU7SUFFL0csMkJBQTJCO0lBQzNCLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQztZQUNqQyxJQUFJLEVBQUUsMkJBQTJCO1lBQ2pDLE1BQU0sRUFBRSxVQUFVLElBQUk7Z0JBQ3JCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQTtnQkFDWCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7Z0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEVBQUU7d0JBQ3JCLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtxQkFDdkI7b0JBQ0QsRUFBRSxHQUFHLENBQUE7aUJBQ0w7Z0JBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDN0IsQ0FBQztTQUNEO1FBQ0Q7WUFDQyxJQUFJLEVBQUUsMkJBQTJCO1lBQ2pDLE1BQU0sRUFBRSxVQUFVLElBQUk7Z0JBQ3JCLE1B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RyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRWhJLElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxZQUFZLEVBQUU7UUFDdEMsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNILEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2QztJQUVELEVBQUUsQ0FBQyxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztJQUUxRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnMpIHtcblx0Ly8gTG9nZ2luZ1xuXHRucy5kaXNhYmxlTG9nKCdBTEwnKTtcblxuXHQvLyBHbG9iYWxzXG5cdGxldCBpbmZpbml0ZUxvb3BQcm90ZWN0aW9uID0gOTk5OTtcblx0Y29uc3QgY29udHJhY3QgPSBKU09OLnBhcnNlKG5zLmFyZ3NbMF0pOyAgLy8gVXNlIEpTT04gcGFyc2UgZnVuY3Rpb24gdG8gZGVjb2RlIG9iamVjdCBpbiBhIHN0cmluZ2lmaWVkIGFyZ3VtZW50XG5cblx0Ly8gQ29udHJhY3QgU29sdXRpb25zIEFycmF5XG5cdGNvbnN0IGNvZGluZ0NvbnRyYWN0c1NvbHV0aW9ucyA9IFt7XG5cdFx0bmFtZTogJ0ZpbmQgTGFyZ2VzdCBQcmltZSBGYWN0b3InLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGxldCBmYWMgPSAyXG5cdFx0XHRsZXQgbiA9IGRhdGFcblx0XHRcdHdoaWxlIChuID4gKGZhYyAtIDEpICogKGZhYyAtIDEpKSB7XG5cdFx0XHRcdHdoaWxlIChuICUgZmFjID09PSAwKSB7XG5cdFx0XHRcdFx0biA9IE1hdGgucm91bmQobiAvIGZhYylcblx0XHRcdFx0fVxuXHRcdFx0XHQrK2ZhY1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG4gPT09IDEgPyBmYWMgLSAxIDogblxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnU3ViYXJyYXkgd2l0aCBNYXhpbXVtIFN1bScsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0Y29uc3QgbnVtcyA9IGRhdGEuc2xpY2UoKVxuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBudW1zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdG51bXNbaV0gPSBNYXRoLm1heChudW1zW2ldLCBudW1zW2ldICsgbnVtc1tpIC0gMV0pXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgbnVtcylcblx0XHR9LFxuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ1RvdGFsIFdheXMgdG8gU3VtJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRjb25zdCB3YXlzID0gWzFdXG5cdFx0XHR3YXlzLmxlbmd0aCA9IGRhdGEgKyAxXG5cdFx0XHR3YXlzLmZpbGwoMCwgMSlcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgZGF0YTsgKytpKSB7XG5cdFx0XHRcdGZvciAobGV0IGogPSBpOyBqIDw9IGRhdGE7ICsraikge1xuXHRcdFx0XHRcdHdheXNbal0gKz0gd2F5c1tqIC0gaV1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHdheXNbZGF0YV1cblx0XHR9LFxuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ1RvdGFsIFdheXMgdG8gU3VtIElJJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRjb25zdCBuID0gZGF0YVswXTtcblx0XHRcdGNvbnN0IHMgPSBkYXRhWzFdO1xuXHRcdFx0Y29uc3Qgd2F5cyA9IFsxXTtcblx0XHRcdHdheXMubGVuZ3RoID0gbiArIDE7XG5cdFx0XHR3YXlzLmZpbGwoMCwgMSk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Zm9yIChsZXQgaiA9IHNbaV07IGogPD0gbjsgaisrKSB7XG5cdFx0XHRcdFx0d2F5c1tqXSArPSB3YXlzW2ogLSBzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHdheXNbbl07XG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdTcGlyYWxpemUgTWF0cml4Jyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRjb25zdCBzcGlyYWwgPSBbXVxuXHRcdFx0Y29uc3QgbSA9IGRhdGEubGVuZ3RoXG5cdFx0XHRjb25zdCBuID0gZGF0YVswXS5sZW5ndGhcblx0XHRcdGxldCB1ID0gMFxuXHRcdFx0bGV0IGQgPSBtIC0gMVxuXHRcdFx0bGV0IGwgPSAwXG5cdFx0XHRsZXQgciA9IG4gLSAxXG5cdFx0XHRsZXQgayA9IDBcblx0XHRcdHdoaWxlIChpbmZpbml0ZUxvb3BQcm90ZWN0aW9uLS0gPiAwKSB7XG5cdFx0XHRcdC8vIFVwXG5cdFx0XHRcdGZvciAobGV0IGNvbCA9IGw7IGNvbCA8PSByOyBjb2wrKykge1xuXHRcdFx0XHRcdHNwaXJhbFtrXSA9IGRhdGFbdV1bY29sXVxuXHRcdFx0XHRcdCsra1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgrK3UgPiBkKSB7XG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBSaWdodFxuXHRcdFx0XHRmb3IgKGxldCByb3cgPSB1OyByb3cgPD0gZDsgcm93KyspIHtcblx0XHRcdFx0XHRzcGlyYWxba10gPSBkYXRhW3Jvd11bcl1cblx0XHRcdFx0XHQrK2tcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoLS1yIDwgbCkge1xuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gRG93blxuXHRcdFx0XHRmb3IgKGxldCBjb2wgPSByOyBjb2wgPj0gbDsgY29sLS0pIHtcblx0XHRcdFx0XHRzcGlyYWxba10gPSBkYXRhW2RdW2NvbF1cblx0XHRcdFx0XHQrK2tcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoLS1kIDwgdSkge1xuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gTGVmdFxuXHRcdFx0XHRmb3IgKGxldCByb3cgPSBkOyByb3cgPj0gdTsgcm93LS0pIHtcblx0XHRcdFx0XHRzcGlyYWxba10gPSBkYXRhW3Jvd11bbF1cblx0XHRcdFx0XHQrK2tcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoKytsID4gcikge1xuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHNwaXJhbFxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnQXJyYXkgSnVtcGluZyBHYW1lJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRjb25zdCBuID0gZGF0YS5sZW5ndGhcblx0XHRcdGxldCBpID0gMFxuXHRcdFx0Zm9yIChsZXQgcmVhY2ggPSAwOyBpIDwgbiAmJiBpIDw9IHJlYWNoOyArK2kpIHtcblx0XHRcdFx0cmVhY2ggPSBNYXRoLm1heChpICsgZGF0YVtpXSwgcmVhY2gpXG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzb2x1dGlvbiA9IGkgPT09IG5cblx0XHRcdHJldHVybiBzb2x1dGlvbiA/IDEgOiAwXG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdBcnJheSBKdW1waW5nIEdhbWUgSUknLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGlmIChkYXRhWzBdID09IDApXG5cdFx0XHRcdHJldHVybiAnMCc7XG5cdFx0XHRjb25zdCBuID0gZGF0YS5sZW5ndGg7XG5cdFx0XHRsZXQgcmVhY2ggPSAwO1xuXHRcdFx0bGV0IGp1bXBzID0gMDtcblx0XHRcdGxldCBsYXN0SnVtcCA9IC0xO1xuXHRcdFx0d2hpbGUgKHJlYWNoIDwgbiAtIDEpIHtcblx0XHRcdFx0bGV0IGp1bXBlZEZyb20gPSAtMTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IHJlYWNoOyBpID4gbGFzdEp1bXA7IGktLSkge1xuXHRcdFx0XHRcdGlmIChpICsgZGF0YVtpXSA+IHJlYWNoKSB7XG5cdFx0XHRcdFx0XHRyZWFjaCA9IGkgKyBkYXRhW2ldO1xuXHRcdFx0XHRcdFx0anVtcGVkRnJvbSA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChqdW1wZWRGcm9tID09PSAtMSkge1xuXHRcdFx0XHRcdGp1bXBzID0gMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRsYXN0SnVtcCA9IGp1bXBlZEZyb207XG5cdFx0XHRcdGp1bXBzKys7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ganVtcHM7XG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdNZXJnZSBPdmVybGFwcGluZyBJbnRlcnZhbHMnLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGNvbnN0IGludGVydmFscyA9IGRhdGEuc2xpY2UoKVxuXHRcdFx0aW50ZXJ2YWxzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdFx0cmV0dXJuIGFbMF0gLSBiWzBdXG5cdFx0XHR9KVxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gW11cblx0XHRcdGxldCBzdGFydCA9IGludGVydmFsc1swXVswXVxuXHRcdFx0bGV0IGVuZCA9IGludGVydmFsc1swXVsxXVxuXHRcdFx0Zm9yIChjb25zdCBpbnRlcnZhbCBvZiBpbnRlcnZhbHMpIHtcblx0XHRcdFx0aWYgKGludGVydmFsWzBdIDw9IGVuZCkge1xuXHRcdFx0XHRcdGVuZCA9IE1hdGgubWF4KGVuZCwgaW50ZXJ2YWxbMV0pXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goW3N0YXJ0LCBlbmRdKVxuXHRcdFx0XHRcdHN0YXJ0ID0gaW50ZXJ2YWxbMF1cblx0XHRcdFx0XHRlbmQgPSBpbnRlcnZhbFsxXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXN1bHQucHVzaChbc3RhcnQsIGVuZF0pXG5cdFx0XHRjb25zdCBzYW5pdGl6ZWRSZXN1bHQgPSBjb252ZXJ0MkRBcnJheVRvU3RyaW5nKHJlc3VsdClcblx0XHRcdHJldHVybiBzYW5pdGl6ZWRSZXN1bHRcblx0XHR9LFxuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ0dlbmVyYXRlIElQIEFkZHJlc3NlcycsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0Y29uc3QgcmV0ID0gW11cblx0XHRcdGZvciAobGV0IGEgPSAxOyBhIDw9IDM7ICsrYSkge1xuXHRcdFx0XHRmb3IgKGxldCBiID0gMTsgYiA8PSAzOyArK2IpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBjID0gMTsgYyA8PSAzOyArK2MpIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGQgPSAxOyBkIDw9IDM7ICsrZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYSArIGIgKyBjICsgZCA9PT0gZGF0YS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBBID0gcGFyc2VJbnQoZGF0YS5zdWJzdHJpbmcoMCwgYSksIDEwKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IEIgPSBwYXJzZUludChkYXRhLnN1YnN0cmluZyhhLCBhICsgYiksIDEwKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IEMgPSBwYXJzZUludChkYXRhLnN1YnN0cmluZyhhICsgYiwgYSArIGIgKyBjKSwgMTApXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgRCA9IHBhcnNlSW50KGRhdGEuc3Vic3RyaW5nKGEgKyBiICsgYywgYSArIGIgKyBjICsgZCksIDEwKVxuXHRcdFx0XHRcdFx0XHRcdGlmIChBIDw9IDI1NSAmJiBCIDw9IDI1NSAmJiBDIDw9IDI1NSAmJiBEIDw9IDI1NSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaXAgPSBbQS50b1N0cmluZygpLCAnLicsIEIudG9TdHJpbmcoKSwgJy4nLCBDLnRvU3RyaW5nKCksICcuJywgRC50b1N0cmluZygpXS5qb2luKCcnKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGlwLmxlbmd0aCA9PT0gZGF0YS5sZW5ndGggKyAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldC5wdXNoKGlwKVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldC50b1N0cmluZygpOyAvLyBBbnN3ZXIgZXhwZWN0ZWQgaXMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGFycmF5XG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdBbGdvcml0aG1pYyBTdG9jayBUcmFkZXIgSScsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0bGV0IG1heEN1ciA9IDBcblx0XHRcdGxldCBtYXhTb0ZhciA9IDBcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRtYXhDdXIgPSBNYXRoLm1heCgwLCAobWF4Q3VyICs9IGRhdGFbaV0gLSBkYXRhW2kgLSAxXSkpXG5cdFx0XHRcdG1heFNvRmFyID0gTWF0aC5tYXgobWF4Q3VyLCBtYXhTb0Zhcilcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXhTb0Zhci50b1N0cmluZygpXG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdBbGdvcml0aG1pYyBTdG9jayBUcmFkZXIgSUknLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGxldCBwcm9maXQgPSAwXG5cdFx0XHRmb3IgKGxldCBwID0gMTsgcCA8IGRhdGEubGVuZ3RoOyArK3ApIHtcblx0XHRcdFx0cHJvZml0ICs9IE1hdGgubWF4KGRhdGFbcF0gLSBkYXRhW3AgLSAxXSwgMClcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9maXQudG9TdHJpbmcoKVxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnQWxnb3JpdGhtaWMgU3RvY2sgVHJhZGVyIElJSScsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0bGV0IGhvbGQxID0gTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcblx0XHRcdGxldCBob2xkMiA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG5cdFx0XHRsZXQgcmVsZWFzZTEgPSAwXG5cdFx0XHRsZXQgcmVsZWFzZTIgPSAwXG5cdFx0XHRmb3IgKGNvbnN0IHByaWNlIG9mIGRhdGEpIHtcblx0XHRcdFx0cmVsZWFzZTIgPSBNYXRoLm1heChyZWxlYXNlMiwgaG9sZDIgKyBwcmljZSlcblx0XHRcdFx0aG9sZDIgPSBNYXRoLm1heChob2xkMiwgcmVsZWFzZTEgLSBwcmljZSlcblx0XHRcdFx0cmVsZWFzZTEgPSBNYXRoLm1heChyZWxlYXNlMSwgaG9sZDEgKyBwcmljZSlcblx0XHRcdFx0aG9sZDEgPSBNYXRoLm1heChob2xkMSwgcHJpY2UgKiAtMSlcblx0XHRcdH1cblx0XHRcdHJldHVybiByZWxlYXNlMi50b1N0cmluZygpXG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdBbGdvcml0aG1pYyBTdG9jayBUcmFkZXIgSVYnLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGNvbnN0IGsgPSBkYXRhWzBdXG5cdFx0XHRjb25zdCBwcmljZXMgPSBkYXRhWzFdXG5cdFx0XHRjb25zdCBsZW4gPSBwcmljZXMubGVuZ3RoXG5cdFx0XHRpZiAobGVuIDwgMikge1xuXHRcdFx0XHRyZXR1cm4gMFxuXHRcdFx0fVxuXHRcdFx0aWYgKGsgPiBsZW4gLyAyKSB7XG5cdFx0XHRcdGxldCByZXMgPSAwXG5cdFx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdFx0XHRyZXMgKz0gTWF0aC5tYXgocHJpY2VzW2ldIC0gcHJpY2VzW2kgLSAxXSwgMClcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzXG5cdFx0XHR9XG5cdFx0XHRjb25zdCBob2xkID0gW11cblx0XHRcdGNvbnN0IHJlbGUgPSBbXVxuXHRcdFx0aG9sZC5sZW5ndGggPSBrICsgMVxuXHRcdFx0cmVsZS5sZW5ndGggPSBrICsgMVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gazsgKytpKSB7XG5cdFx0XHRcdGhvbGRbaV0gPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxuXHRcdFx0XHRyZWxlW2ldID0gMFxuXHRcdFx0fVxuXHRcdFx0bGV0IGN1clxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0XHRjdXIgPSBwcmljZXNbaV1cblx0XHRcdFx0Zm9yIChsZXQgaiA9IGs7IGogPiAwOyAtLWopIHtcblx0XHRcdFx0XHRyZWxlW2pdID0gTWF0aC5tYXgocmVsZVtqXSwgaG9sZFtqXSArIGN1cilcblx0XHRcdFx0XHRob2xkW2pdID0gTWF0aC5tYXgoaG9sZFtqXSwgcmVsZVtqIC0gMV0gLSBjdXIpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZWxlW2tdXG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdNaW5pbXVtIFBhdGggU3VtIGluIGEgVHJpYW5nbGUnLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGNvbnN0IG4gPSBkYXRhLmxlbmd0aFxuXHRcdFx0Y29uc3QgZHAgPSBkYXRhW24gLSAxXS5zbGljZSgpXG5cdFx0XHRmb3IgKGxldCBpID0gbiAtIDI7IGkgPiAtMTsgLS1pKSB7XG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgZGF0YVtpXS5sZW5ndGg7ICsraikge1xuXHRcdFx0XHRcdGRwW2pdID0gTWF0aC5taW4oZHBbal0sIGRwW2ogKyAxXSkgKyBkYXRhW2ldW2pdXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBkcFswXVxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnVW5pcXVlIFBhdGhzIGluIGEgR3JpZCBJJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRjb25zdCBuID0gZGF0YVswXSAvLyBOdW1iZXIgb2Ygcm93c1xuXHRcdFx0Y29uc3QgbSA9IGRhdGFbMV0gLy8gTnVtYmVyIG9mIGNvbHVtbnNcblx0XHRcdGNvbnN0IGN1cnJlbnRSb3cgPSBbXVxuXHRcdFx0Y3VycmVudFJvdy5sZW5ndGggPSBuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRjdXJyZW50Um93W2ldID0gMVxuXHRcdFx0fVxuXHRcdFx0Zm9yIChsZXQgcm93ID0gMTsgcm93IDwgbTsgcm93KyspIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0XHRjdXJyZW50Um93W2ldICs9IGN1cnJlbnRSb3dbaSAtIDFdXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjdXJyZW50Um93W24gLSAxXVxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnVW5pcXVlIFBhdGhzIGluIGEgR3JpZCBJSScsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0Y29uc3Qgb2JzdGFjbGVHcmlkID0gW11cblx0XHRcdG9ic3RhY2xlR3JpZC5sZW5ndGggPSBkYXRhLmxlbmd0aFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvYnN0YWNsZUdyaWQubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0b2JzdGFjbGVHcmlkW2ldID0gZGF0YVtpXS5zbGljZSgpXG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG9ic3RhY2xlR3JpZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG9ic3RhY2xlR3JpZFswXS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdGlmIChvYnN0YWNsZUdyaWRbaV1bal0gPT0gMSkge1xuXHRcdFx0XHRcdFx0b2JzdGFjbGVHcmlkW2ldW2pdID0gMFxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaSA9PSAwICYmIGogPT0gMCkge1xuXHRcdFx0XHRcdFx0b2JzdGFjbGVHcmlkWzBdWzBdID0gMVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvYnN0YWNsZUdyaWRbaV1bal0gPSAoaSA+IDAgPyBvYnN0YWNsZUdyaWRbaSAtIDFdW2pdIDogMCkgKyAoaiA+IDAgPyBvYnN0YWNsZUdyaWRbaV1baiAtIDFdIDogMClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBvYnN0YWNsZUdyaWRbb2JzdGFjbGVHcmlkLmxlbmd0aCAtIDFdW29ic3RhY2xlR3JpZFswXS5sZW5ndGggLSAxXVxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnU2hvcnRlc3QgUGF0aCBpbiBhIEdyaWQnLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdC8vc2xpZ2h0bHkgYWRhcHRlZCBhbmQgc2ltcGxpZmllZCB0byBnZXQgcmlkIG9mIE1pbkhlYXAgdXNhZ2UsIGFuZCBjb25zdHJ1Y3QgYSB2YWxpZCBwYXRoIGZyb20gcG90ZW50aWFsIGNhbmRpZGF0ZXMgICBcblx0XHRcdC8vTWluSGVhcCByZXBsYWNlZCBieSBzaW1wbGUgYXJyYXkgYWN0aW5nIGFzIHF1ZXVlIChicmVhZHRoIGZpcnN0IHNlYXJjaCkgIFxuXHRcdFx0Y29uc3Qgd2lkdGggPSBkYXRhWzBdLmxlbmd0aDtcblx0XHRcdGNvbnN0IGhlaWdodCA9IGRhdGEubGVuZ3RoO1xuXHRcdFx0Y29uc3QgZHN0WSA9IGhlaWdodCAtIDE7XG5cdFx0XHRjb25zdCBkc3RYID0gd2lkdGggLSAxO1xuXG5cdFx0XHRjb25zdCBkaXN0YW5jZSA9IG5ldyBBcnJheShoZWlnaHQpO1xuXHRcdFx0Ly9jb25zdCBwcmV2OiBbW251bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZF1bXSA9IG5ldyBBcnJheShoZWlnaHQpO1xuXHRcdFx0Y29uc3QgcXVldWUgPSBbXTtcblxuXHRcdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuXHRcdFx0XHRkaXN0YW5jZVt5XSA9IG5ldyBBcnJheSh3aWR0aCkuZmlsbChJbmZpbml0eSk7XG5cdFx0XHRcdC8vcHJldlt5XSA9IG5ldyBBcnJheSh3aWR0aCkuZmlsbCh1bmRlZmluZWQpIGFzIFt1bmRlZmluZWRdO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiB2YWxpZFBvc2l0aW9uKHksIHgpIHtcblx0XHRcdFx0cmV0dXJuIHkgPj0gMCAmJiB5IDwgaGVpZ2h0ICYmIHggPj0gMCAmJiB4IDwgd2lkdGggJiYgZGF0YVt5XVt4XSA9PSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBMaXN0IGluLWJvdW5kcyBhbmQgcGFzc2FibGUgbmVpZ2hib3JzXG5cdFx0XHRmdW5jdGlvbiogbmVpZ2hib3JzKHksIHgpIHtcblx0XHRcdFx0aWYgKHZhbGlkUG9zaXRpb24oeSAtIDEsIHgpKSB5aWVsZCBbeSAtIDEsIHhdOyAvLyBVcFxuXHRcdFx0XHRpZiAodmFsaWRQb3NpdGlvbih5ICsgMSwgeCkpIHlpZWxkIFt5ICsgMSwgeF07IC8vIERvd25cblx0XHRcdFx0aWYgKHZhbGlkUG9zaXRpb24oeSwgeCAtIDEpKSB5aWVsZCBbeSwgeCAtIDFdOyAvLyBMZWZ0XG5cdFx0XHRcdGlmICh2YWxpZFBvc2l0aW9uKHksIHggKyAxKSkgeWllbGQgW3ksIHggKyAxXTsgLy8gUmlnaHRcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJlcGFyZSBzdGFydGluZyBwb2ludFxuXHRcdFx0ZGlzdGFuY2VbMF1bMF0gPSAwO1xuXG5cdFx0XHQvLyMjIE9yaWdpbmFsIHZlcnNpb25cblx0XHRcdC8vIHF1ZXVlLnB1c2goWzAsIDBdLCAwKTtcblx0XHRcdC8vIC8vIFRha2UgbmV4dC1uZWFyZXN0IHBvc2l0aW9uIGFuZCBleHBhbmQgcG90ZW50aWFsIHBhdGhzIGZyb20gdGhlcmVcblx0XHRcdC8vIHdoaWxlIChxdWV1ZS5zaXplID4gMCkge1xuXHRcdFx0Ly8gICBjb25zdCBbeSwgeF0gPSBxdWV1ZS5wb3AoKSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXHRcdFx0Ly8gICBmb3IgKGNvbnN0IFt5TiwgeE5dIG9mIG5laWdoYm9ycyh5LCB4KSkge1xuXHRcdFx0Ly8gICAgIGNvbnN0IGQgPSBkaXN0YW5jZVt5XVt4XSArIDE7XG5cdFx0XHQvLyAgICAgaWYgKGQgPCBkaXN0YW5jZVt5Tl1beE5dKSB7XG5cdFx0XHQvLyAgICAgICBpZiAoZGlzdGFuY2VbeU5dW3hOXSA9PSBJbmZpbml0eSlcblx0XHRcdC8vICAgICAgICAgLy8gTm90IHJlYWNoZWQgcHJldmlvdXNseVxuXHRcdFx0Ly8gICAgICAgICBxdWV1ZS5wdXNoKFt5TiwgeE5dLCBkKTtcblx0XHRcdC8vICAgICAgIC8vIEZvdW5kIGEgc2hvcnRlciBwYXRoXG5cdFx0XHQvLyAgICAgICBlbHNlIHF1ZXVlLmNoYW5nZVdlaWdodCgoW3lRLCB4UV0pID0+IHlRID09IHlOICYmIHhRID09IHhOLCBkKTtcblx0XHRcdC8vICAgICAgIC8vcHJldlt5Tl1beE5dID0gW3ksIHhdO1xuXHRcdFx0Ly8gICAgICAgZGlzdGFuY2VbeU5dW3hOXSA9IGQ7XG5cdFx0XHQvLyAgICAgfVxuXHRcdFx0Ly8gICB9XG5cdFx0XHQvLyB9XG5cblx0XHRcdC8vU2ltcGxpZmllZCB2ZXJzaW9uLiBkIDwgZGlzdGFuY2VbeU5dW3hOXSBzaG91bGQgbmV2ZXIgaGFwcGVuIGZvciBCRlMgaWYgZCAhPSBpbmZpbml0eSwgc28gd2Ugc2tpcCBjaGFuZ2V3ZWlnaHQgYW5kIHNpbXBsaWZ5IGltcGxlbWVudGF0aW9uXG5cdFx0XHQvL2FsZ28gYWx3YXlzIGV4cGFuZHMgc2hvcnRlc3QgcGF0aCwgZGlzdGFuY2UgIT0gaW5maW5pdHkgbWVhbnMgYSA8PSBsZW5naHQgcGF0aCByZWFjaGVzIGl0LCBvbmx5IHJlbWFpbmluZyBjYXNlIHRvIHNvbHZlIGlzIGluZmluaXR5ICAgIFxuXHRcdFx0cXVldWUucHVzaChbMCwgMF0pO1xuXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgW3ksIHhdID0gcXVldWUuc2hpZnQoKVxuXHRcdFx0XHRmb3IgKGNvbnN0IFt5TiwgeE5dIG9mIG5laWdoYm9ycyh5LCB4KSkge1xuXHRcdFx0XHRcdGlmIChkaXN0YW5jZVt5Tl1beE5dID09IEluZmluaXR5KSB7XG5cdFx0XHRcdFx0XHRxdWV1ZS5wdXNoKFt5TiwgeE5dKVxuXHRcdFx0XHRcdFx0ZGlzdGFuY2VbeU5dW3hOXSA9IGRpc3RhbmNlW3ldW3hdICsgMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBObyBwYXRoIGF0IGFsbD9cblx0XHRcdGlmIChkaXN0YW5jZVtkc3RZXVtkc3RYXSA9PSBJbmZpbml0eSkgcmV0dXJuIFwiXCI7XG5cblx0XHRcdC8vdHJhY2UgYSBwYXRoIGJhY2sgdG8gc3RhcnRcblx0XHRcdGxldCBwYXRoID0gXCJcIlxuXHRcdFx0bGV0IFt5QywgeENdID0gW2RzdFksIGRzdFhdXG5cdFx0XHR3aGlsZSAoeEMgIT0gMCB8fCB5QyAhPSAwKSB7XG5cdFx0XHRcdGNvbnN0IGRpc3QgPSBkaXN0YW5jZVt5Q11beENdO1xuXHRcdFx0XHRmb3IgKGNvbnN0IFt5RiwgeEZdIG9mIG5laWdoYm9ycyh5QywgeEMpKSB7XG5cdFx0XHRcdFx0aWYgKGRpc3RhbmNlW3lGXVt4Rl0gPT0gZGlzdCAtIDEpIHtcblx0XHRcdFx0XHRcdHBhdGggPSAoeEMgPT0geEYgPyAoeUMgPT0geUYgKyAxID8gXCJEXCIgOiBcIlVcIikgOiAoeEMgPT0geEYgKyAxID8gXCJSXCIgOiBcIkxcIikpICsgcGF0aDtcblx0XHRcdFx0XHRcdFt5QywgeENdID0gW3lGLCB4Rl1cblx0XHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwYXRoO1xuXHRcdH1cblx0fSxcblx0e1xuXHRcdG5hbWU6ICdTYW5pdGl6ZSBQYXJlbnRoZXNlcyBpbiBFeHByZXNzaW9uJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRsZXQgbGVmdCA9IDBcblx0XHRcdGxldCByaWdodCA9IDBcblx0XHRcdGNvbnN0IHJlcyA9IFtdXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0aWYgKGRhdGFbaV0gPT09ICcoJykge1xuXHRcdFx0XHRcdCsrbGVmdFxuXHRcdFx0XHR9IGVsc2UgaWYgKGRhdGFbaV0gPT09ICcpJykge1xuXHRcdFx0XHRcdGxlZnQgPiAwID8gLS1sZWZ0IDogKytyaWdodFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRmcyhwYWlyLCBpbmRleCwgbGVmdCwgcmlnaHQsIHMsIHNvbHV0aW9uLCByZXMpIHtcblx0XHRcdFx0aWYgKHMubGVuZ3RoID09PSBpbmRleCkge1xuXHRcdFx0XHRcdGlmIChsZWZ0ID09PSAwICYmIHJpZ2h0ID09PSAwICYmIHBhaXIgPT09IDApIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXNbaV0gPT09IHNvbHV0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJlcy5wdXNoKHNvbHV0aW9uKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc1tpbmRleF0gPT09ICcoJykge1xuXHRcdFx0XHRcdGlmIChsZWZ0ID4gMCkge1xuXHRcdFx0XHRcdFx0ZGZzKHBhaXIsIGluZGV4ICsgMSwgbGVmdCAtIDEsIHJpZ2h0LCBzLCBzb2x1dGlvbiwgcmVzKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkZnMocGFpciArIDEsIGluZGV4ICsgMSwgbGVmdCwgcmlnaHQsIHMsIHNvbHV0aW9uICsgc1tpbmRleF0sIHJlcylcblx0XHRcdFx0fSBlbHNlIGlmIChzW2luZGV4XSA9PT0gJyknKSB7XG5cdFx0XHRcdFx0aWYgKHJpZ2h0ID4gMCkgZGZzKHBhaXIsIGluZGV4ICsgMSwgbGVmdCwgcmlnaHQgLSAxLCBzLCBzb2x1dGlvbiwgcmVzKVxuXHRcdFx0XHRcdGlmIChwYWlyID4gMCkgZGZzKHBhaXIgLSAxLCBpbmRleCArIDEsIGxlZnQsIHJpZ2h0LCBzLCBzb2x1dGlvbiArIHNbaW5kZXhdLCByZXMpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGZzKHBhaXIsIGluZGV4ICsgMSwgbGVmdCwgcmlnaHQsIHMsIHNvbHV0aW9uICsgc1tpbmRleF0sIHJlcylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZGZzKDAsIDAsIGxlZnQsIHJpZ2h0LCBkYXRhLCAnJywgcmVzKVxuXG5cdFx0XHRyZXR1cm4gcmVzXG5cdFx0fSxcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdGaW5kIEFsbCBWYWxpZCBNYXRoIEV4cHJlc3Npb25zJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRjb25zdCBudW0gPSBkYXRhWzBdXG5cdFx0XHRjb25zdCB0YXJnZXQgPSBkYXRhWzFdXG5cblx0XHRcdGZ1bmN0aW9uIGhlbHBlcihyZXMsIHBhdGgsIG51bSwgdGFyZ2V0LCBwb3MsIGV2YWx1YXRlZCwgbXVsdGVkKSB7XG5cdFx0XHRcdGlmIChwb3MgPT09IG51bS5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZiAodGFyZ2V0ID09PSBldmFsdWF0ZWQpIHtcblx0XHRcdFx0XHRcdHJlcy5wdXNoKHBhdGgpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAobGV0IGkgPSBwb3M7IGkgPCBudW0ubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHRpZiAoaSAhPSBwb3MgJiYgbnVtW3Bvc10gPT0gJzAnKSB7XG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBjdXIgPSBwYXJzZUludChudW0uc3Vic3RyaW5nKHBvcywgaSArIDEpKVxuXHRcdFx0XHRcdGlmIChwb3MgPT09IDApIHtcblx0XHRcdFx0XHRcdGhlbHBlcihyZXMsIHBhdGggKyBjdXIsIG51bSwgdGFyZ2V0LCBpICsgMSwgY3VyLCBjdXIpXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGhlbHBlcihyZXMsIHBhdGggKyAnKycgKyBjdXIsIG51bSwgdGFyZ2V0LCBpICsgMSwgZXZhbHVhdGVkICsgY3VyLCBjdXIpXG5cdFx0XHRcdFx0XHRoZWxwZXIocmVzLCBwYXRoICsgJy0nICsgY3VyLCBudW0sIHRhcmdldCwgaSArIDEsIGV2YWx1YXRlZCAtIGN1ciwgLWN1cilcblx0XHRcdFx0XHRcdGhlbHBlcihyZXMsIHBhdGggKyAnKicgKyBjdXIsIG51bSwgdGFyZ2V0LCBpICsgMSwgZXZhbHVhdGVkIC0gbXVsdGVkICsgbXVsdGVkICogY3VyLCBtdWx0ZWQgKiBjdXIpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChudW0gPT0gbnVsbCB8fCBudW0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0fVxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gW11cblx0XHRcdGhlbHBlcihyZXN1bHQsICcnLCBudW0sIHRhcmdldCwgMCwgMCwgMClcblx0XHRcdHJldHVybiByZXN1bHRcblx0XHR9LFxuXHR9LFxuXHR7XG5cdFx0Ly9UYWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWx5eGllL2JpdGJ1cm5lci9ibG9iL2Rldi9zcmMvdXRpbHMvSGFtbWluZ0NvZGVUb29scy50cyBhbmQgY29udmVydGVkIHRvIGpzIGJ5IERpc2NvcmQ6IEgzZHJhdXQzciM2NzIyXG5cdFx0bmFtZTogJ0hhbW1pbmdDb2RlczogSW50ZWdlciB0byBFbmNvZGVkIEJpbmFyeScsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdC8vIENhbGN1bGF0ZXMgdGhlIG5lZWRlZCBhbW91bnQgb2YgcGFyaXR5Qml0cyAnd2l0aG91dCcgdGhlIFwib3ZlcmFsbFwiLVBhcml0eVxuXHRcdFx0Y29uc3QgSGFtbWluZ1N1bU9mUGFyaXR5ID0gbGVuZ3RoT2ZEQml0cyA9PiBsZW5ndGhPZkRCaXRzID09IDAgPyAwIDogbGVuZ3RoT2ZEQml0cyA8IDMgPyBsZW5ndGhPZkRCaXRzICsgMSA6XG5cdFx0XHRcdE1hdGguY2VpbChNYXRoLmxvZzIobGVuZ3RoT2ZEQml0cyAqIDIpKSA8PSBNYXRoLmNlaWwoTWF0aC5sb2cyKDEgKyBsZW5ndGhPZkRCaXRzICsgTWF0aC5jZWlsKE1hdGgubG9nMihsZW5ndGhPZkRCaXRzKSkpKSA/XG5cdFx0XHRcdFx0TWF0aC5jZWlsKE1hdGgubG9nMihsZW5ndGhPZkRCaXRzKSArIDEpIDogTWF0aC5jZWlsKE1hdGgubG9nMihsZW5ndGhPZkRCaXRzKSk7XG5cdFx0XHRjb25zdCBkYXRhID0gdmFsdWUudG9TdHJpbmcoMikuc3BsaXQoXCJcIik7IC8vIGZpcnN0LCBjaGFuZ2UgaW50byBiaW5hcnkgc3RyaW5nLCB0aGVuIGNyZWF0ZSBhcnJheSB3aXRoIDEgYml0IHBlciBpbmRleFxuXHRcdFx0Y29uc3Qgc3VtUGFyaXR5ID0gSGFtbWluZ1N1bU9mUGFyaXR5KGRhdGEubGVuZ3RoKTsgLy8gZ2V0IHRoZSBzdW0gb2YgbmVlZGVkIHBhcml0eSBiaXRzIChmb3IgbGF0ZXIgdXNlIGluIGVuY29kaW5nKVxuXHRcdFx0Y29uc3QgY291bnQgPSAoYXJyLCB2YWwpID0+IGFyci5yZWR1Y2UoKGEsIHYpID0+ICh2ID09PSB2YWwgPyBhICsgMSA6IGEpLCAwKTtcblx0XHRcdC8vIGZ1bmN0aW9uIGNvdW50IGZvciBzcGVjaWZpYyBlbnRyaWVzIGluIHRoZSBhcnJheSwgZm9yIGxhdGVyIHVzZVxuXHRcdFx0Y29uc3QgYnVpbGQgPSBbXCJ4XCIsIFwieFwiLCAuLi5kYXRhLnNwbGljZSgwLCAxKV07IC8vIGluaXQgdGhlIFwicHJlLWJ1aWxkXCJcblx0XHRcdGZvciAobGV0IGkgPSAyOyBpIDwgc3VtUGFyaXR5OyBpKyspXG5cdFx0XHRcdGJ1aWxkLnB1c2goXCJ4XCIsIC4uLmRhdGEuc3BsaWNlKDAsIE1hdGgucG93KDIsIGkpIC0gMSkpOyAvLyBhZGQgbmV3IHBhcml0eWJpdHMgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGRhdGEgYml0cyAocHJlLWJ1aWxkaW5nIGFycmF5KVxuXHRcdFx0Ly8gR2V0IHRoZSBpbmRleCBudW1iZXJzIHdoZXJlIHRoZSBwYXJpdHkgYml0cyBcInhcIiBhcmUgcGxhY2VkXG5cdFx0XHRjb25zdCBwYXJpdHlCaXRzID0gYnVpbGQubWFwKChlLCBpKSA9PiBbZSwgaV0pLmZpbHRlcigoW2UsIF9dKSA9PiBlID09IFwieFwiKS5tYXAoKFtfLCBpXSkgPT4gaSk7XG5cdFx0XHRmb3IgKGNvbnN0IGluZGV4IG9mIHBhcml0eUJpdHMpIHtcblx0XHRcdFx0Y29uc3QgdGVtcGNvdW50ID0gaW5kZXggKyAxOyAvLyBzZXQgdGhlIFwic3RlcHNpemVcIiBmb3IgdGhlIHBhcml0eUJpdFxuXHRcdFx0XHRjb25zdCB0ZW1wYXJyYXkgPSBbXTsgLy8gdGVtcG9yYXJ5IGFycmF5IHRvIHN0b3JlIHRoZSBleHRyYWN0ZWQgYml0c1xuXHRcdFx0XHRjb25zdCB0ZW1wZGF0YSA9IFsuLi5idWlsZF07IC8vIG9ubHkgd29yayB3aXRoIGEgY29weSBvZiB0aGUgYnVpbGRcblx0XHRcdFx0d2hpbGUgKHRlbXBkYXRhW2luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Ly8gYXMgbG9uZyBhcyB0aGVyZSBhcmUgYml0cyBvbiB0aGUgc3RhcnRpbmcgaW5kZXgsIGRvIFwiY3V0XCJcblx0XHRcdFx0XHRjb25zdCB0ZW1wID0gdGVtcGRhdGEuc3BsaWNlKGluZGV4LCB0ZW1wY291bnQgKiAyKTsgLy8gY3V0IHN0ZXBzaXplKjIgYml0cywgdGhlbi4uLlxuXHRcdFx0XHRcdHRlbXBhcnJheS5wdXNoKC4uLnRlbXAuc3BsaWNlKDAsIHRlbXBjb3VudCkpOyAvLyAuLi4gY3V0IHRoZSByZXN1bHQgYWdhaW4gYW5kIGtlZXAgdGhlIGZpcnN0IGhhbGZcblx0XHRcdFx0fVxuXHRcdFx0XHR0ZW1wYXJyYXkuc3BsaWNlKDAsIDEpOyAvLyByZW1vdmUgZmlyc3QgYml0LCB3aGljaCBpcyB0aGUgcGFyaXR5IG9uZVxuXHRcdFx0XHRidWlsZFtpbmRleF0gPSAoY291bnQodGVtcGFycmF5LCBcIjFcIikgJSAyKS50b1N0cmluZygpOyAvLyBjb3VudCB3aXRoIHJlbWFpbmRlciBvZiAyIGFuZFwidG9TdHJpbmdcIiB0byBzdG9yZSB0aGUgcGFyaXR5Qml0XG5cdFx0XHR9IC8vIHBhcml0eSBkb25lLCBub3cgdGhlIFwib3ZlcmFsbFwiLXBhcml0eSBpcyBzZXRcblx0XHRcdGJ1aWxkLnVuc2hpZnQoKGNvdW50KGJ1aWxkLCBcIjFcIikgJSAyKS50b1N0cmluZygpKTsgLy8gaGFzIHRvIGJlIGRvbmUgYXMgbGFzdCBlbGVtZW50XG5cdFx0XHRyZXR1cm4gYnVpbGQuam9pbihcIlwiKTsgLy8gcmV0dXJuIHRoZSBidWlsZCBhcyBzdHJpbmdcblx0XHR9LFxuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ0hhbW1pbmdDb2RlczogRW5jb2RlZCBCaW5hcnkgdG8gSW50ZWdlcicsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0Ly9jaGVjayBmb3IgYWx0ZXJlZCBiaXQgYW5kIGRlY29kZVxuXHRcdFx0Y29uc3QgYnVpbGQgPSBkYXRhLnNwbGl0KFwiXCIpOyAvLyB5ZSwgYW4gYXJyYXkgZm9yIHdvcmtpbmcsIGFnYWluXG5cdFx0XHRjb25zdCB0ZXN0QXJyYXkgPSBbXTsgLy9mb3IgdGhlIFwidHJ1dGh0YWJsZVwiLiBpZiBhbnkgaXMgZmFsc2UsIHRoZSBkYXRhIGhhcyBhbiBhbHRlcmVkIGJpdCwgd2lsbCBjaGVjayBmb3IgYW5kIGZpeCBpdFxuXHRcdFx0Y29uc3Qgc3VtUGFyaXR5ID0gTWF0aC5jZWlsKE1hdGgubG9nMihkYXRhLmxlbmd0aCkpOyAvLyBzdW0gb2YgcGFyaXR5IGZvciBsYXRlciB1c2Vcblx0XHRcdGNvbnN0IGNvdW50ID0gKGFyciwgdmFsKSA9PiBhcnIucmVkdWNlKChhLCB2KSA9PiAodiA9PT0gdmFsID8gYSArIDEgOiBhKSwgMCk7XG5cdFx0XHQvLyB0aGUgY291bnQuLi4uIGFnYWluIDspXG5cdFx0XHRsZXQgb3ZlcmFsbFBhcml0eSA9IGJ1aWxkLnNwbGljZSgwLCAxKS5qb2luKFwiXCIpOyAvLyBzdG9yZSBmaXJzdCBpbmRleCwgZm9yIGNoZWNraW5nIGluIG5leHQgc3RlcCBhbmQgZml4IHRoZSBidWlsZCBwcm9wZXJseSBsYXRlciBvblxuXHRcdFx0dGVzdEFycmF5LnB1c2gob3ZlcmFsbFBhcml0eSA9PSAoY291bnQoYnVpbGQsIFwiMVwiKSAlIDIpLnRvU3RyaW5nKCkgPyB0cnVlIDogZmFsc2UpOyAvLyBmaXJzdCBjaGVjayB3aXRoIHRoZSBvdmVyYWxsIHBhcml0eSBiaXRcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3VtUGFyaXR5OyBpKyspIHtcblx0XHRcdFx0Ly8gZm9yIHRoZSByZXN0IG9mIHRoZSByZW1haW5pbmcgcGFyaXR5IGJpdHMgd2UgYWxzbyBcImNoZWNrXCJcblx0XHRcdFx0Y29uc3QgdGVtcEluZGV4ID0gTWF0aC5wb3coMiwgaSkgLSAxOyAvLyBnZXQgdGhlIHBhcml0eUJpdHMgSW5kZXhcblx0XHRcdFx0Y29uc3QgdGVtcFN0ZXAgPSB0ZW1wSW5kZXggKyAxOyAvLyBzZXQgdGhlIHN0ZXBzaXplXG5cdFx0XHRcdGNvbnN0IHRlbXBEYXRhID0gWy4uLmJ1aWxkXTsgLy8gZ2V0IGEgXCJjb3B5XCIgb2YgdGhlIGJ1aWxkLWRhdGEgZm9yIHdvcmtpbmdcblx0XHRcdFx0Y29uc3QgdGVtcEFycmF5ID0gW107IC8vIGluaXQgZW1wdHkgYXJyYXkgZm9yIFwidGVzdGluZ1wiXG5cdFx0XHRcdHdoaWxlICh0ZW1wRGF0YVt0ZW1wSW5kZXhdICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIGV4dHJhY3QgZnJvbSB0aGUgY29waWVkIGRhdGEgdW50aWwgdGhlIFwic3RhcnRpbmdcIiBpbmRleCBpcyB1bmRlZmluZWRcblx0XHRcdFx0XHRjb25zdCB0ZW1wID0gWy4uLnRlbXBEYXRhLnNwbGljZSh0ZW1wSW5kZXgsIHRlbXBTdGVwICogMildOyAvLyBleHRyYWN0IDIqc3RlcHNpemVcblx0XHRcdFx0XHR0ZW1wQXJyYXkucHVzaCguLi50ZW1wLnNwbGljZSgwLCB0ZW1wU3RlcCkpOyAvLyBhbmQgY3V0IGFnYWluIGZvciBrZWVwaW5nIGZpcnN0IGhhbGZcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCB0ZW1wUGFyaXR5ID0gdGVtcEFycmF5LnNoaWZ0KCk7IC8vIGFuZCBhZ2FpbiBzYXZlIHRoZSBmaXJzdCBpbmRleCBzZXBhcmF0ZWQgZm9yIGNoZWNraW5nIHdpdGggdGhlIHJlc3Qgb2YgdGhlIGRhdGFcblx0XHRcdFx0dGVzdEFycmF5LnB1c2godGVtcFBhcml0eSA9PSAoY291bnQodGVtcEFycmF5LCBcIjFcIikgJSAyKS50b1N0cmluZygpID8gdHJ1ZSA6IGZhbHNlKTtcblx0XHRcdFx0Ly8gaXMgdGhlIHRlbXBQYXJpdHkgdGhlIGNhbGN1bGF0ZWQgZGF0YT8gcHVzaCBhbnN3ZXIgaW50byB0aGUgJ3RydXRodGFibGUnXG5cdFx0XHR9XG5cdFx0XHRsZXQgZml4SW5kZXggPSAwOyAvLyBpbml0IHRoZSBcImZpeGluZ1wiIGluZGV4IGFuZCBzdGFydCB3aXRoIDBcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgc3VtUGFyaXR5ICsgMTsgaSsrKSB7XG5cdFx0XHRcdC8vIHNpbXBsZSBiaW5hcnkgYWRkaW5nIGZvciBldmVyeSBib29sZWFuIGluIHRoZSB0ZXN0QXJyYXksIHN0YXJ0aW5nIGZyb20gMm5kIGluZGV4IG9mIGl0XG5cdFx0XHRcdGZpeEluZGV4ICs9IHRlc3RBcnJheVtpXSA/IDAgOiBNYXRoLnBvdygyLCBpKSAvIDI7XG5cdFx0XHR9XG5cdFx0XHRidWlsZC51bnNoaWZ0KG92ZXJhbGxQYXJpdHkpOyAvLyBub3cgd2UgbmVlZCB0aGUgXCJvdmVyYWxsXCIgcGFyaXR5IGJhY2sgaW4gaXQncyBwbGFjZVxuXHRcdFx0Ly8gdHJ5IGZpeCB0aGUgYWN0dWFsIGVuY29kZWQgYmluYXJ5IHN0cmluZyBpZiB0aGVyZSBpcyBhbiBlcnJvclxuXHRcdFx0aWYgKGZpeEluZGV4ID4gMCAmJiB0ZXN0QXJyYXlbMF0gPT0gZmFsc2UpIHsgLy8gaWYgdGhlIG92ZXJhbGwgaXMgZmFsc2UgYW5kIHRoZSBzdW0gb2YgY2FsY3VsYXRlZCB2YWx1ZXMgaXMgZ3JlYXRlciBlcXVhbCAwLCBmaXggdGhlIGNvcnJlc3BvbmRpbmcgaGFtbWluZy1iaXQgICAgICAgICAgIFxuXHRcdFx0XHRidWlsZFtmaXhJbmRleF0gPSBidWlsZFtmaXhJbmRleF0gPT0gXCIwXCIgPyBcIjFcIiA6IFwiMFwiO1xuXHRcdFx0fSBlbHNlIGlmICh0ZXN0QXJyYXlbMF0gPT0gZmFsc2UpIHsgLy8gb3RoZXJ3aXNlLCBpZiB0aGUgdGhlIG92ZXJhbGxwYXJpdHkgaXMgdGhlIG9ubHkgd3JvbmcsIGZpeCB0aGF0IG9uZSAgICAgICAgICAgXG5cdFx0XHRcdG92ZXJhbGxQYXJpdHkgPSBvdmVyYWxsUGFyaXR5ID09IFwiMFwiID8gXCIxXCIgOiBcIjBcIjtcblx0XHRcdH0gZWxzZSBpZiAodGVzdEFycmF5WzBdID09IHRydWUgJiYgdGVzdEFycmF5LnNvbWUoKHRydXRoKSA9PiB0cnV0aCA9PSBmYWxzZSkpIHtcblx0XHRcdFx0cmV0dXJuIDA7IC8vIEVSUk9SOiBUaGVyZSdzIHNvbWUgc3RyYW5nZSBnb2luZyBvbi4uLiAyIGJpdHMgYXJlIGFsdGVyZWQ/IEhvdz8gVGhpcyBzaG91bGQgbm90IGhhcHBlblxuXHRcdFx0fVxuXHRcdFx0Ly8gb29mLi4gaGFsZndheSB0aHJvdWdoLi4uIHdlIGZpeGVkIGFuIHBvc3NpYmxlIGFsdGVyZWQgYml0LCBub3cgXCJleHRyYWN0XCIgdGhlIHBhcml0eS1iaXRzIGZyb20gdGhlIGJ1aWxkXG5cdFx0XHRmb3IgKGxldCBpID0gc3VtUGFyaXR5OyBpID49IDA7IGktLSkge1xuXHRcdFx0XHQvLyBzdGFydCBmcm9tIHRoZSBsYXN0IHBhcml0eSBkb3duIHRoZSAybmQgaW5kZXggb25lXG5cdFx0XHRcdGJ1aWxkLnNwbGljZShNYXRoLnBvdygyLCBpKSwgMSk7XG5cdFx0XHR9XG5cdFx0XHRidWlsZC5zcGxpY2UoMCwgMSk7IC8vIHJlbW92ZSB0aGUgb3ZlcmFsbCBwYXJpdHkgYml0IGFuZCB3ZSBoYXZlIG91ciBiaW5hcnkgdmFsdWVcblx0XHRcdHJldHVybiBwYXJzZUludChidWlsZC5qb2luKFwiXCIpLCAyKTsgLy8gcGFyc2UgdGhlIGludGVnZXIgd2l0aCByZWR1eCAyIGFuZCB3ZSdyZSBkb25lIVxuXHRcdH0sXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnUHJvcGVyIDItQ29sb3Jpbmcgb2YgYSBHcmFwaCcsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0Ly8gY29udmVydCBmcm9tIGVkZ2VzIHRvIG5vZGVzXG5cdFx0XHRjb25zdCBub2RlcyA9IG5ldyBBcnJheShkYXRhWzBdKS5maWxsKDApLm1hcCgoKSA9PiBbXSlcblx0XHRcdGZvciAoY29uc3QgZSBvZiBkYXRhWzFdKSB7XG5cdFx0XHRcdG5vZGVzW2VbMF1dLnB1c2goZVsxXSlcblx0XHRcdFx0bm9kZXNbZVsxXV0ucHVzaChlWzBdKVxuXHRcdFx0fVxuXHRcdFx0Ly8gc29sdXRpb24gZ3JhcGggc3RhcnRzIG91dCB1bmRlZmluZWQgYW5kIGZpbGxzIGluIHdpdGggMHMgYW5kIDFzXG5cdFx0XHRjb25zdCBzb2x1dGlvbiA9IG5ldyBBcnJheShkYXRhWzBdKS5maWxsKHVuZGVmaW5lZClcblx0XHRcdGxldCBvZGRDeWNsZUZvdW5kID0gZmFsc2Vcblx0XHRcdC8vIHJlY3Vyc2l2ZSBmdW5jdGlvbiBmb3IgREZTXG5cdFx0XHRjb25zdCB0cmF2ZXJzZSA9IChpbmRleCwgY29sb3IpID0+IHtcblx0XHRcdFx0aWYgKG9kZEN5Y2xlRm91bmQpIHtcblx0XHRcdFx0XHQvLyBsZWF2ZSBpbW1lZGlhdGVseSBpZiBhbiBpbnZhbGlkIGN5Y2xlIHdhcyBmb3VuZFxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzb2x1dGlvbltpbmRleF0gPT09IGNvbG9yKSB7XG5cdFx0XHRcdFx0Ly8gbm9kZSB3YXMgYWxyZWFkeSBoaXQgYW5kIGlzIGNvcnJlY3RseSBjb2xvcmVkXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNvbHV0aW9uW2luZGV4XSA9PT0gKGNvbG9yIF4gMSkpIHtcblx0XHRcdFx0XHQvLyBub2RlIHdhcyBhbHJlYWR5IGhpdCBhbmQgaXMgaW5jb3JyZWN0bHkgY29sb3JlZDogZ3JhcGggaXMgdW5jb2xvcmFibGVcblx0XHRcdFx0XHRvZGRDeWNsZUZvdW5kID0gdHJ1ZVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHRcdHNvbHV0aW9uW2luZGV4XSA9IGNvbG9yXG5cdFx0XHRcdGZvciAoY29uc3QgbiBvZiBub2Rlc1tpbmRleF0pIHtcblx0XHRcdFx0XHR0cmF2ZXJzZShuLCBjb2xvciBeIDEpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIHJlcGVhdCBydW4gZm9yIGFzIGxvbmcgYXMgdW5kZWZpbmVkIG5vZGVzIGFyZSBmb3VuZCwgaW4gY2FzZSBncmFwaCBpc24ndCBmdWxseSBjb25uZWN0ZWRcblx0XHRcdHdoaWxlICghb2RkQ3ljbGVGb3VuZCAmJiBzb2x1dGlvbi5zb21lKGUgPT4gZSA9PT0gdW5kZWZpbmVkKSkge1xuXHRcdFx0XHR0cmF2ZXJzZShzb2x1dGlvbi5pbmRleE9mKHVuZGVmaW5lZCksIDApXG5cdFx0XHR9XG5cdFx0XHRpZiAob2RkQ3ljbGVGb3VuZCkgcmV0dXJuIFwiW11cIjsgLy8gVE9ETzogQnVnICMzNzU1IGluIGJpdGJ1cm5lciByZXF1aXJlcyBhIHN0cmluZyBsaXRlcmFsLiBXaWxsIHRoaXMgYmUgZml4ZWQ/XG5cdFx0XHRyZXR1cm4gc29sdXRpb25cblx0XHR9LFxuXHR9LFxuXHR7XG5cdFx0bmFtZTogXCJDb21wcmVzc2lvbiBJOiBSTEUgQ29tcHJlc3Npb25cIixcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHQvL29yaWdpbmFsIGNvZGUgZG9lc24ndCBnZW5lcmF0ZSBhbiBhbnN3ZXIsIGJ1dCB2YWxpZGF0ZXMgaXQsIGZhbGxiYWNrIHRvIHRoaXMgb25lLWxpbmVyXG5cdFx0XHRyZXR1cm4gZGF0YS5yZXBsYWNlKC8oW1xcd10pXFwxezAsOH0vZywgKGdyb3VwLCBjaHIpID0+IGdyb3VwLmxlbmd0aCArIGNocilcblx0XHR9XG5cdH0sXG5cdHtcblx0XHRuYW1lOiBcIkNvbXByZXNzaW9uIElJOiBMWiBEZWNvbXByZXNzaW9uXCIsXG5cdFx0c29sdmVyOiBmdW5jdGlvbiAoY29tcHIpIHtcblx0XHRcdGxldCBwbGFpbiA9IFwiXCI7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29tcHIubGVuZ3RoOykge1xuXHRcdFx0XHRjb25zdCBsaXRlcmFsX2xlbmd0aCA9IGNvbXByLmNoYXJDb2RlQXQoaSkgLSAweDMwO1xuXG5cdFx0XHRcdGlmIChsaXRlcmFsX2xlbmd0aCA8IDAgfHwgbGl0ZXJhbF9sZW5ndGggPiA5IHx8IGkgKyAxICsgbGl0ZXJhbF9sZW5ndGggPiBjb21wci5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBsYWluICs9IGNvbXByLnN1YnN0cmluZyhpICsgMSwgaSArIDEgKyBsaXRlcmFsX2xlbmd0aCk7XG5cdFx0XHRcdGkgKz0gMSArIGxpdGVyYWxfbGVuZ3RoO1xuXG5cdFx0XHRcdGlmIChpID49IGNvbXByLmxlbmd0aCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGJhY2tyZWZfbGVuZ3RoID0gY29tcHIuY2hhckNvZGVBdChpKSAtIDB4MzA7XG5cblx0XHRcdFx0aWYgKGJhY2tyZWZfbGVuZ3RoIDwgMCB8fCBiYWNrcmVmX2xlbmd0aCA+IDkpIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fSBlbHNlIGlmIChiYWNrcmVmX2xlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdCsraTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoaSArIDEgPj0gY29tcHIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCBiYWNrcmVmX29mZnNldCA9IGNvbXByLmNoYXJDb2RlQXQoaSArIDEpIC0gMHgzMDtcblx0XHRcdFx0XHRpZiAoKGJhY2tyZWZfbGVuZ3RoID4gMCAmJiAoYmFja3JlZl9vZmZzZXQgPCAxIHx8IGJhY2tyZWZfb2Zmc2V0ID4gOSkpIHx8IGJhY2tyZWZfb2Zmc2V0ID4gcGxhaW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGJhY2tyZWZfbGVuZ3RoOyArK2opIHtcblx0XHRcdFx0XHRcdHBsYWluICs9IHBsYWluW3BsYWluLmxlbmd0aCAtIGJhY2tyZWZfb2Zmc2V0XTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBsYWluO1xuXHRcdH1cblx0fSxcblx0e1xuXHRcdG5hbWU6IFwiQ29tcHJlc3Npb24gSUlJOiBMWiBDb21wcmVzc2lvblwiLFxuXHRcdHNvbHZlcjogZnVuY3Rpb24gKHBsYWluKSB7XG5cdFx0XHRsZXQgY3VyX3N0YXRlID0gQXJyYXkuZnJvbShBcnJheSgxMCksICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTtcblx0XHRcdGxldCBuZXdfc3RhdGUgPSBBcnJheS5mcm9tKEFycmF5KDEwKSwgKCkgPT4gQXJyYXkoMTApKTtcblxuXHRcdFx0ZnVuY3Rpb24gc2V0KHN0YXRlLCBpLCBqLCBzdHIpIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudCA9IHN0YXRlW2ldW2pdO1xuXHRcdFx0XHRpZiAoY3VycmVudCA9PSBudWxsIHx8IHN0ci5sZW5ndGggPCBjdXJyZW50Lmxlbmd0aCkge1xuXHRcdFx0XHRcdHN0YXRlW2ldW2pdID0gc3RyO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHN0ci5sZW5ndGggPT09IGN1cnJlbnQubGVuZ3RoICYmIE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcblx0XHRcdFx0XHQvLyBpZiB0d28gc3RyaW5ncyBhcmUgdGhlIHNhbWUgbGVuZ3RoLCBwaWNrIHJhbmRvbWx5IHNvIHRoYXRcblx0XHRcdFx0XHQvLyB3ZSBnZW5lcmF0ZSBtb3JlIHBvc3NpYmxlIGlucHV0cyB0byBDb21wcmVzc2lvbiBJSVxuXHRcdFx0XHRcdHN0YXRlW2ldW2pdID0gc3RyO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGluaXRpYWwgc3RhdGUgaXMgYSBsaXRlcmFsIG9mIGxlbmd0aCAxXG5cdFx0XHRjdXJfc3RhdGVbMF1bMV0gPSBcIlwiO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHBsYWluLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdGZvciAoY29uc3Qgcm93IG9mIG5ld19zdGF0ZSkge1xuXHRcdFx0XHRcdHJvdy5maWxsKG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGMgPSBwbGFpbltpXTtcblxuXHRcdFx0XHQvLyBoYW5kbGUgbGl0ZXJhbHNcblx0XHRcdFx0Zm9yIChsZXQgbGVuZ3RoID0gMTsgbGVuZ3RoIDw9IDk7ICsrbGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RyaW5nID0gY3VyX3N0YXRlWzBdW2xlbmd0aF07XG5cdFx0XHRcdFx0aWYgKHN0cmluZyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAobGVuZ3RoIDwgOSkge1xuXHRcdFx0XHRcdFx0Ly8gZXh0ZW5kIGN1cnJlbnQgbGl0ZXJhbFxuXHRcdFx0XHRcdFx0c2V0KG5ld19zdGF0ZSwgMCwgbGVuZ3RoICsgMSwgc3RyaW5nKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RhcnQgbmV3IGxpdGVyYWxcblx0XHRcdFx0XHRcdHNldChuZXdfc3RhdGUsIDAsIDEsIHN0cmluZyArIFwiOVwiICsgcGxhaW4uc3Vic3RyaW5nKGkgLSA5LCBpKSArIFwiMFwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKGxldCBvZmZzZXQgPSAxOyBvZmZzZXQgPD0gTWF0aC5taW4oOSwgaSk7ICsrb2Zmc2V0KSB7XG5cdFx0XHRcdFx0XHRpZiAocGxhaW5baSAtIG9mZnNldF0gPT09IGMpIHtcblx0XHRcdFx0XHRcdFx0Ly8gc3RhcnQgbmV3IGJhY2tyZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0c2V0KG5ld19zdGF0ZSwgb2Zmc2V0LCAxLCBzdHJpbmcgKyBsZW5ndGggKyBwbGFpbi5zdWJzdHJpbmcoaSAtIGxlbmd0aCwgaSkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGhhbmRsZSBiYWNrcmVmZXJlbmNlc1xuXHRcdFx0XHRmb3IgKGxldCBvZmZzZXQgPSAxOyBvZmZzZXQgPD0gOTsgKytvZmZzZXQpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBsZW5ndGggPSAxOyBsZW5ndGggPD0gOTsgKytsZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHN0cmluZyA9IGN1cl9zdGF0ZVtvZmZzZXRdW2xlbmd0aF07XG5cdFx0XHRcdFx0XHRpZiAoc3RyaW5nID09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChwbGFpbltpIC0gb2Zmc2V0XSA9PT0gYykge1xuXHRcdFx0XHRcdFx0XHRpZiAobGVuZ3RoIDwgOSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGV4dGVuZCBjdXJyZW50IGJhY2tyZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRzZXQobmV3X3N0YXRlLCBvZmZzZXQsIGxlbmd0aCArIDEsIHN0cmluZyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gc3RhcnQgbmV3IGJhY2tyZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRzZXQobmV3X3N0YXRlLCBvZmZzZXQsIDEsIHN0cmluZyArIFwiOVwiICsgb2Zmc2V0ICsgXCIwXCIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHN0YXJ0IG5ldyBsaXRlcmFsXG5cdFx0XHRcdFx0XHRzZXQobmV3X3N0YXRlLCAwLCAxLCBzdHJpbmcgKyBsZW5ndGggKyBvZmZzZXQpO1xuXG5cdFx0XHRcdFx0XHQvLyBlbmQgY3VycmVudCBiYWNrcmVmZXJlbmNlIGFuZCBzdGFydCBuZXcgYmFja3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbmV3X29mZnNldCA9IDE7IG5ld19vZmZzZXQgPD0gTWF0aC5taW4oOSwgaSk7ICsrbmV3X29mZnNldCkge1xuXHRcdFx0XHRcdFx0XHRpZiAocGxhaW5baSAtIG5ld19vZmZzZXRdID09PSBjKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0KG5ld19zdGF0ZSwgbmV3X29mZnNldCwgMSwgc3RyaW5nICsgbGVuZ3RoICsgb2Zmc2V0ICsgXCIwXCIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdG1wX3N0YXRlID0gbmV3X3N0YXRlO1xuXHRcdFx0XHRuZXdfc3RhdGUgPSBjdXJfc3RhdGU7XG5cdFx0XHRcdGN1cl9zdGF0ZSA9IHRtcF9zdGF0ZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdGZvciAobGV0IGxlbiA9IDE7IGxlbiA8PSA5OyArK2xlbikge1xuXHRcdFx0XHRsZXQgc3RyaW5nID0gY3VyX3N0YXRlWzBdW2xlbl07XG5cdFx0XHRcdGlmIChzdHJpbmcgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3RyaW5nICs9IGxlbiArIHBsYWluLnN1YnN0cmluZyhwbGFpbi5sZW5ndGggLSBsZW4sIHBsYWluLmxlbmd0aCk7XG5cdFx0XHRcdGlmIChyZXN1bHQgPT0gbnVsbCB8fCBzdHJpbmcubGVuZ3RoIDwgcmVzdWx0Lmxlbmd0aCkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IHN0cmluZztcblx0XHRcdFx0fSBlbHNlIGlmIChzdHJpbmcubGVuZ3RoID09IHJlc3VsdC5sZW5ndGggJiYgTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IHN0cmluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBvZmZzZXQgPSAxOyBvZmZzZXQgPD0gOTsgKytvZmZzZXQpIHtcblx0XHRcdFx0Zm9yIChsZXQgbGVuID0gMTsgbGVuIDw9IDk7ICsrbGVuKSB7XG5cdFx0XHRcdFx0bGV0IHN0cmluZyA9IGN1cl9zdGF0ZVtvZmZzZXRdW2xlbl07XG5cdFx0XHRcdFx0aWYgKHN0cmluZyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzdHJpbmcgKz0gbGVuICsgXCJcIiArIG9mZnNldDtcblx0XHRcdFx0XHRpZiAocmVzdWx0ID09IG51bGwgfHwgc3RyaW5nLmxlbmd0aCA8IHJlc3VsdC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHN0cmluZztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0cmluZy5sZW5ndGggPT0gcmVzdWx0Lmxlbmd0aCAmJiBNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBzdHJpbmc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQgPz8gXCJcIjtcblx0XHR9XG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnRW5jcnlwdGlvbiBJOiBDYWVzYXIgQ2lwaGVyJyxcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHQvLyBkYXRhID0gW3BsYWludGV4dCwgc2hpZnQgdmFsdWVdXG5cdFx0XHQvLyBidWlsZCBjaGFyIGFycmF5LCBzaGlmdGluZyB2aWEgbWFwIGFuZCBqb2luIHRvIGZpbmFsIHJlc3VsdHNcblx0XHRcdGNvbnN0IGNpcGhlciA9IFsuLi5kYXRhWzBdXVxuXHRcdFx0XHQubWFwKChhKSA9PiAoYSA9PT0gXCIgXCIgPyBhIDogU3RyaW5nLmZyb21DaGFyQ29kZSgoKGEuY2hhckNvZGVBdCgwKSAtIDY1IC0gZGF0YVsxXSArIDI2KSAlIDI2KSArIDY1KSkpXG5cdFx0XHRcdC5qb2luKFwiXCIpO1xuXHRcdFx0cmV0dXJuIGNpcGhlcjtcblx0XHR9XG5cdH0sXG5cdHtcblx0XHRuYW1lOiBcIkVuY3J5cHRpb24gSUk6IFZpZ2Vuw6hyZSBDaXBoZXJcIixcblx0XHRzb2x2ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHQvLyBkYXRhID0gW3BsYWludGV4dCwga2V5d29yZF1cblx0XHRcdC8vIGJ1aWxkIGNoYXIgYXJyYXksIHNoaWZ0aW5nIHZpYSBtYXAgYW5kIGNvcnJlc3BvbmRpbmcga2V5d29yZCBsZXR0ZXIgYW5kIGpvaW4gdG8gZmluYWwgcmVzdWx0c1xuXHRcdFx0Y29uc3QgY2lwaGVyID0gWy4uLmRhdGFbMF1dXG5cdFx0XHRcdC5tYXAoKGEsIGkpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gYSA9PT0gXCIgXCJcblx0XHRcdFx0XHRcdD8gYVxuXHRcdFx0XHRcdFx0OiBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYS5jaGFyQ29kZUF0KDApIC0gMiAqIDY1ICsgZGF0YVsxXS5jaGFyQ29kZUF0KGkgJSBkYXRhWzFdLmxlbmd0aCkpICUgMjYpICsgNjUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuam9pbihcIlwiKTtcblx0XHRcdHJldHVybiBjaXBoZXI7XG5cdFx0fVxuXHR9XTtcblxuXHQvLyBGdW5jdGlvbnNcblx0ZnVuY3Rpb24gY29udmVydDJEQXJyYXlUb1N0cmluZyhhcnIpIHtcblx0XHRjb25zdCBjb21wb25lbnRzID0gW11cblx0XHRhcnIuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuXHRcdFx0bGV0IHMgPSBlLnRvU3RyaW5nKClcblx0XHRcdHMgPSBbJ1snLCBzLCAnXSddLmpvaW4oJycpXG5cdFx0XHRjb21wb25lbnRzLnB1c2gocylcblx0XHR9KVxuXHRcdHJldHVybiBjb21wb25lbnRzLmpvaW4oJywnKS5yZXBsYWNlKC9cXHMvZywgJycpXG5cdH07XG5cblx0ZnVuY3Rpb24gZ2V0U29sdXRpb24oY29udHJhY3QpIHtcblx0XHRjb25zdCBjb2RpbmdDb250cmFjdFNvbHV0aW9uID0gY29kaW5nQ29udHJhY3RzU29sdXRpb25zLmZpbmQoKGNvZGluZ0NvbnRyYWN0c1NvbHV0aW9ucykgPT4gY29kaW5nQ29udHJhY3RzU29sdXRpb25zLm5hbWUgPT09IGNvbnRyYWN0LnR5cGUpXG5cdFx0cmV0dXJuIGNvZGluZ0NvbnRyYWN0U29sdXRpb24gPyBjb2RpbmdDb250cmFjdFNvbHV0aW9uLnNvbHZlcihjb250cmFjdC5kYXRhKSA6IFwiVW5zb2x2YWJsZVwiO1xuXHR9O1xuXG5cdC8vIE1haW5cblx0Y29udHJhY3Quc29sdXRpb24gPSBnZXRTb2x1dGlvbihjb250cmFjdCk7XG5cblx0bnMucHJpbnQoXCJUeXBlOiBcIiArIGNvbnRyYWN0LnR5cGUpO1xuXHRucy5wcmludChcIlNlcnZlcjogXCIgKyBjb250cmFjdC5zZXJ2ZXIpO1xuXHRucy5wcmludChcIkFuc3dlcjogXCIgKyAoY29udHJhY3Quc29sdXRpb24ubGVuZ3RoID4gNTAgPyBTdHJpbmcoY29udHJhY3Quc29sdXRpb24pLnN1YnN0cmluZygwLCA1MCkgKyBcIi4uLlwiIDogY29udHJhY3Quc29sdXRpb24pKTtcblxuXHRpZiAoY29udHJhY3Quc29sdXRpb24gIT0gXCJVbnNvbHZhYmxlXCIpIHtcblx0XHRjb250cmFjdC5yZXN1bHQgPSBucy5jb2Rpbmdjb250cmFjdC5hdHRlbXB0KGNvbnRyYWN0LnNvbHV0aW9uLCBjb250cmFjdC5maWxlTmFtZSwgY29udHJhY3Quc2VydmVyLCB7IHJldHVyblJld2FyZDogdHJ1ZSB9KTtcblx0XHRucy5wcmludChcIlJlc3VsdDogXCIgKyBjb250cmFjdC5yZXN1bHQpO1xuXHR9XG5cblx0bnMucHJpbnQoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG5cdGF3YWl0IG5zLnNsZWVwKDUwMDApO1xufSJdfQ==