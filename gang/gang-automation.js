import { TextTransforms } from "/gang/text-transform.js";
/** @param {NS} ns */
export async function main(ns) {
    /*
    General gang action plan:
        Gain Respect
            -> 12 members
                -> power
                    -> all win chances > 55%
                        -> if engage in territory warfare is on
                            -> power/money (keep win chances > 55%)
                                -> territory 100%
                                    -> gain money/rep
    ---------------------------------------------------------------
        OVERRIDE PARAM
        (Forces all members to perform a singular task.)
        No [args] = normal operation.
        
        NORMAL USAGE: run gang-automation.js        // Script will use stats to determine tasks, equipment purchases (prepping), and ascending.
        
        Optional OVERRIDE parameters are:
         • respect
         • earn
         • decrease
         • charisma
         • hacking
         • combat
         • warfare
         
         (Only one override arg can be passed in.)
         
         USAGE: run gang-automation.js respect      // Script will assign tasks that earn you respect | Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
                run gang-automation.js earn         // Script will assign tasks that earn you top $money | Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
                run gang-automation.js decrease     // Script will assign tasks to lower your wanted level | Ethical Hacking, Vigilante Justice
                run gang-automation.js charisma     // Script will assign 'Train Charisma'
                run gang-automation.js hacking      // Script will assign 'Train Hacking'
                run gang-automation.js combat       // Script will assign 'Train Combat'
                run gang-automation.js warfare      // Script will assing your gang to Territory Warfare
    */
    const [override] = ns.args;
    var overrideTask = "";
    if (override == undefined || override.trim() == "") {
        overrideTask = ""; // ignore
    }
    else if (override == "respect") {
        overrideTask = "Cyberterrorism"; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
    }
    else if (override == "earn") {
        overrideTask = "Money Laundering"; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
    }
    else if (override == "decrease") {
        overrideTask = "Ethical Hacking"; // Ethical Hacking, Vigilante Justice  
    }
    else if (override == "charisma") {
        overrideTask = "Train Charisma"; // Train Combat, Train Hacking, Train Charisma
    }
    else if (override == "hacking") {
        overrideTask = "Train Hacking"; // Train Combat, Train Hacking, Train Charisma
    }
    else if (override == "combat") {
        overrideTask = "Train Combat"; // Train Combat, Train Hacking, Train Charisma
    }
    else if (override == "warfare") {
        overrideTask = "Territory Warfare"; // Territory Warfare
    }
    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();
    const buyingWeapons = true;
    const buyingArmor = true;
    const buyingVehicles = true;
    const buyingRootkits = true;
    const buyingAugmentations = true;
    const memberHackAugs = [];
    const memberCrimeAugs = [];
    const memberWeapons = [];
    const memberVehicles = [];
    const memberArmor = [];
    const memberRootkits = [];
    const memberPrepped = [];
    const membersAscended = [];
    const memberStats = [];
    const delay = 100;
    const HackAugs = ["DataJack", "Neuralstimulator", "BitWire"];
    const CrimeAugs = ["Bionic Spine", "Bionic Arms", "Bionic Legs", "Graphene Bone Lacings", "Synthetic Heart", "BrachiBlades", "Nanofiber Weave", "Synfibril Muscle"];
    const Weapons = ["Baseball Bat", "Katana", "Glock 18C", "P90C", "Steyr AUG", "AK-47", "M15A10 Assault Rifle", "AWM Sniper Rifle"];
    const Armor = ["Liquid Body Armor", "Bulletproof Vest", "Full Body Armor", "Graphene Plating Armor"];
    const Vehicles = ["Ford Flex V20", "White Ferrari", "ATX1070 Superbike", "Mercedes-Benz S9001"];
    const Rootkits = ["NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper"];
    const MemberNames = ["Genie", "Myconid", "Ogre", "Pixie", "Treant", "Troglodyte", "Loco", "Puppet", "Stretch", "Eternity", "Zen", "Cable"];
    /*
        https://www.fantasynamegenerators.com/cyberpunk-names.php
    */
    var topEarners = []; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
    var topRespect = []; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
    var topVirtuous = []; // Ethical Hacking, Vigilante Justice  
    var training = []; // Train Combat, Train Hacking, Train Charisma
    var warfare = []; // Territory Warfare
    var idle = []; // Unassigned
    var tasks = ns.gang.getTaskNames(); // Get the name of all valid tasks that can be assigned.
    // loop through all valid tasks.
    for (var i = 0; i < tasks.length; ++i) {
        // TOP EARNERS
        if (tasks[i].toString() == "Ransomware" ||
            tasks[i].toString() == "Phishing" ||
            tasks[i].toString() == "Identity Theft" ||
            tasks[i].toString() == "Fraud & Counterfeiting" ||
            tasks[i].toString() == "Money Laundering") {
            topEarners.push(tasks[i]);
            // TOP RESPECT
        }
        else if (tasks[i].toString() == "Cyberterrorism" ||
            tasks[i].toString() == "DDoS Attacks" ||
            tasks[i].toString() == "Plant Virus" ||
            tasks[i].toString() == "Money Laundering") {
            topRespect.push(tasks[i]);
            // TOP VIRTUOUS
        }
        else if (tasks[i].toString() == "Ethical Hacking" ||
            tasks[i].toString() == "Vigilante Justice") {
            topVirtuous.push(tasks[i]);
            // TRAINING
        }
        else if (tasks[i].toString() == "Train Combat" ||
            tasks[i].toString() == "Train Hacking" ||
            tasks[i].toString() == "Train Charisma" ||
            tasks[i].toString() == "Train Warfare") {
            training.push(tasks[i]);
            // WARFARE
        }
        else if (tasks[i].toString() == "Territory Warfare") {
            warfare.push(tasks[i]);
            // UNASSIGNED
        }
        else if (tasks[i].toString() == "Unassigned") {
            idle.push(tasks[i]);
        }
    }
    // Engine
    while (true) {
        ns.clearLog();
        var money = ns.getServerMoneyAvailable("home");
        const gangInfo = ns.gang.getGangInformation();
        const gangIncome = ns.gang.getGangInformation().moneyGainRate * 5; // A tick is every 200ms. To get the actual money/sec, multiple moneyGainRate by 5.
        const gangRespect = parseFloat(ns.gang.getGangInformation().respect).toFixed(2);
        ns.print(" \n");
        ns.print(" 🌆 Gang: " + TextTransforms.apply(gangInfo.faction, [TextTransforms.Color.Orange]) + " 💣");
        ns.print(" 🏦 Money available: 💲" + TextTransforms.apply(FormatNumber(money), [TextTransforms.Color.LGreen]));
        ns.print(" 💵 Gang income/sec: 💲" + TextTransforms.apply(FormatNumber(gangIncome), [TextTransforms.Color.LGreen]));
        ns.print(" 🦾 Gang respect: " + TextTransforms.apply(gangRespect, [TextTransforms.Color.LPurple]));
        var members = ns.gang.getMemberNames();
        var prospects = MemberNames.filter(c => !members.includes(c));
        // FULL MEMBERS
        ns.print("\n" + " 😈 Current Members:" + "\n");
        var activeteam = members.join(", "); // Suggested by u/Aeraggo, 2-23-2023
        ns.print("    " + TextTransforms.apply(activeteam, [TextTransforms.Color.ChartsBlue]) + "\n");
        // PROSPECTS
        ns.print("\n" + " 😐 Prospects:" + "\n");
        var waitteam = ""; // reset
        waitteam = prospects.join(", "); // Suggested by u/Aeraggo, 2-23-2023
        if (waitteam.length == 0) {
            ns.print("    Your gang is maxed out. Good job! Now go do some crime.\n");
        }
        else {
            ns.print("    " + TextTransforms.apply(waitteam, [TextTransforms.Color.LPurple]) + "\n");
        }
        // RECRUIT
        if (ns.gang.canRecruitMember()) {
            ns.print("\n" + " Recruiting new prospect..." + "\n");
            await RecruitProspect();
        }
        else {
        }
        // GET ALL HACK SKILL LEVELS. Sort members from highest to lowest Hack().
        const skillSort = members.sort((b, a) => ns.gang.getMemberInformation(a).hack - ns.gang.getMemberInformation(b).hack);
        // SHOW STATS
        ns.print("\n" + " ✨ Members sorted by Hack Skill Level:");
        for (var i = 0; i < skillSort.length; ++i) {
            var level = ns.gang.getMemberInformation(skillSort[i]).hack;
            //ns.print("   " + "💻 " + skillSort[i] + ", Hack skill level: " + level + "");
            memberStats.push(skillSort[i] + "|" + level);
            // ASSIGN JOBS
            GiveAssignments(skillSort[i], level);
        }
        // MEMBER STATS        
        let memberDataObj = {}; // Initialize empty object to store data
        let memberData = []; // Initialize empty array to store final data
        let longest0 = 0;
        let longest1 = 0;
        let longest2 = 0;
        let longest3 = 0;
        let longest4 = 0;
        // Loop through each record in _memberStats array
        for (let i = 0; i < memberStats.length; i++) {
            let retval = memberStats[i] + ''; // Split each record into name and stat using the pipe symbol
            let record = retval.split("|");
            let name = record[0];
            let stat = record[1];
            // Check if name already exists in memberDataObj
            if (memberDataObj.hasOwnProperty(name)) {
                memberDataObj[name] += "|" + stat; // If it exists, concatenate the stat with existing data
            }
            else {
                memberDataObj[name] = name + "|" + stat; // If it doesn't exist, create a new entry for the name in memberDataObj
            }
        }
        // Loop through memberDataObj and add each entry to memberData array
        for (let name in memberDataObj) {
            memberData.push(memberDataObj[name]);
        }
        // Loop through to format
        memberData.forEach((e) => {
            var data = e + '';
            var splitStr = data.split("|");
            var name = splitStr[0];
            var hacklevel = splitStr[1];
            var wantedlevel = splitStr[2];
            var respect = splitStr[3];
            var task = splitStr[4];
            longest0 = Math.max(name.length, longest0);
            longest1 = Math.max(hacklevel.length, longest1);
            longest2 = Math.max(wantedlevel.length, longest2);
            longest3 = Math.max(respect.length, longest3);
            longest4 = Math.max(task.length, longest4);
        });
        // Show it.
        memberData.forEach((e) => {
            var data = e + '';
            var splitStr = data.split("|");
            var name = splitStr[0];
            var hacklevel = splitStr[1];
            var wantedlevel = splitStr[2];
            var respect = splitStr[3];
            var task = splitStr[4];
            var num0 = parseFloat(wantedlevel).toFixed(4);
            var num1 = parseFloat(respect).toFixed(2);
            ns.print(TextTransforms.apply(name.padStart(longest0 + 1), [TextTransforms.Color.ChartsBlue])
                + ", 💻hack: " + TextTransforms.apply(hacklevel.padStart(longest1 + 1), [TextTransforms.Color.ChartsGreen])
                + ", 🕶️wanted: " + TextTransforms.apply(num0.padStart(9), [TextTransforms.Color.ChartsGreen])
                + ", 🦾respect: " + TextTransforms.apply(num1.padStart(9), [TextTransforms.Color.ChartsGreen])
                + ", 💵task: " + TextTransforms.apply(task.padStart(longest4 + 1), [TextTransforms.Color.ChartsGreen])
                + " \n");
        });
        // ASCEND & PREP
        let longest = 0;
        let _members = members;
        for (let _member of _members) {
            longest = Math.max(_member.length, longest);
        }
        ;
        ns.print("\n" + " ⬆ Ascension✨ & Prep🔪💣🛡️ stats: " + "\n");
        var lbracket = TextTransforms.apply("[", [TextTransforms.Color.ChartsGray]);
        var rbracket = TextTransforms.apply("]", [TextTransforms.Color.ChartsGray]);
        for (let _mem of _members) {
            var prepping = "";
            var output = "";
            var member_name = "" + TextTransforms.apply(_mem.padStart(longest + 1), [TextTransforms.Color.ChartsBlue]) + "";
            var numTimesAscended = await NumberOfTimesAscended(membersAscended, _mem);
            // PREP
            if (memberPrepped.includes(_mem.trim())) {
                // ALREADY PREPPED OUT
                prepping = " " + lbracket + TextTransforms.apply("Fully Prepped 🔪💣🛡️", [TextTransforms.Color.ChartsGreen]) + rbracket + "";
            }
            else {
                // PREP MEMBER        
                prepping = " " + lbracket + TextTransforms.apply("✨Prepping✨", [TextTransforms.Color.ChartsGray]) + rbracket + "";
                Prepare(_mem);
            }
            // ASCEND            
            try {
                var memberInfo = ns.gang.getMemberInformation(_mem); // Get entire gang meber onject from name.
                var ascResult = ns.gang.getAscensionResult(_mem); // Get the result of an ascension without ascending.
                if (ascResult != undefined) {
                    // CREDIT: Yobikir
                    // https://github.com/RKDE1988/Bitburner/blob/main/Gang/Manager.js
                    let next_Mult;
                    let current_Mult;
                    let next_Point = ns.formulas.gang.ascensionPointsGain(memberInfo.hack_exp);
                    next_Mult = ns.formulas.gang.ascensionMultiplier(memberInfo.hack_asc_points + next_Point);
                    current_Mult = memberInfo.hack_asc_mult;
                    let nxtmutlp_div_by_currentmultp = (next_Mult / current_Mult);
                    let calculated_asc_threshold = CalculateAscendTreshold(current_Mult);
                    var doAsc = false;
                    if ((next_Mult / current_Mult) >= CalculateAscendTreshold(current_Mult)) {
                        // Give message to ascend.
                        output = "times_asc: " + numTimesAscended + " " + lbracket + TextTransforms.apply("✨Ascending✨", [TextTransforms.Color.ChartsGreen]) + rbracket + " " + nxtmutlp_div_by_currentmultp + " >= " + calculated_asc_threshold + " (" + TextTransforms.apply("nxt_mltp: ", [TextTransforms.Color.ChartsGray]) + ns.formatNumber(next_Mult, "0.000a") + ")";
                        doAsc = true;
                    }
                    else {
                        // Do nothing.
                        output = "times_asc: " + numTimesAscended + " " + lbracket + TextTransforms.apply("Working", [TextTransforms.Color.ChartsGray]) + rbracket + " " + nxtmutlp_div_by_currentmultp + " < " + calculated_asc_threshold + " (" + TextTransforms.apply("nxt_mltp: ", [TextTransforms.Color.ChartsGray]) + ns.formatNumber(next_Mult, "0.000a") + ")";
                    }
                    ns.print(member_name + ", " + output + " " + prepping + " \n");
                    /*
                        ASCEND
                        ------
                        Doing Ascend(_mem) here, because there is a glitch that prevents
                        the output string from displaying when Ascend(_mem)
                        is lumped into the 'else if (multchange >= 2.0){ ... }' conditional area.
                    */
                    if (doAsc) {
                        await ns.sleep(5);
                        Ascend(_mem); // ascend the member
                        membersAscended.push(_mem); // let this grow.
                    }
                }
            }
            catch {
                // ignore.                        
            }
        }
        // RESET ENVIRONMNENT
        memberDataObj = {};
        memberStats.length = 0;
        ns.print(" \n");
        await ns.sleep(delay);
    }
    // Credit: Mysteyes. https://discord.com/channels/415207508303544321/415207923506216971/940379724214075442
    function CalculateAscendTreshold(mult) {
        if (mult < 1.632)
            return 1.6326;
        else if (mult < 2.336)
            return 1.4315;
        else if (mult < 2.999)
            return 1.284;
        else if (mult < 3.363)
            return 1.2125;
        else if (mult < 4.253)
            return 1.1698;
        else if (mult < 4.860)
            return 1.1428;
        else if (mult < 5.455)
            return 1.1225;
        else if (mult < 5.977)
            return 1.0957;
        else if (mult < 6.496)
            return 1.0869;
        else if (mult < 7.008)
            return 1.0789;
        else if (mult < 7.519)
            return 1.073;
        else if (mult < 8.025)
            return 1.0673;
        else if (mult < 8.513)
            return 1.0631;
        else
            return 1.0591;
    }
    function NumberOfTimesAscended(membersAscended, name) {
        var timesAscended = 0;
        for (var i = 0; i < membersAscended.length; i++) {
            if (membersAscended[i] == name) {
                timesAscended++;
            }
        }
        return timesAscended;
    }
    // Recruit a new prospect to a full gang member.
    async function RecruitProspect() {
        var currentMembers = ns.gang.getMemberNames();
        var availableNames = MemberNames.filter(x => !currentMembers.includes(x));
        ns.gang.recruitMember(availableNames[0]);
        ns.gang.setMemberTask(availableNames[0], "Train Hacking"); // Set to train initially.
        await ns.sleep(10);
    }
    // Ascend this current gang member
    async function Ascend(name) {
        return ns.gang.ascendMember(name); // Ascend the specified Gang Member.       
    }
    // Buy HackTools, HackAugs, CrimeAugs, Weapons, Armor, Vehicles
    function Prepare(name) {
        if (memberPrepped.includes(name)) {
            // get out. This gang member has everything.
            return;
        }
        HackAugs.forEach((e) => {
            let cost = ns.formatNumber(ns.gang.getEquipmentCost(e), "0.000a");
            let type = ns.gang.getEquipmentType(e);
            // ["DataJack", "Neuralstimulator", "BitWire"];
            if (memberHackAugs == null) {
                // buy first item
                if (buyingAugmentations && (ns.getServerMoneyAvailable('home') > cost)) {
                    memberHackAugs.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
            else if (!memberHackAugs.includes(name + "|" + e)) {
                // buy new item
                if (buyingAugmentations) {
                    memberHackAugs.push(name + "|" + e);
                    ns.print("   (" + name + ") buying : '" + e + "' for $" + cost);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
        });
        CrimeAugs.forEach((e) => {
            let cost = ns.formatNumber(ns.gang.getEquipmentCost(e), "0.000a");
            let type = ns.gang.getEquipmentType(e);
            // ["Bionic Spine", "Bionic Arms", "Bionic Legs", "Graphene Bone Lacings", "Synthetic Heart", "BrachiBlades", "Nanofiber Weave", "Synfibril Muscle"];
            if (memberCrimeAugs == null) {
                // buy first item
                if (buyingAugmentations && (ns.getServerMoneyAvailable('home') > cost)) {
                    memberCrimeAugs.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
            else if (!memberCrimeAugs.includes(name + "|" + e)) {
                // buy new item
                if (buyingAugmentations) {
                    memberCrimeAugs.push(name + "|" + e);
                    ns.print("   (" + name + ") buying : '" + e + "' for $" + cost);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
        });
        Weapons.forEach((e) => {
            let cost = ns.formatNumber(ns.gang.getEquipmentCost(e), "0.000a");
            let type = ns.gang.getEquipmentType(e);
            // ["Baseball Bat", "Katana", "Glock 18C", "P90C", "Steyr AUG", "AK-47", "M15A10 Assault Rifle", "AWM Sniper Rifle"];
            if (memberWeapons == null) {
                // buy first item
                if (buyingWeapons && (ns.getServerMoneyAvailable('home') > cost)) {
                    memberWeapons.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
            else if (!memberWeapons.includes(name + "|" + e)) {
                // buy new item
                if (buyingWeapons) {
                    memberWeapons.push(name + "|" + e);
                    ns.print("   (" + name + ") buying : '" + e + "' for $" + cost);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
        });
        Armor.forEach((e) => {
            let cost = ns.formatNumber(ns.gang.getEquipmentCost(e), "0.000a");
            let type = ns.gang.getEquipmentType(e);
            // ["Liquid Body Armor", "Bulletproof Vest", "Full Body Armor", "Graphene Plating Armor"];
            if (memberArmor == null) {
                // buy first item
                if (buyingArmor && (ns.getServerMoneyAvailable('home') > cost)) {
                    memberArmor.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
            else if (!memberArmor.includes(name + "|" + e)) {
                // buy new item
                if (buyingArmor) {
                    memberArmor.push(name + "|" + e);
                    ns.print("   (" + name + ") buying : '" + e + "' for $" + cost);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
        });
        Vehicles.forEach((e) => {
            let cost = ns.formatNumber(ns.gang.getEquipmentCost(e), "0.000a");
            let type = ns.gang.getEquipmentType(e);
            // ["Ford Flex V20", "White Ferrari", "ATX1070 Superbike", "Mercedes-Benz S9001"];
            if (memberVehicles == null) {
                // buy first item
                if (buyingVehicles && (ns.getServerMoneyAvailable('home') > cost)) {
                    memberVehicles.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
            else if (!memberVehicles.includes(name + "|" + e)) {
                // buy new item
                if (buyingVehicles) {
                    memberVehicles.push(name + "|" + e);
                    ns.print("   (" + name + ") buying : '" + e + "' for $" + cost);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
        });
        Rootkits.forEach((e) => {
            let cost = ns.formatNumber(ns.gang.getEquipmentCost(e), "0.000a");
            let type = ns.gang.getEquipmentType(e);
            // "NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper"];
            if (memberRootkits == null) {
                // buy first item
                if (buyingRootkits && (ns.getServerMoneyAvailable('home') > cost)) {
                    memberRootkits.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
            else if (!memberRootkits.includes(name + "|" + e)) {
                // buy new item
                if (buyingRootkits) {
                    memberRootkits.push(name + "|" + e);
                    ns.print("   (" + name + ") buying : '" + e + "' for $" + cost);
                    ns.gang.purchaseEquipment(name, e);
                }
            }
        });
        // SHOW INVENTORY
        var memberHackAugsCount = 0;
        var memberCrimeAugsCount = 0;
        var memberWeaponsCount = 0;
        var memberArmorCount = 0;
        var memberVehiclesCount = 0;
        var memberRootkitsCount = 0;
        for (var i = 0; i < memberHackAugs.length; ++i) {
            if (memberHackAugs[i].toString().includes(name)) {
                memberHackAugsCount++;
            }
        }
        for (var i = 0; i < memberCrimeAugs.length; ++i) {
            if (memberCrimeAugs[i].toString().includes(name)) {
                memberCrimeAugsCount++;
            }
        }
        for (var i = 0; i < memberWeapons.length; ++i) {
            if (memberWeapons[i].toString().includes(name)) {
                memberWeaponsCount++;
            }
        }
        for (var i = 0; i < memberArmor.length; ++i) {
            if (memberArmor[i].toString().includes(name)) {
                memberArmorCount++;
            }
        }
        for (var i = 0; i < memberVehicles.length; ++i) {
            if (memberVehicles[i].toString().includes(name)) {
                memberVehiclesCount++;
            }
        }
        for (var i = 0; i < memberRootkits.length; ++i) {
            if (memberRootkits[i].toString().includes(name)) {
                memberRootkitsCount++;
            }
        }
        if (memberHackAugsCount + memberCrimeAugsCount + memberWeaponsCount + memberArmorCount + memberVehiclesCount + memberRootkitsCount == 32) {
            memberPrepped.push(name); // Add member to list of completed prepped names.
        }
        else {
            ns.print("   " + name + " [equipment/augs: "
                + memberHackAugsCount + " | "
                + memberCrimeAugsCount + " | "
                + memberWeaponsCount + " | "
                + memberArmorCount + " | "
                + memberVehiclesCount + " | "
                + memberRootkitsCount + "]");
        }
    }
    // Attempt to assign Gang Member specified tasks
    function GiveAssignments(member, hackSkillLevel) {
        // hackSkillLevel is just 'memberInfo.hacking' passed in.
        var gangInfo = null;
        var gangInfo = ns.gang.getGangInformation();
        var memberInfo = null;
        var memberInfo = ns.gang.getMemberInformation(member);
        var wantedLevel = memberInfo.wantedLevelGain;
        var earnedRespect = memberInfo.earnedRespect;
        // GET STATS
        memberStats.push(member + "|" + wantedLevel);
        memberStats.push(member + "|" + earnedRespect);
        // HACKING
        var task = "";
        // var statsTarget = 50; // strength, agility, charisma, defense
        // var statsTargetHacking = 500; // hacking
        // var statsTargetRespect = 10000; // respect
        if (overrideTask != "") {
            task = overrideTask; // GRAB OVERRIDE TASK
            // Territory Warfare!
            if (overrideTask == "Territory Warfare" && earnedRespect > 10000) {
                // ASSIGN TASK
                if (ns.gang.setMemberTask(member, task)) {
                    memberStats.push(member + "|" + task);
                    return; // GET OUT.
                }
                // NOT POWERFUL ENOUGH FOR WARFARE. SO, IGNORE 'Territory Warfare', DO SEOMTHING ELSE...             
            }
            else if (overrideTask == "Territory Warfare" && earnedRespect < 10000) {
                // THIS IS NON-NEGOTIABLE. IF HACK LEVEL IS < 500, WE REQUIRE STRICT TRAINING. 
                // IGNORE ALL OTHER JOBS/TASKS.
                // TRAIN
                if (hackSkillLevel < 400 && earnedRespect < 500) {
                    // Are we a Hacking gang? 
                    // TRAIN HACKING
                    if (gangInfo.isHacking) {
                        task = training[1]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                    }
                    // Are we a Combat gang? 
                    // TRAIN COMBAT
                    if (!gangInfo.isHacking) {
                        task = training[0]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                    }
                    // ASSIGN TRAINING task
                    if (ns.gang.setMemberTask(member, task)) {
                        memberStats.push(member + "|" + task);
                        return; // GET OUT.
                    }
                    // DON'T TRAIN. TOO EXPERIENCED.
                }
                else if (wantedLevel >= 100) {
                    // DECREASE WANTED LEVEL
                    task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
                }
                else if (earnedRespect < 1000) {
                    // BUILD RESPECT
                    task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
                }
                else {
                    // EARN MONEY				
                    task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
                }
                // ASSIGN NON-TRAINING TASK
                if (ns.gang.setMemberTask(member, task)) {
                    memberStats.push(member + "|" + task);
                    return; // GET OUT.
                }
            }
            else if (overrideTask != "Territory Warfare") {
                // TYPE
                if (override == "respect") {
                    task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
                }
                else if (override == "earn") {
                    task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
                }
                else if (override == "decrease") {
                    task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
                }
                else if (override == "charisma") {
                    task = task = training[2]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                }
                else if (override == "hacking") {
                    task = task = training[1]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                }
                else if (override == "combat") {
                    task = task = training[0]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                }
                // ASSIGN TASK
                if (ns.gang.setMemberTask(member, task)) {
                    memberStats.push(member + "|" + task);
                    return; // GET OUT.
                }
            }
        }
        // THIS IS NON-NEGOTIABLE. IF HACK LEVEL IS < 500, WE REQUIRE STRICT TRAINING. 
        // IGNORE ALL OTHER JOBS/TASKS.
        // TRAIN
        if (hackSkillLevel < 400 && earnedRespect < 500) {
            // Are we a Hacking gang? 
            // TRAIN HACKING
            if (gangInfo.isHacking) {
                task = training[1]; // Train Combat 0, Train Hacking 1, Train Charisma 2
            }
            // Are we a Combat gang? 
            // TRAIN COMBAT
            if (!gangInfo.isHacking) {
                task = training[0]; // Train Combat 0, Train Hacking 1, Train Charisma 2
            }
            // ASSIGN TRAINING task
            if (ns.gang.setMemberTask(member, task)) {
                memberStats.push(member + "|" + task);
                return; // GET OUT.
            }
        }
        else if (wantedLevel >= 100) {
            // DECREASE WANTED LEVEL
            task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
        }
        else if (earnedRespect < 1000) {
            // BUILD RESPECT
            task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
        }
        else if (earnedRespect > 1000) {
            // EARN MONEY				
            task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
        }
        // ASSIGN NON-TRAINING TASK
        if (ns.gang.setMemberTask(member, task)) {
            memberStats.push(member + "|" + task);
        }
        else {
            ns.print("   unable to assign " + member + " with " + task + "\n");
        }
    }
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    function FormatNumber(num) {
        let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
        let i = 0;
        for (; (num >= 1000) && (i < symbols.length); i++)
            num /= 1000;
        return ((Math.sign(num) < 0) ? "-$" : "$") + num.toFixed(3) + symbols[i];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FuZy1hdXRvbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dhbmcvZ2FuZy1hdXRvbWF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxjQUFjLEVBQ2pCLE1BQU0seUJBQXlCLENBQUM7QUFFakMscUJBQXFCO0FBQ3JCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQUU7SUFFekI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BbUNFO0lBRUYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDM0IsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXRCLElBQUksUUFBUSxJQUFJLFNBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ2hELFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0tBRS9CO1NBQU0sSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO1FBQzlCLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLDhEQUE4RDtLQUVsRztTQUFNLElBQUksUUFBUSxJQUFJLE1BQU0sRUFBRTtRQUMzQixZQUFZLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxpRkFBaUY7S0FFdkg7U0FBTSxJQUFJLFFBQVEsSUFBSSxVQUFVLEVBQUU7UUFDL0IsWUFBWSxHQUFHLGlCQUFpQixDQUFDLENBQUMsdUNBQXVDO0tBRTVFO1NBQU0sSUFBSSxRQUFRLElBQUksVUFBVSxFQUFFO1FBQy9CLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLDhDQUE4QztLQUVsRjtTQUFNLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtRQUM5QixZQUFZLEdBQUcsZUFBZSxDQUFDLENBQUMsOENBQThDO0tBRWpGO1NBQU0sSUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO1FBQzdCLFlBQVksR0FBRyxjQUFjLENBQUMsQ0FBQyw4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QU8sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUFFLEdBQUcsSUFBSSxJQUFJLENBQUM7UUFFL0QsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0FBRUwsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgVGV4dFRyYW5zZm9ybXNcbn0gZnJvbSBcIi9nYW5nL3RleHQtdHJhbnNmb3JtLmpzXCI7XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnMpIHtcblxuICAgIC8qICAgIFxuICAgIEdlbmVyYWwgZ2FuZyBhY3Rpb24gcGxhbjogXG4gICAgICAgIEdhaW4gUmVzcGVjdCBcbiAgICAgICAgICAgIC0+IDEyIG1lbWJlcnMgXG4gICAgICAgICAgICAgICAgLT4gcG93ZXIgXG4gICAgICAgICAgICAgICAgICAgIC0+IGFsbCB3aW4gY2hhbmNlcyA+IDU1JSBcbiAgICAgICAgICAgICAgICAgICAgICAgIC0+IGlmIGVuZ2FnZSBpbiB0ZXJyaXRvcnkgd2FyZmFyZSBpcyBvbiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtPiBwb3dlci9tb25leSAoa2VlcCB3aW4gY2hhbmNlcyA+IDU1JSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0+IHRlcnJpdG9yeSAxMDAlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLT4gZ2FpbiBtb25leS9yZXBcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgT1ZFUlJJREUgUEFSQU0gXG4gICAgICAgIChGb3JjZXMgYWxsIG1lbWJlcnMgdG8gcGVyZm9ybSBhIHNpbmd1bGFyIHRhc2suKVxuICAgICAgICBObyBbYXJnc10gPSBub3JtYWwgb3BlcmF0aW9uLlxuICAgICAgICBcbiAgICAgICAgTk9STUFMIFVTQUdFOiBydW4gZ2FuZy1hdXRvbWF0aW9uLmpzICAgICAgICAvLyBTY3JpcHQgd2lsbCB1c2Ugc3RhdHMgdG8gZGV0ZXJtaW5lIHRhc2tzLCBlcXVpcG1lbnQgcHVyY2hhc2VzIChwcmVwcGluZyksIGFuZCBhc2NlbmRpbmcuXG4gICAgICAgIFxuICAgICAgICBPcHRpb25hbCBPVkVSUklERSBwYXJhbWV0ZXJzIGFyZTogICAgICAgIFxuICAgICAgICAg4oCiIHJlc3BlY3RcbiAgICAgICAgIOKAoiBlYXJuXG4gICAgICAgICDigKIgZGVjcmVhc2VcbiAgICAgICAgIOKAoiBjaGFyaXNtYVxuICAgICAgICAg4oCiIGhhY2tpbmdcbiAgICAgICAgIOKAoiBjb21iYXRcbiAgICAgICAgIOKAoiB3YXJmYXJlXG4gICAgICAgICBcbiAgICAgICAgIChPbmx5IG9uZSBvdmVycmlkZSBhcmcgY2FuIGJlIHBhc3NlZCBpbi4pXG4gICAgICAgICBcbiAgICAgICAgIFVTQUdFOiBydW4gZ2FuZy1hdXRvbWF0aW9uLmpzIHJlc3BlY3QgICAgICAvLyBTY3JpcHQgd2lsbCBhc3NpZ24gdGFza3MgdGhhdCBlYXJuIHlvdSByZXNwZWN0IHwgQ3liZXJ0ZXJyb3Jpc20sIEREb1MgQXR0YWNrcywgUGxhbnQgVmlydXMsIE1vbmV5IExhdW5kZXJpbmdcbiAgICAgICAgICAgICAgICBydW4gZ2FuZy1hdXRvbWF0aW9uLmpzIGVhcm4gICAgICAgICAvLyBTY3JpcHQgd2lsbCBhc3NpZ24gdGFza3MgdGhhdCBlYXJuIHlvdSB0b3AgJG1vbmV5IHwgUmFuc29td2FyZSwgUGhpc2hpbmcsIElkZW50aXR5IFRoZWZ0LCBGcmF1ZCAmIENvdW50ZXJmZWl0aW5nLCBNb25leSBMYXVuZGVyaW5nXG4gICAgICAgICAgICAgICAgcnVuIGdhbmctYXV0b21hdGlvbi5qcyBkZWNyZWFzZSAgICAgLy8gU2NyaXB0IHdpbGwgYXNzaWduIHRhc2tzIHRvIGxvd2VyIHlvdXIgd2FudGVkIGxldmVsIHwgRXRoaWNhbCBIYWNraW5nLCBWaWdpbGFudGUgSnVzdGljZVxuICAgICAgICAgICAgICAgIHJ1biBnYW5nLWF1dG9tYXRpb24uanMgY2hhcmlzbWEgICAgIC8vIFNjcmlwdCB3aWxsIGFzc2lnbiAnVHJhaW4gQ2hhcmlzbWEnXG4gICAgICAgICAgICAgICAgcnVuIGdhbmctYXV0b21hdGlvbi5qcyBoYWNraW5nICAgICAgLy8gU2NyaXB0IHdpbGwgYXNzaWduICdUcmFpbiBIYWNraW5nJ1xuICAgICAgICAgICAgICAgIHJ1biBnYW5nLWF1dG9tYXRpb24uanMgY29tYmF0ICAgICAgIC8vIFNjcmlwdCB3aWxsIGFzc2lnbiAnVHJhaW4gQ29tYmF0J1xuICAgICAgICAgICAgICAgIHJ1biBnYW5nLWF1dG9tYXRpb24uanMgd2FyZmFyZSAgICAgIC8vIFNjcmlwdCB3aWxsIGFzc2luZyB5b3VyIGdhbmcgdG8gVGVycml0b3J5IFdhcmZhcmVcbiAgICAqL1xuXG4gICAgY29uc3QgW292ZXJyaWRlXSA9IG5zLmFyZ3M7XG4gICAgdmFyIG92ZXJyaWRlVGFzayA9IFwiXCI7XG5cbiAgICBpZiAob3ZlcnJpZGUgPT0gdW5kZWZpbmVkIHx8IG92ZXJyaWRlLnRyaW0oKSA9PSBcIlwiKSB7XG4gICAgICAgIG92ZXJyaWRlVGFzayA9IFwiXCI7IC8vIGlnbm9yZVxuXG4gICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcInJlc3BlY3RcIikge1xuICAgICAgICBvdmVycmlkZVRhc2sgPSBcIkN5YmVydGVycm9yaXNtXCI7IC8vIEN5YmVydGVycm9yaXNtLCBERG9TIEF0dGFja3MsIFBsYW50IFZpcnVzLCBNb25leSBMYXVuZGVyaW5nXG5cbiAgICB9IGVsc2UgaWYgKG92ZXJyaWRlID09IFwiZWFyblwiKSB7XG4gICAgICAgIG92ZXJyaWRlVGFzayA9IFwiTW9uZXkgTGF1bmRlcmluZ1wiOyAvLyBSYW5zb213YXJlLCBQaGlzaGluZywgSWRlbnRpdHkgVGhlZnQsIEZyYXVkICYgQ291bnRlcmZlaXRpbmcsIE1vbmV5IExhdW5kZXJpbmdcblxuICAgIH0gZWxzZSBpZiAob3ZlcnJpZGUgPT0gXCJkZWNyZWFzZVwiKSB7XG4gICAgICAgIG92ZXJyaWRlVGFzayA9IFwiRXRoaWNhbCBIYWNraW5nXCI7IC8vIEV0aGljYWwgSGFja2luZywgVmlnaWxhbnRlIEp1c3RpY2UgIFxuXG4gICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcImNoYXJpc21hXCIpIHtcbiAgICAgICAgb3ZlcnJpZGVUYXNrID0gXCJUcmFpbiBDaGFyaXNtYVwiOyAvLyBUcmFpbiBDb21iYXQsIFRyYWluIEhhY2tpbmcsIFRyYWluIENoYXJpc21hXG5cbiAgICB9IGVsc2UgaWYgKG92ZXJyaWRlID09IFwiaGFja2luZ1wiKSB7XG4gICAgICAgIG92ZXJyaWRlVGFzayA9IFwiVHJhaW4gSGFja2luZ1wiOyAvLyBUcmFpbiBDb21iYXQsIFRyYWluIEhhY2tpbmcsIFRyYWluIENoYXJpc21hXG5cbiAgICB9IGVsc2UgaWYgKG92ZXJyaWRlID09IFwiY29tYmF0XCIpIHtcbiAgICAgICAgb3ZlcnJpZGVUYXNrID0gXCJUcmFpbiBDb21iYXRcIjsgLy8gVHJhaW4gQ29tYmF0LCBUcmFpbiBIYWNraW5nLCBUcmFpbiBDaGFyaXNtYVxuXG4gICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcIndhcmZhcmVcIikge1xuICAgICAgICBvdmVycmlkZVRhc2sgPSBcIlRlcnJpdG9yeSBXYXJmYXJlXCI7IC8vIFRlcnJpdG9yeSBXYXJmYXJlXG4gICAgfVxuXG4gICAgbnMuZGlzYWJsZUxvZyhcIkFMTFwiKTtcbiAgICBucy5jbGVhckxvZygpO1xuICAgIG5zLnRhaWwoKTtcblxuICAgIGNvbnN0IGJ1eWluZ1dlYXBvbnMgPSB0cnVlO1xuICAgIGNvbnN0IGJ1eWluZ0FybW9yID0gdHJ1ZTtcbiAgICBjb25zdCBidXlpbmdWZWhpY2xlcyA9IHRydWU7XG4gICAgY29uc3QgYnV5aW5nUm9vdGtpdHMgPSB0cnVlO1xuICAgIGNvbnN0IGJ1eWluZ0F1Z21lbnRhdGlvbnMgPSB0cnVlO1xuXG4gICAgY29uc3QgbWVtYmVySGFja0F1Z3MgPSBbXTtcbiAgICBjb25zdCBtZW1iZXJDcmltZUF1Z3MgPSBbXTtcbiAgICBjb25zdCBtZW1iZXJXZWFwb25zID0gW107XG4gICAgY29uc3QgbWVtYmVyVmVoaWNsZXMgPSBbXTtcbiAgICBjb25zdCBtZW1iZXJBcm1vciA9IFtdO1xuICAgIGNvbnN0IG1lbWJlclJvb3RraXRzID0gW107XG5cbiAgICBjb25zdCBtZW1iZXJQcmVwcGVkID0gW107XG4gICAgY29uc3QgbWVtYmVyc0FzY2VuZGVkID0gW107XG4gICAgY29uc3QgbWVtYmVyU3RhdHMgPSBbXTtcblxuICAgIGNvbnN0IGRlbGF5ID0gMTAwO1xuXG4gICAgY29uc3QgSGFja0F1Z3MgPSBbXCJEYXRhSmFja1wiLCBcIk5ldXJhbHN0aW11bGF0b3JcIiwgXCJCaXRXaXJlXCJdO1xuICAgIGNvbnN0IENyaW1lQXVncyA9IFtcIkJpb25pYyBTcGluZVwiLCBcIkJpb25pYyBBcm1zXCIsIFwiQmlvbmljIExlZ3NcIiwgXCJHcmFwaGVuZSBCb25lIExhY2luZ3NcIiwgXCJTeW50aGV0aWMgSGVhcnRcIiwgXCJCcmFjaGlCbGFkZXNcIiwgXCJOYW5vZmliZXIgV2VhdmVcIiwgXCJTeW5maWJyaWwgTXVzY2xlXCJdO1xuICAgIGNvbnN0IFdlYXBvbnMgPSBbXCJCYXNlYmFsbCBCYXRcIiwgXCJLYXRhbmFcIiwgXCJHbG9jayAxOENcIiwgXCJQOTBDXCIsIFwiU3RleXIgQVVHXCIsIFwiQUstNDdcIiwgXCJNMTVBMTAgQXNzYXVsdCBSaWZsZVwiLCBcIkFXTSBTbmlwZXIgUmlmbGVcIl07XG4gICAgY29uc3QgQXJtb3IgPSBbXCJMaXF1aWQgQm9keSBBcm1vclwiLCBcIkJ1bGxldHByb29mIFZlc3RcIiwgXCJGdWxsIEJvZHkgQXJtb3JcIiwgXCJHcmFwaGVuZSBQbGF0aW5nIEFybW9yXCJdO1xuICAgIGNvbnN0IFZlaGljbGVzID0gW1wiRm9yZCBGbGV4IFYyMFwiLCBcIldoaXRlIEZlcnJhcmlcIiwgXCJBVFgxMDcwIFN1cGVyYmlrZVwiLCBcIk1lcmNlZGVzLUJlbnogUzkwMDFcIl07XG4gICAgY29uc3QgUm9vdGtpdHMgPSBbXCJOVUtFIFJvb3RraXRcIiwgXCJTb3Vsc3RlYWxlciBSb290a2l0XCIsIFwiRGVtb24gUm9vdGtpdFwiLCBcIkhtYXAgTm9kZVwiLCBcIkphY2sgdGhlIFJpcHBlclwiXTtcblxuICAgIGNvbnN0IE1lbWJlck5hbWVzID0gW1wiR2VuaWVcIiwgXCJNeWNvbmlkXCIsIFwiT2dyZVwiLCBcIlBpeGllXCIsIFwiVHJlYW50XCIsIFwiVHJvZ2xvZHl0ZVwiLCBcIkxvY29cIiwgXCJQdXBwZXRcIiwgXCJTdHJldGNoXCIsIFwiRXRlcm5pdHlcIiwgXCJaZW5cIiwgXCJDYWJsZVwiXTtcbiAgICAvKlxuICAgICAgICBodHRwczovL3d3dy5mYW50YXN5bmFtZWdlbmVyYXRvcnMuY29tL2N5YmVycHVuay1uYW1lcy5waHBcbiAgICAqL1xuXG4gICAgdmFyIHRvcEVhcm5lcnMgPSBbXTsgLy8gUmFuc29td2FyZSwgUGhpc2hpbmcsIElkZW50aXR5IFRoZWZ0LCBGcmF1ZCAmIENvdW50ZXJmZWl0aW5nLCBNb25leSBMYXVuZGVyaW5nXG4gICAgdmFyIHRvcFJlc3BlY3QgPSBbXTsgLy8gQ3liZXJ0ZXJyb3Jpc20sIEREb1MgQXR0YWNrcywgUGxhbnQgVmlydXMsIE1vbmV5IExhdW5kZXJpbmdcbiAgICB2YXIgdG9wVmlydHVvdXMgPSBbXTsgLy8gRXRoaWNhbCBIYWNraW5nLCBWaWdpbGFudGUgSnVzdGljZSAgXG5cbiAgICB2YXIgdHJhaW5pbmcgPSBbXTsgLy8gVHJhaW4gQ29tYmF0LCBUcmFpbiBIYWNraW5nLCBUcmFpbiBDaGFyaXNtYVxuICAgIHZhciB3YXJmYXJlID0gW107IC8vIFRlcnJpdG9yeSBXYXJmYXJlXG4gICAgdmFyIGlkbGUgPSBbXTsgLy8gVW5hc3NpZ25lZFxuXG4gICAgdmFyIHRhc2tzID0gbnMuZ2FuZy5nZXRUYXNrTmFtZXMoKTsgLy8gR2V0IHRoZSBuYW1lIG9mIGFsbCB2YWxpZCB0YXNrcyB0aGF0IGNhbiBiZSBhc3NpZ25lZC5cblxuICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdmFsaWQgdGFza3MuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAvLyBUT1AgRUFSTkVSU1xuICAgICAgICBpZiAodGFza3NbaV0udG9TdHJpbmcoKSA9PSBcIlJhbnNvbXdhcmVcIiB8fFxuICAgICAgICAgICAgdGFza3NbaV0udG9TdHJpbmcoKSA9PSBcIlBoaXNoaW5nXCIgfHxcbiAgICAgICAgICAgIHRhc2tzW2ldLnRvU3RyaW5nKCkgPT0gXCJJZGVudGl0eSBUaGVmdFwiIHx8XG4gICAgICAgICAgICB0YXNrc1tpXS50b1N0cmluZygpID09IFwiRnJhdWQgJiBDb3VudGVyZmVpdGluZ1wiIHx8XG4gICAgICAgICAgICB0YXNrc1tpXS50b1N0cmluZygpID09IFwiTW9uZXkgTGF1bmRlcmluZ1wiKSB7XG4gICAgICAgICAgICB0b3BFYXJuZXJzLnB1c2godGFza3NbaV0pO1xuICAgICAgICAgICAgLy8gVE9QIFJFU1BFQ1RcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrc1tpXS50b1N0cmluZygpID09IFwiQ3liZXJ0ZXJyb3Jpc21cIiB8fFxuICAgICAgICAgICAgdGFza3NbaV0udG9TdHJpbmcoKSA9PSBcIkREb1MgQXR0YWNrc1wiIHx8XG4gICAgICAgICAgICB0YXNrc1tpXS50b1N0cmluZygpID09IFwiUGxhbnQgVmlydXNcIiB8fFxuICAgICAgICAgICAgdGFza3NbaV0udG9TdHJpbmcoKSA9PSBcIk1vbmV5IExhdW5kZXJpbmdcIikge1xuICAgICAgICAgICAgdG9wUmVzcGVjdC5wdXNoKHRhc2tzW2ldKTtcbiAgICAgICAgICAgIC8vIFRPUCBWSVJUVU9VU1xuICAgICAgICB9IGVsc2UgaWYgKHRhc2tzW2ldLnRvU3RyaW5nKCkgPT0gXCJFdGhpY2FsIEhhY2tpbmdcIiB8fFxuICAgICAgICAgICAgdGFza3NbaV0udG9TdHJpbmcoKSA9PSBcIlZpZ2lsYW50ZSBKdXN0aWNlXCIpIHtcbiAgICAgICAgICAgIHRvcFZpcnR1b3VzLnB1c2godGFza3NbaV0pO1xuICAgICAgICAgICAgLy8gVFJBSU5JTkdcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrc1tpXS50b1N0cmluZygpID09IFwiVHJhaW4gQ29tYmF0XCIgfHxcbiAgICAgICAgICAgIHRhc2tzW2ldLnRvU3RyaW5nKCkgPT0gXCJUcmFpbiBIYWNraW5nXCIgfHxcbiAgICAgICAgICAgIHRhc2tzW2ldLnRvU3RyaW5nKCkgPT0gXCJUcmFpbiBDaGFyaXNtYVwiIHx8XG4gICAgICAgICAgICB0YXNrc1tpXS50b1N0cmluZygpID09IFwiVHJhaW4gV2FyZmFyZVwiKSB7XG4gICAgICAgICAgICB0cmFpbmluZy5wdXNoKHRhc2tzW2ldKTtcbiAgICAgICAgICAgIC8vIFdBUkZBUkVcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrc1tpXS50b1N0cmluZygpID09IFwiVGVycml0b3J5IFdhcmZhcmVcIikge1xuICAgICAgICAgICAgd2FyZmFyZS5wdXNoKHRhc2tzW2ldKTtcbiAgICAgICAgICAgIC8vIFVOQVNTSUdORURcbiAgICAgICAgfSBlbHNlIGlmICh0YXNrc1tpXS50b1N0cmluZygpID09IFwiVW5hc3NpZ25lZFwiKSB7XG4gICAgICAgICAgICBpZGxlLnB1c2godGFza3NbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRW5naW5lXG4gICAgd2hpbGUgKHRydWUpIHtcblxuICAgICAgICBucy5jbGVhckxvZygpO1xuXG4gICAgICAgIHZhciBtb25leSA9IG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKFwiaG9tZVwiKTtcblxuICAgICAgICBjb25zdCBnYW5nSW5mbyA9IG5zLmdhbmcuZ2V0R2FuZ0luZm9ybWF0aW9uKCk7XG4gICAgICAgIGNvbnN0IGdhbmdJbmNvbWUgPSBucy5nYW5nLmdldEdhbmdJbmZvcm1hdGlvbigpLm1vbmV5R2FpblJhdGUgKiA1OyAvLyBBIHRpY2sgaXMgZXZlcnkgMjAwbXMuIFRvIGdldCB0aGUgYWN0dWFsIG1vbmV5L3NlYywgbXVsdGlwbGUgbW9uZXlHYWluUmF0ZSBieSA1LlxuICAgICAgICBjb25zdCBnYW5nUmVzcGVjdCA9IHBhcnNlRmxvYXQobnMuZ2FuZy5nZXRHYW5nSW5mb3JtYXRpb24oKS5yZXNwZWN0KS50b0ZpeGVkKDIpO1xuXG4gICAgICAgIG5zLnByaW50KFwiIFxcblwiKTtcbiAgICAgICAgbnMucHJpbnQoXCIg8J+MhiBHYW5nOiBcIiArIFRleHRUcmFuc2Zvcm1zLmFwcGx5KGdhbmdJbmZvLmZhY3Rpb24sIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5PcmFuZ2VdKSArIFwiIPCfkqNcIik7XG4gICAgICAgIG5zLnByaW50KFwiIPCfj6YgTW9uZXkgYXZhaWxhYmxlOiDwn5KyXCIgKyBUZXh0VHJhbnNmb3Jtcy5hcHBseShGb3JtYXROdW1iZXIobW9uZXkpLCBbVGV4dFRyYW5zZm9ybXMuQ29sb3IuTEdyZWVuXSkpO1xuICAgICAgICBucy5wcmludChcIiDwn5K1IEdhbmcgaW5jb21lL3NlYzog8J+SslwiICsgVGV4dFRyYW5zZm9ybXMuYXBwbHkoRm9ybWF0TnVtYmVyKGdhbmdJbmNvbWUpLCBbVGV4dFRyYW5zZm9ybXMuQ29sb3IuTEdyZWVuXSkpO1xuICAgICAgICBucy5wcmludChcIiDwn6a+IEdhbmcgcmVzcGVjdDogXCIgKyBUZXh0VHJhbnNmb3Jtcy5hcHBseShnYW5nUmVzcGVjdCwgW1RleHRUcmFuc2Zvcm1zLkNvbG9yLkxQdXJwbGVdKSk7XG5cbiAgICAgICAgdmFyIG1lbWJlcnMgPSBucy5nYW5nLmdldE1lbWJlck5hbWVzKCk7XG4gICAgICAgIHZhciBwcm9zcGVjdHMgPSBNZW1iZXJOYW1lcy5maWx0ZXIoYyA9PiAhbWVtYmVycy5pbmNsdWRlcyhjKSk7XG5cbiAgICAgICAgLy8gRlVMTCBNRU1CRVJTXG4gICAgICAgIG5zLnByaW50KFwiXFxuXCIgKyBcIiDwn5iIIEN1cnJlbnQgTWVtYmVyczpcIiArIFwiXFxuXCIpO1xuICAgICAgICB2YXIgYWN0aXZldGVhbSA9IG1lbWJlcnMuam9pbihcIiwgXCIpOyAvLyBTdWdnZXN0ZWQgYnkgdS9BZXJhZ2dvLCAyLTIzLTIwMjNcbiAgICAgICAgbnMucHJpbnQoXCIgICAgXCIgKyBUZXh0VHJhbnNmb3Jtcy5hcHBseShhY3RpdmV0ZWFtLCBbVGV4dFRyYW5zZm9ybXMuQ29sb3IuQ2hhcnRzQmx1ZV0pICsgXCJcXG5cIik7XG5cbiAgICAgICAgLy8gUFJPU1BFQ1RTXG4gICAgICAgIG5zLnByaW50KFwiXFxuXCIgKyBcIiDwn5iQIFByb3NwZWN0czpcIiArIFwiXFxuXCIpO1xuICAgICAgICB2YXIgd2FpdHRlYW0gPSBcIlwiOyAvLyByZXNldFxuICAgICAgICB3YWl0dGVhbSA9IHByb3NwZWN0cy5qb2luKFwiLCBcIik7IC8vIFN1Z2dlc3RlZCBieSB1L0FlcmFnZ28sIDItMjMtMjAyM1xuXG4gICAgICAgIGlmICh3YWl0dGVhbS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgbnMucHJpbnQoXCIgICAgWW91ciBnYW5nIGlzIG1heGVkIG91dC4gR29vZCBqb2IhIE5vdyBnbyBkbyBzb21lIGNyaW1lLlxcblwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5zLnByaW50KFwiICAgIFwiICsgVGV4dFRyYW5zZm9ybXMuYXBwbHkod2FpdHRlYW0sIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5MUHVycGxlXSkgKyBcIlxcblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJFQ1JVSVRcbiAgICAgICAgaWYgKG5zLmdhbmcuY2FuUmVjcnVpdE1lbWJlcigpKSB7XG4gICAgICAgICAgICBucy5wcmludChcIlxcblwiICsgXCIgUmVjcnVpdGluZyBuZXcgcHJvc3BlY3QuLi5cIiArIFwiXFxuXCIpO1xuICAgICAgICAgICAgYXdhaXQgUmVjcnVpdFByb3NwZWN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHRVQgQUxMIEhBQ0sgU0tJTEwgTEVWRUxTLiBTb3J0IG1lbWJlcnMgZnJvbSBoaWdoZXN0IHRvIGxvd2VzdCBIYWNrKCkuXG4gICAgICAgIGNvbnN0IHNraWxsU29ydCA9IG1lbWJlcnMuc29ydCgoYiwgYSkgPT4gbnMuZ2FuZy5nZXRNZW1iZXJJbmZvcm1hdGlvbihhKS5oYWNrIC0gbnMuZ2FuZy5nZXRNZW1iZXJJbmZvcm1hdGlvbihiKS5oYWNrKVxuXG4gICAgICAgIC8vIFNIT1cgU1RBVFNcbiAgICAgICAgbnMucHJpbnQoXCJcXG5cIiArIFwiIOKcqCBNZW1iZXJzIHNvcnRlZCBieSBIYWNrIFNraWxsIExldmVsOlwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBza2lsbFNvcnQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBsZXZlbCA9IG5zLmdhbmcuZ2V0TWVtYmVySW5mb3JtYXRpb24oc2tpbGxTb3J0W2ldKS5oYWNrO1xuXG4gICAgICAgICAgICAvL25zLnByaW50KFwiICAgXCIgKyBcIvCfkrsgXCIgKyBza2lsbFNvcnRbaV0gKyBcIiwgSGFjayBza2lsbCBsZXZlbDogXCIgKyBsZXZlbCArIFwiXCIpO1xuICAgICAgICAgICAgbWVtYmVyU3RhdHMucHVzaChza2lsbFNvcnRbaV0gKyBcInxcIiArIGxldmVsKTtcblxuICAgICAgICAgICAgLy8gQVNTSUdOIEpPQlNcbiAgICAgICAgICAgIEdpdmVBc3NpZ25tZW50cyhza2lsbFNvcnRbaV0sIGxldmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1FTUJFUiBTVEFUUyAgICAgICAgXG4gICAgICAgIGxldCBtZW1iZXJEYXRhT2JqID0ge307IC8vIEluaXRpYWxpemUgZW1wdHkgb2JqZWN0IHRvIHN0b3JlIGRhdGFcbiAgICAgICAgbGV0IG1lbWJlckRhdGEgPSBbXTsgLy8gSW5pdGlhbGl6ZSBlbXB0eSBhcnJheSB0byBzdG9yZSBmaW5hbCBkYXRhXG5cbiAgICAgICAgbGV0IGxvbmdlc3QwID0gMDtcbiAgICAgICAgbGV0IGxvbmdlc3QxID0gMDtcbiAgICAgICAgbGV0IGxvbmdlc3QyID0gMDtcbiAgICAgICAgbGV0IGxvbmdlc3QzID0gMDtcbiAgICAgICAgbGV0IGxvbmdlc3Q0ID0gMDtcblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggZWFjaCByZWNvcmQgaW4gX21lbWJlclN0YXRzIGFycmF5XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVtYmVyU3RhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByZXR2YWwgPSBtZW1iZXJTdGF0c1tpXSArICcnOyAvLyBTcGxpdCBlYWNoIHJlY29yZCBpbnRvIG5hbWUgYW5kIHN0YXQgdXNpbmcgdGhlIHBpcGUgc3ltYm9sXG4gICAgICAgICAgICBsZXQgcmVjb3JkID0gcmV0dmFsLnNwbGl0KFwifFwiKTtcbiAgICAgICAgICAgIGxldCBuYW1lID0gcmVjb3JkWzBdO1xuICAgICAgICAgICAgbGV0IHN0YXQgPSByZWNvcmRbMV07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIG5hbWUgYWxyZWFkeSBleGlzdHMgaW4gbWVtYmVyRGF0YU9ialxuICAgICAgICAgICAgaWYgKG1lbWJlckRhdGFPYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICBtZW1iZXJEYXRhT2JqW25hbWVdICs9IFwifFwiICsgc3RhdDsgLy8gSWYgaXQgZXhpc3RzLCBjb25jYXRlbmF0ZSB0aGUgc3RhdCB3aXRoIGV4aXN0aW5nIGRhdGFcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVtYmVyRGF0YU9ialtuYW1lXSA9IG5hbWUgKyBcInxcIiArIHN0YXQ7IC8vIElmIGl0IGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBhIG5ldyBlbnRyeSBmb3IgdGhlIG5hbWUgaW4gbWVtYmVyRGF0YU9ialxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIG1lbWJlckRhdGFPYmogYW5kIGFkZCBlYWNoIGVudHJ5IHRvIG1lbWJlckRhdGEgYXJyYXlcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBtZW1iZXJEYXRhT2JqKSB7XG4gICAgICAgICAgICBtZW1iZXJEYXRhLnB1c2gobWVtYmVyRGF0YU9ialtuYW1lXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdG8gZm9ybWF0XG4gICAgICAgIG1lbWJlckRhdGEuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBlICsgJyc7XG4gICAgICAgICAgICB2YXIgc3BsaXRTdHIgPSBkYXRhLnNwbGl0KFwifFwiKTtcblxuICAgICAgICAgICAgdmFyIG5hbWUgPSBzcGxpdFN0clswXTtcbiAgICAgICAgICAgIHZhciBoYWNrbGV2ZWwgPSBzcGxpdFN0clsxXTtcbiAgICAgICAgICAgIHZhciB3YW50ZWRsZXZlbCA9IHNwbGl0U3RyWzJdO1xuICAgICAgICAgICAgdmFyIHJlc3BlY3QgPSBzcGxpdFN0clszXTtcbiAgICAgICAgICAgIHZhciB0YXNrID0gc3BsaXRTdHJbNF07XG5cbiAgICAgICAgICAgIGxvbmdlc3QwID0gTWF0aC5tYXgobmFtZS5sZW5ndGgsIGxvbmdlc3QwKVxuICAgICAgICAgICAgbG9uZ2VzdDEgPSBNYXRoLm1heChoYWNrbGV2ZWwubGVuZ3RoLCBsb25nZXN0MSlcbiAgICAgICAgICAgIGxvbmdlc3QyID0gTWF0aC5tYXgod2FudGVkbGV2ZWwubGVuZ3RoLCBsb25nZXN0MilcbiAgICAgICAgICAgIGxvbmdlc3QzID0gTWF0aC5tYXgocmVzcGVjdC5sZW5ndGgsIGxvbmdlc3QzKVxuICAgICAgICAgICAgbG9uZ2VzdDQgPSBNYXRoLm1heCh0YXNrLmxlbmd0aCwgbG9uZ2VzdDQpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNob3cgaXQuXG4gICAgICAgIG1lbWJlckRhdGEuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBlICsgJyc7XG4gICAgICAgICAgICB2YXIgc3BsaXRTdHIgPSBkYXRhLnNwbGl0KFwifFwiKTtcblxuICAgICAgICAgICAgdmFyIG5hbWUgPSBzcGxpdFN0clswXTtcbiAgICAgICAgICAgIHZhciBoYWNrbGV2ZWwgPSBzcGxpdFN0clsxXTtcbiAgICAgICAgICAgIHZhciB3YW50ZWRsZXZlbCA9IHNwbGl0U3RyWzJdO1xuICAgICAgICAgICAgdmFyIHJlc3BlY3QgPSBzcGxpdFN0clszXTtcbiAgICAgICAgICAgIHZhciB0YXNrID0gc3BsaXRTdHJbNF07XG5cbiAgICAgICAgICAgIHZhciBudW0wID0gcGFyc2VGbG9hdCh3YW50ZWRsZXZlbCkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgIHZhciBudW0xID0gcGFyc2VGbG9hdChyZXNwZWN0KS50b0ZpeGVkKDIpO1xuXG4gICAgICAgICAgICBucy5wcmludChUZXh0VHJhbnNmb3Jtcy5hcHBseShuYW1lLnBhZFN0YXJ0KGxvbmdlc3QwICsgMSksIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNCbHVlXSlcbiAgICAgICAgICAgICAgICArIFwiLCDwn5K7aGFjazogXCIgKyBUZXh0VHJhbnNmb3Jtcy5hcHBseShoYWNrbGV2ZWwucGFkU3RhcnQobG9uZ2VzdDEgKyAxKSwgW1RleHRUcmFuc2Zvcm1zLkNvbG9yLkNoYXJ0c0dyZWVuXSlcbiAgICAgICAgICAgICAgICArIFwiLCDwn5W277iPd2FudGVkOiBcIiArIFRleHRUcmFuc2Zvcm1zLmFwcGx5KG51bTAucGFkU3RhcnQoOSksIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNHcmVlbl0pXG4gICAgICAgICAgICAgICAgKyBcIiwg8J+mvnJlc3BlY3Q6IFwiICsgVGV4dFRyYW5zZm9ybXMuYXBwbHkobnVtMS5wYWRTdGFydCg5KSwgW1RleHRUcmFuc2Zvcm1zLkNvbG9yLkNoYXJ0c0dyZWVuXSlcbiAgICAgICAgICAgICAgICArIFwiLCDwn5K1dGFzazogXCIgKyBUZXh0VHJhbnNmb3Jtcy5hcHBseSh0YXNrLnBhZFN0YXJ0KGxvbmdlc3Q0ICsgMSksIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNHcmVlbl0pXG4gICAgICAgICAgICAgICAgKyBcIiBcXG5cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFTQ0VORCAmIFBSRVBcbiAgICAgICAgbGV0IGxvbmdlc3QgPSAwO1xuICAgICAgICBsZXQgX21lbWJlcnMgPSBtZW1iZXJzO1xuXG4gICAgICAgIGZvciAobGV0IF9tZW1iZXIgb2YgX21lbWJlcnMpIHtcbiAgICAgICAgICAgIGxvbmdlc3QgPSBNYXRoLm1heChfbWVtYmVyLmxlbmd0aCwgbG9uZ2VzdClcbiAgICAgICAgfTtcblxuICAgICAgICBucy5wcmludChcIlxcblwiICsgXCIg4qyGIEFzY2Vuc2lvbuKcqCAmIFByZXDwn5Sq8J+So/Cfm6HvuI8gc3RhdHM6IFwiICsgXCJcXG5cIik7XG5cbiAgICAgICAgdmFyIGxicmFja2V0ID0gVGV4dFRyYW5zZm9ybXMuYXBwbHkoXCJbXCIsIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNHcmF5XSlcbiAgICAgICAgdmFyIHJicmFja2V0ID0gVGV4dFRyYW5zZm9ybXMuYXBwbHkoXCJdXCIsIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNHcmF5XSlcblxuICAgICAgICBmb3IgKGxldCBfbWVtIG9mIF9tZW1iZXJzKSB7XG5cbiAgICAgICAgICAgIHZhciBwcmVwcGluZyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBtZW1iZXJfbmFtZSA9IFwiXCIgKyBUZXh0VHJhbnNmb3Jtcy5hcHBseShfbWVtLnBhZFN0YXJ0KGxvbmdlc3QgKyAxKSwgW1RleHRUcmFuc2Zvcm1zLkNvbG9yLkNoYXJ0c0JsdWVdKSArIFwiXCI7XG4gICAgICAgICAgICB2YXIgbnVtVGltZXNBc2NlbmRlZCA9IGF3YWl0IE51bWJlck9mVGltZXNBc2NlbmRlZChtZW1iZXJzQXNjZW5kZWQsIF9tZW0pO1xuXG4gICAgICAgICAgICAvLyBQUkVQXG4gICAgICAgICAgICBpZiAobWVtYmVyUHJlcHBlZC5pbmNsdWRlcyhfbWVtLnRyaW0oKSkpIHtcbiAgICAgICAgICAgICAgICAvLyBBTFJFQURZIFBSRVBQRUQgT1VUXG4gICAgICAgICAgICAgICAgcHJlcHBpbmcgPSBcIiBcIiArIGxicmFja2V0ICsgVGV4dFRyYW5zZm9ybXMuYXBwbHkoXCJGdWxseSBQcmVwcGVkIPCflKrwn5Kj8J+boe+4j1wiLCBbVGV4dFRyYW5zZm9ybXMuQ29sb3IuQ2hhcnRzR3JlZW5dKSArIHJicmFja2V0ICsgXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUFJFUCBNRU1CRVIgICAgICAgIFxuICAgICAgICAgICAgICAgIHByZXBwaW5nID0gXCIgXCIgKyBsYnJhY2tldCArIFRleHRUcmFuc2Zvcm1zLmFwcGx5KFwi4pyoUHJlcHBpbmfinKhcIiwgW1RleHRUcmFuc2Zvcm1zLkNvbG9yLkNoYXJ0c0dyYXldKSArIHJicmFja2V0ICsgXCJcIjtcbiAgICAgICAgICAgICAgICBQcmVwYXJlKF9tZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBU0NFTkQgICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lbWJlckluZm8gPSBucy5nYW5nLmdldE1lbWJlckluZm9ybWF0aW9uKF9tZW0pOyAvLyBHZXQgZW50aXJlIGdhbmcgbWViZXIgb25qZWN0IGZyb20gbmFtZS5cbiAgICAgICAgICAgICAgICB2YXIgYXNjUmVzdWx0ID0gbnMuZ2FuZy5nZXRBc2NlbnNpb25SZXN1bHQoX21lbSk7ICAvLyBHZXQgdGhlIHJlc3VsdCBvZiBhbiBhc2NlbnNpb24gd2l0aG91dCBhc2NlbmRpbmcuXG5cbiAgICAgICAgICAgICAgICBpZiAoYXNjUmVzdWx0ICE9IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENSRURJVDogWW9iaWtpclxuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vUktERTE5ODgvQml0YnVybmVyL2Jsb2IvbWFpbi9HYW5nL01hbmFnZXIuanNcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRfTXVsdDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRfTXVsdDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRfUG9pbnQgPSBucy5mb3JtdWxhcy5nYW5nLmFzY2Vuc2lvblBvaW50c0dhaW4obWVtYmVySW5mby5oYWNrX2V4cCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dF9NdWx0ID0gbnMuZm9ybXVsYXMuZ2FuZy5hc2NlbnNpb25NdWx0aXBsaWVyKG1lbWJlckluZm8uaGFja19hc2NfcG9pbnRzICsgbmV4dF9Qb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfTXVsdCA9IG1lbWJlckluZm8uaGFja19hc2NfbXVsdDtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbnh0bXV0bHBfZGl2X2J5X2N1cnJlbnRtdWx0cCA9IChuZXh0X011bHQgLyBjdXJyZW50X011bHQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2FsY3VsYXRlZF9hc2NfdGhyZXNob2xkID0gQ2FsY3VsYXRlQXNjZW5kVHJlc2hvbGQoY3VycmVudF9NdWx0KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZG9Bc2MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChuZXh0X011bHQgLyBjdXJyZW50X011bHQpID49IENhbGN1bGF0ZUFzY2VuZFRyZXNob2xkKGN1cnJlbnRfTXVsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpdmUgbWVzc2FnZSB0byBhc2NlbmQuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBcInRpbWVzX2FzYzogXCIgKyBudW1UaW1lc0FzY2VuZGVkICsgXCIgXCIgKyBsYnJhY2tldCArIFRleHRUcmFuc2Zvcm1zLmFwcGx5KFwi4pyoQXNjZW5kaW5n4pyoXCIsIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNHcmVlbl0pICsgcmJyYWNrZXQgKyBcIiBcIiArIG54dG11dGxwX2Rpdl9ieV9jdXJyZW50bXVsdHAgKyBcIiA+PSBcIiArIGNhbGN1bGF0ZWRfYXNjX3RocmVzaG9sZCArIFwiIChcIiArIFRleHRUcmFuc2Zvcm1zLmFwcGx5KFwibnh0X21sdHA6IFwiLCBbVGV4dFRyYW5zZm9ybXMuQ29sb3IuQ2hhcnRzR3JheV0pICsgbnMuZm9ybWF0TnVtYmVyKG5leHRfTXVsdCwgXCIwLjAwMGFcIikgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvQXNjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdGhpbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBcInRpbWVzX2FzYzogXCIgKyBudW1UaW1lc0FzY2VuZGVkICsgXCIgXCIgKyBsYnJhY2tldCArIFRleHRUcmFuc2Zvcm1zLmFwcGx5KFwiV29ya2luZ1wiLCBbVGV4dFRyYW5zZm9ybXMuQ29sb3IuQ2hhcnRzR3JheV0pICsgcmJyYWNrZXQgKyBcIiBcIiArIG54dG11dGxwX2Rpdl9ieV9jdXJyZW50bXVsdHAgKyBcIiA8IFwiICsgY2FsY3VsYXRlZF9hc2NfdGhyZXNob2xkICsgXCIgKFwiICsgVGV4dFRyYW5zZm9ybXMuYXBwbHkoXCJueHRfbWx0cDogXCIsIFtUZXh0VHJhbnNmb3Jtcy5Db2xvci5DaGFydHNHcmF5XSkgKyBucy5mb3JtYXROdW1iZXIobmV4dF9NdWx0LCBcIjAuMDAwYVwiKSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQobWVtYmVyX25hbWUgKyBcIiwgXCIgKyBvdXRwdXQgKyBcIiBcIiArIHByZXBwaW5nICsgXCIgXFxuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICBBU0NFTkRcbiAgICAgICAgICAgICAgICAgICAgICAgIC0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgRG9pbmcgQXNjZW5kKF9tZW0pIGhlcmUsIGJlY2F1c2UgdGhlcmUgaXMgYSBnbGl0Y2ggdGhhdCBwcmV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlIG91dHB1dCBzdHJpbmcgZnJvbSBkaXNwbGF5aW5nIHdoZW4gQXNjZW5kKF9tZW0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpcyBsdW1wZWQgaW50byB0aGUgJ2Vsc2UgaWYgKG11bHRjaGFuZ2UgPj0gMi4wKXsgLi4uIH0nIGNvbmRpdGlvbmFsIGFyZWEuXG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb0FzYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBc2NlbmQoX21lbSk7IC8vIGFzY2VuZCB0aGUgbWVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXJzQXNjZW5kZWQucHVzaChfbWVtKTsgLy8gbGV0IHRoaXMgZ3Jvdy5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZS4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJFU0VUIEVOVklST05NTkVOVFxuICAgICAgICBtZW1iZXJEYXRhT2JqID0ge307XG4gICAgICAgIG1lbWJlclN0YXRzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgbnMucHJpbnQoXCIgXFxuXCIpO1xuICAgICAgICBhd2FpdCBucy5zbGVlcChkZWxheSk7XG4gICAgfVxuXG4gICAgLy8gQ3JlZGl0OiBNeXN0ZXllcy4gaHR0cHM6Ly9kaXNjb3JkLmNvbS9jaGFubmVscy80MTUyMDc1MDgzMDM1NDQzMjEvNDE1MjA3OTIzNTA2MjE2OTcxLzk0MDM3OTcyNDIxNDA3NTQ0MlxuICAgIGZ1bmN0aW9uIENhbGN1bGF0ZUFzY2VuZFRyZXNob2xkKG11bHQpIHtcbiAgICAgICAgaWYgKG11bHQgPCAxLjYzMikgcmV0dXJuIDEuNjMyNjtcbiAgICAgICAgZWxzZSBpZiAobXVsdCA8IDIuMzM2KSByZXR1cm4gMS40MzE1O1xuICAgICAgICBlbHNlIGlmIChtdWx0IDwgMi45OTkpIHJldHVybiAxLjI4NDtcbiAgICAgICAgZWxzZSBpZiAobXVsdCA8IDMuMzYzKSByZXR1cm4gMS4yMTI1O1xuICAgICAgICBlbHNlIGlmIChtdWx0IDwgNC4yNTMpIHJldHVybiAxLjE2OTg7XG4gICAgICAgIGVsc2UgaWYgKG11bHQgPCA0Ljg2MCkgcmV0dXJuIDEuMTQyODtcbiAgICAgICAgZWxzZSBpZiAobXVsdCA8IDUuNDU1KSByZXR1cm4gMS4xMjI1O1xuICAgICAgICBlbHNlIGlmIChtdWx0IDwgNS45NzcpIHJldHVybiAxLjA5NTc7XG4gICAgICAgIGVsc2UgaWYgKG11bHQgPCA2LjQ5NikgcmV0dXJuIDEuMDg2OTtcbiAgICAgICAgZWxzZSBpZiAobXVsdCA8IDcuMDA4KSByZXR1cm4gMS4wNzg5O1xuICAgICAgICBlbHNlIGlmIChtdWx0IDwgNy41MTkpIHJldHVybiAxLjA3MztcbiAgICAgICAgZWxzZSBpZiAobXVsdCA8IDguMDI1KSByZXR1cm4gMS4wNjczO1xuICAgICAgICBlbHNlIGlmIChtdWx0IDwgOC41MTMpIHJldHVybiAxLjA2MzE7XG4gICAgICAgIGVsc2UgcmV0dXJuIDEuMDU5MTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBOdW1iZXJPZlRpbWVzQXNjZW5kZWQobWVtYmVyc0FzY2VuZGVkLCBuYW1lKSB7XG4gICAgICAgIHZhciB0aW1lc0FzY2VuZGVkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1iZXJzQXNjZW5kZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtZW1iZXJzQXNjZW5kZWRbaV0gPT0gbmFtZSkge1xuICAgICAgICAgICAgICAgIHRpbWVzQXNjZW5kZWQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGltZXNBc2NlbmRlZDtcbiAgICB9XG5cbiAgICAvLyBSZWNydWl0IGEgbmV3IHByb3NwZWN0IHRvIGEgZnVsbCBnYW5nIG1lbWJlci5cbiAgICBhc3luYyBmdW5jdGlvbiBSZWNydWl0UHJvc3BlY3QoKSB7XG4gICAgICAgIHZhciBjdXJyZW50TWVtYmVycyA9IG5zLmdhbmcuZ2V0TWVtYmVyTmFtZXMoKTtcbiAgICAgICAgdmFyIGF2YWlsYWJsZU5hbWVzID0gTWVtYmVyTmFtZXMuZmlsdGVyKHggPT4gIWN1cnJlbnRNZW1iZXJzLmluY2x1ZGVzKHgpKTtcbiAgICAgICAgbnMuZ2FuZy5yZWNydWl0TWVtYmVyKGF2YWlsYWJsZU5hbWVzWzBdKTtcbiAgICAgICAgbnMuZ2FuZy5zZXRNZW1iZXJUYXNrKGF2YWlsYWJsZU5hbWVzWzBdLCBcIlRyYWluIEhhY2tpbmdcIik7IC8vIFNldCB0byB0cmFpbiBpbml0aWFsbHkuXG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwKTtcbiAgICB9XG5cbiAgICAvLyBBc2NlbmQgdGhpcyBjdXJyZW50IGdhbmcgbWVtYmVyXG4gICAgYXN5bmMgZnVuY3Rpb24gQXNjZW5kKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5zLmdhbmcuYXNjZW5kTWVtYmVyKG5hbWUpOyAvLyBBc2NlbmQgdGhlIHNwZWNpZmllZCBHYW5nIE1lbWJlci4gICAgICAgXG4gICAgfVxuXG4gICAgLy8gQnV5IEhhY2tUb29scywgSGFja0F1Z3MsIENyaW1lQXVncywgV2VhcG9ucywgQXJtb3IsIFZlaGljbGVzXG4gICAgZnVuY3Rpb24gUHJlcGFyZShuYW1lKSB7XG5cbiAgICAgICAgaWYgKG1lbWJlclByZXBwZWQuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgICAgICAgIC8vIGdldCBvdXQuIFRoaXMgZ2FuZyBtZW1iZXIgaGFzIGV2ZXJ5dGhpbmcuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBIYWNrQXVncy5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29zdCA9IG5zLmZvcm1hdE51bWJlcihucy5nYW5nLmdldEVxdWlwbWVudENvc3QoZSksIFwiMC4wMDBhXCIpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBucy5nYW5nLmdldEVxdWlwbWVudFR5cGUoZSk7XG5cbiAgICAgICAgICAgIC8vIFtcIkRhdGFKYWNrXCIsIFwiTmV1cmFsc3RpbXVsYXRvclwiLCBcIkJpdFdpcmVcIl07XG4gICAgICAgICAgICBpZiAobWVtYmVySGFja0F1Z3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGJ1eSBmaXJzdCBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKGJ1eWluZ0F1Z21lbnRhdGlvbnMgJiYgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKCdob21lJykgPiBjb3N0KSkge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJIYWNrQXVncy5wdXNoKG5hbWUgKyBcInxcIiArIGUpO1xuICAgICAgICAgICAgICAgICAgICBucy5nYW5nLnB1cmNoYXNlRXF1aXBtZW50KG5hbWUsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW1lbWJlckhhY2tBdWdzLmluY2x1ZGVzKG5hbWUgKyBcInxcIiArIGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gYnV5IG5ldyBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKGJ1eWluZ0F1Z21lbnRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVySGFja0F1Z3MucHVzaChuYW1lICsgXCJ8XCIgKyBlKTtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoXCIgICAoXCIgKyBuYW1lICsgXCIpIGJ1eWluZyA6ICdcIiArIGUgKyBcIicgZm9yICRcIiArIGNvc3QpO1xuICAgICAgICAgICAgICAgICAgICBucy5nYW5nLnB1cmNoYXNlRXF1aXBtZW50KG5hbWUsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgQ3JpbWVBdWdzLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgIGxldCBjb3N0ID0gbnMuZm9ybWF0TnVtYmVyKG5zLmdhbmcuZ2V0RXF1aXBtZW50Q29zdChlKSwgXCIwLjAwMGFcIik7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG5zLmdhbmcuZ2V0RXF1aXBtZW50VHlwZShlKTtcblxuICAgICAgICAgICAgLy8gW1wiQmlvbmljIFNwaW5lXCIsIFwiQmlvbmljIEFybXNcIiwgXCJCaW9uaWMgTGVnc1wiLCBcIkdyYXBoZW5lIEJvbmUgTGFjaW5nc1wiLCBcIlN5bnRoZXRpYyBIZWFydFwiLCBcIkJyYWNoaUJsYWRlc1wiLCBcIk5hbm9maWJlciBXZWF2ZVwiLCBcIlN5bmZpYnJpbCBNdXNjbGVcIl07XG4gICAgICAgICAgICBpZiAobWVtYmVyQ3JpbWVBdWdzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBidXkgZmlyc3QgaXRlbVxuICAgICAgICAgICAgICAgIGlmIChidXlpbmdBdWdtZW50YXRpb25zICYmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSgnaG9tZScpID4gY29zdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyQ3JpbWVBdWdzLnB1c2gobmFtZSArIFwifFwiICsgZSk7XG4gICAgICAgICAgICAgICAgICAgIG5zLmdhbmcucHVyY2hhc2VFcXVpcG1lbnQobmFtZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghbWVtYmVyQ3JpbWVBdWdzLmluY2x1ZGVzKG5hbWUgKyBcInxcIiArIGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gYnV5IG5ldyBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKGJ1eWluZ0F1Z21lbnRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyQ3JpbWVBdWdzLnB1c2gobmFtZSArIFwifFwiICsgZSk7XG4gICAgICAgICAgICAgICAgICAgIG5zLnByaW50KFwiICAgKFwiICsgbmFtZSArIFwiKSBidXlpbmcgOiAnXCIgKyBlICsgXCInIGZvciAkXCIgKyBjb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgbnMuZ2FuZy5wdXJjaGFzZUVxdWlwbWVudChuYW1lLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFdlYXBvbnMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvc3QgPSBucy5mb3JtYXROdW1iZXIobnMuZ2FuZy5nZXRFcXVpcG1lbnRDb3N0KGUpLCBcIjAuMDAwYVwiKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gbnMuZ2FuZy5nZXRFcXVpcG1lbnRUeXBlKGUpO1xuXG4gICAgICAgICAgICAvLyBbXCJCYXNlYmFsbCBCYXRcIiwgXCJLYXRhbmFcIiwgXCJHbG9jayAxOENcIiwgXCJQOTBDXCIsIFwiU3RleXIgQVVHXCIsIFwiQUstNDdcIiwgXCJNMTVBMTAgQXNzYXVsdCBSaWZsZVwiLCBcIkFXTSBTbmlwZXIgUmlmbGVcIl07XG4gICAgICAgICAgICBpZiAobWVtYmVyV2VhcG9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gYnV5IGZpcnN0IGl0ZW1cbiAgICAgICAgICAgICAgICBpZiAoYnV5aW5nV2VhcG9ucyAmJiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSA+IGNvc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlcldlYXBvbnMucHVzaChuYW1lICsgXCJ8XCIgKyBlKTtcbiAgICAgICAgICAgICAgICAgICAgbnMuZ2FuZy5wdXJjaGFzZUVxdWlwbWVudChuYW1lLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFtZW1iZXJXZWFwb25zLmluY2x1ZGVzKG5hbWUgKyBcInxcIiArIGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gYnV5IG5ldyBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKGJ1eWluZ1dlYXBvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyV2VhcG9ucy5wdXNoKG5hbWUgKyBcInxcIiArIGUpO1xuICAgICAgICAgICAgICAgICAgICBucy5wcmludChcIiAgIChcIiArIG5hbWUgKyBcIikgYnV5aW5nIDogJ1wiICsgZSArIFwiJyBmb3IgJFwiICsgY29zdCk7XG4gICAgICAgICAgICAgICAgICAgIG5zLmdhbmcucHVyY2hhc2VFcXVpcG1lbnQobmFtZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBBcm1vci5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29zdCA9IG5zLmZvcm1hdE51bWJlcihucy5nYW5nLmdldEVxdWlwbWVudENvc3QoZSksIFwiMC4wMDBhXCIpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBucy5nYW5nLmdldEVxdWlwbWVudFR5cGUoZSk7XG5cbiAgICAgICAgICAgIC8vIFtcIkxpcXVpZCBCb2R5IEFybW9yXCIsIFwiQnVsbGV0cHJvb2YgVmVzdFwiLCBcIkZ1bGwgQm9keSBBcm1vclwiLCBcIkdyYXBoZW5lIFBsYXRpbmcgQXJtb3JcIl07XG4gICAgICAgICAgICBpZiAobWVtYmVyQXJtb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGJ1eSBmaXJzdCBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKGJ1eWluZ0FybW9yICYmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSgnaG9tZScpID4gY29zdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyQXJtb3IucHVzaChuYW1lICsgXCJ8XCIgKyBlKTtcbiAgICAgICAgICAgICAgICAgICAgbnMuZ2FuZy5wdXJjaGFzZUVxdWlwbWVudChuYW1lLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFtZW1iZXJBcm1vci5pbmNsdWRlcyhuYW1lICsgXCJ8XCIgKyBlKSkge1xuICAgICAgICAgICAgICAgIC8vIGJ1eSBuZXcgaXRlbVxuICAgICAgICAgICAgICAgIGlmIChidXlpbmdBcm1vcikge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJBcm1vci5wdXNoKG5hbWUgKyBcInxcIiArIGUpO1xuICAgICAgICAgICAgICAgICAgICBucy5wcmludChcIiAgIChcIiArIG5hbWUgKyBcIikgYnV5aW5nIDogJ1wiICsgZSArIFwiJyBmb3IgJFwiICsgY29zdCk7XG4gICAgICAgICAgICAgICAgICAgIG5zLmdhbmcucHVyY2hhc2VFcXVpcG1lbnQobmFtZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBWZWhpY2xlcy5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29zdCA9IG5zLmZvcm1hdE51bWJlcihucy5nYW5nLmdldEVxdWlwbWVudENvc3QoZSksIFwiMC4wMDBhXCIpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBucy5nYW5nLmdldEVxdWlwbWVudFR5cGUoZSk7XG5cbiAgICAgICAgICAgIC8vIFtcIkZvcmQgRmxleCBWMjBcIiwgXCJXaGl0ZSBGZXJyYXJpXCIsIFwiQVRYMTA3MCBTdXBlcmJpa2VcIiwgXCJNZXJjZWRlcy1CZW56IFM5MDAxXCJdO1xuICAgICAgICAgICAgaWYgKG1lbWJlclZlaGljbGVzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBidXkgZmlyc3QgaXRlbVxuICAgICAgICAgICAgICAgIGlmIChidXlpbmdWZWhpY2xlcyAmJiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSA+IGNvc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlclZlaGljbGVzLnB1c2gobmFtZSArIFwifFwiICsgZSk7XG4gICAgICAgICAgICAgICAgICAgIG5zLmdhbmcucHVyY2hhc2VFcXVpcG1lbnQobmFtZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghbWVtYmVyVmVoaWNsZXMuaW5jbHVkZXMobmFtZSArIFwifFwiICsgZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBidXkgbmV3IGl0ZW1cbiAgICAgICAgICAgICAgICBpZiAoYnV5aW5nVmVoaWNsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyVmVoaWNsZXMucHVzaChuYW1lICsgXCJ8XCIgKyBlKTtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoXCIgICAoXCIgKyBuYW1lICsgXCIpIGJ1eWluZyA6ICdcIiArIGUgKyBcIicgZm9yICRcIiArIGNvc3QpO1xuICAgICAgICAgICAgICAgICAgICBucy5nYW5nLnB1cmNoYXNlRXF1aXBtZW50KG5hbWUsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgUm9vdGtpdHMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvc3QgPSBucy5mb3JtYXROdW1iZXIobnMuZ2FuZy5nZXRFcXVpcG1lbnRDb3N0KGUpLCBcIjAuMDAwYVwiKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gbnMuZ2FuZy5nZXRFcXVpcG1lbnRUeXBlKGUpO1xuXG4gICAgICAgICAgICAvLyBcIk5VS0UgUm9vdGtpdFwiLCBcIlNvdWxzdGVhbGVyIFJvb3RraXRcIiwgXCJEZW1vbiBSb290a2l0XCIsIFwiSG1hcCBOb2RlXCIsIFwiSmFjayB0aGUgUmlwcGVyXCJdO1xuICAgICAgICAgICAgaWYgKG1lbWJlclJvb3RraXRzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBidXkgZmlyc3QgaXRlbVxuICAgICAgICAgICAgICAgIGlmIChidXlpbmdSb290a2l0cyAmJiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSA+IGNvc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlclJvb3RraXRzLnB1c2gobmFtZSArIFwifFwiICsgZSk7XG4gICAgICAgICAgICAgICAgICAgIG5zLmdhbmcucHVyY2hhc2VFcXVpcG1lbnQobmFtZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghbWVtYmVyUm9vdGtpdHMuaW5jbHVkZXMobmFtZSArIFwifFwiICsgZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBidXkgbmV3IGl0ZW1cbiAgICAgICAgICAgICAgICBpZiAoYnV5aW5nUm9vdGtpdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyUm9vdGtpdHMucHVzaChuYW1lICsgXCJ8XCIgKyBlKTtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoXCIgICAoXCIgKyBuYW1lICsgXCIpIGJ1eWluZyA6ICdcIiArIGUgKyBcIicgZm9yICRcIiArIGNvc3QpO1xuICAgICAgICAgICAgICAgICAgICBucy5nYW5nLnB1cmNoYXNlRXF1aXBtZW50KG5hbWUsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU0hPVyBJTlZFTlRPUllcbiAgICAgICAgdmFyIG1lbWJlckhhY2tBdWdzQ291bnQgPSAwO1xuICAgICAgICB2YXIgbWVtYmVyQ3JpbWVBdWdzQ291bnQgPSAwO1xuICAgICAgICB2YXIgbWVtYmVyV2VhcG9uc0NvdW50ID0gMDtcbiAgICAgICAgdmFyIG1lbWJlckFybW9yQ291bnQgPSAwO1xuICAgICAgICB2YXIgbWVtYmVyVmVoaWNsZXNDb3VudCA9IDA7XG4gICAgICAgIHZhciBtZW1iZXJSb290a2l0c0NvdW50ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbWJlckhhY2tBdWdzLmxlbmd0aDsgKytpKSB7IGlmIChtZW1iZXJIYWNrQXVnc1tpXS50b1N0cmluZygpLmluY2x1ZGVzKG5hbWUpKSB7IG1lbWJlckhhY2tBdWdzQ291bnQrKzsgfSB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtYmVyQ3JpbWVBdWdzLmxlbmd0aDsgKytpKSB7IGlmIChtZW1iZXJDcmltZUF1Z3NbaV0udG9TdHJpbmcoKS5pbmNsdWRlcyhuYW1lKSkgeyBtZW1iZXJDcmltZUF1Z3NDb3VudCsrOyB9IH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1iZXJXZWFwb25zLmxlbmd0aDsgKytpKSB7IGlmIChtZW1iZXJXZWFwb25zW2ldLnRvU3RyaW5nKCkuaW5jbHVkZXMobmFtZSkpIHsgbWVtYmVyV2VhcG9uc0NvdW50Kys7IH0gfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbWJlckFybW9yLmxlbmd0aDsgKytpKSB7IGlmIChtZW1iZXJBcm1vcltpXS50b1N0cmluZygpLmluY2x1ZGVzKG5hbWUpKSB7IG1lbWJlckFybW9yQ291bnQrKzsgfSB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtYmVyVmVoaWNsZXMubGVuZ3RoOyArK2kpIHsgaWYgKG1lbWJlclZlaGljbGVzW2ldLnRvU3RyaW5nKCkuaW5jbHVkZXMobmFtZSkpIHsgbWVtYmVyVmVoaWNsZXNDb3VudCsrOyB9IH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1iZXJSb290a2l0cy5sZW5ndGg7ICsraSkgeyBpZiAobWVtYmVyUm9vdGtpdHNbaV0udG9TdHJpbmcoKS5pbmNsdWRlcyhuYW1lKSkgeyBtZW1iZXJSb290a2l0c0NvdW50Kys7IH0gfVxuXG4gICAgICAgIGlmIChtZW1iZXJIYWNrQXVnc0NvdW50ICsgbWVtYmVyQ3JpbWVBdWdzQ291bnQgKyBtZW1iZXJXZWFwb25zQ291bnQgKyBtZW1iZXJBcm1vckNvdW50ICsgbWVtYmVyVmVoaWNsZXNDb3VudCArIG1lbWJlclJvb3RraXRzQ291bnQgPT0gMzIpIHtcbiAgICAgICAgICAgIG1lbWJlclByZXBwZWQucHVzaChuYW1lKTsgLy8gQWRkIG1lbWJlciB0byBsaXN0IG9mIGNvbXBsZXRlZCBwcmVwcGVkIG5hbWVzLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbnMucHJpbnQoXCIgICBcIiArIG5hbWUgKyBcIiBbZXF1aXBtZW50L2F1Z3M6IFwiXG4gICAgICAgICAgICAgICAgKyBtZW1iZXJIYWNrQXVnc0NvdW50ICsgXCIgfCBcIlxuICAgICAgICAgICAgICAgICsgbWVtYmVyQ3JpbWVBdWdzQ291bnQgKyBcIiB8IFwiXG4gICAgICAgICAgICAgICAgKyBtZW1iZXJXZWFwb25zQ291bnQgKyBcIiB8IFwiXG4gICAgICAgICAgICAgICAgKyBtZW1iZXJBcm1vckNvdW50ICsgXCIgfCBcIlxuICAgICAgICAgICAgICAgICsgbWVtYmVyVmVoaWNsZXNDb3VudCArIFwiIHwgXCJcbiAgICAgICAgICAgICAgICArIG1lbWJlclJvb3RraXRzQ291bnQgKyBcIl1cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdHRlbXB0IHRvIGFzc2lnbiBHYW5nIE1lbWJlciBzcGVjaWZpZWQgdGFza3NcbiAgICBmdW5jdGlvbiBHaXZlQXNzaWdubWVudHMobWVtYmVyLCBoYWNrU2tpbGxMZXZlbCkge1xuXG4gICAgICAgIC8vIGhhY2tTa2lsbExldmVsIGlzIGp1c3QgJ21lbWJlckluZm8uaGFja2luZycgcGFzc2VkIGluLlxuXG4gICAgICAgIHZhciBnYW5nSW5mbyA9IG51bGw7XG4gICAgICAgIHZhciBnYW5nSW5mbyA9IG5zLmdhbmcuZ2V0R2FuZ0luZm9ybWF0aW9uKCk7XG5cbiAgICAgICAgdmFyIG1lbWJlckluZm8gPSBudWxsO1xuICAgICAgICB2YXIgbWVtYmVySW5mbyA9IG5zLmdhbmcuZ2V0TWVtYmVySW5mb3JtYXRpb24obWVtYmVyKTtcblxuICAgICAgICB2YXIgd2FudGVkTGV2ZWwgPSBtZW1iZXJJbmZvLndhbnRlZExldmVsR2FpbjtcbiAgICAgICAgdmFyIGVhcm5lZFJlc3BlY3QgPSBtZW1iZXJJbmZvLmVhcm5lZFJlc3BlY3Q7XG5cbiAgICAgICAgLy8gR0VUIFNUQVRTXG4gICAgICAgIG1lbWJlclN0YXRzLnB1c2gobWVtYmVyICsgXCJ8XCIgKyB3YW50ZWRMZXZlbCk7XG4gICAgICAgIG1lbWJlclN0YXRzLnB1c2gobWVtYmVyICsgXCJ8XCIgKyBlYXJuZWRSZXNwZWN0KTtcblxuICAgICAgICAvLyBIQUNLSU5HXG4gICAgICAgIHZhciB0YXNrID0gXCJcIjtcbiAgICAgICAgLy8gdmFyIHN0YXRzVGFyZ2V0ID0gNTA7IC8vIHN0cmVuZ3RoLCBhZ2lsaXR5LCBjaGFyaXNtYSwgZGVmZW5zZVxuICAgICAgICAvLyB2YXIgc3RhdHNUYXJnZXRIYWNraW5nID0gNTAwOyAvLyBoYWNraW5nXG4gICAgICAgIC8vIHZhciBzdGF0c1RhcmdldFJlc3BlY3QgPSAxMDAwMDsgLy8gcmVzcGVjdFxuXG4gICAgICAgIGlmIChvdmVycmlkZVRhc2sgIT0gXCJcIikge1xuICAgICAgICAgICAgdGFzayA9IG92ZXJyaWRlVGFzazsgLy8gR1JBQiBPVkVSUklERSBUQVNLXG4gICAgICAgICAgICAvLyBUZXJyaXRvcnkgV2FyZmFyZSFcbiAgICAgICAgICAgIGlmIChvdmVycmlkZVRhc2sgPT0gXCJUZXJyaXRvcnkgV2FyZmFyZVwiICYmIGVhcm5lZFJlc3BlY3QgPiAxMDAwMCkge1xuXG4gICAgICAgICAgICAgICAgLy8gQVNTSUdOIFRBU0tcbiAgICAgICAgICAgICAgICBpZiAobnMuZ2FuZy5zZXRNZW1iZXJUYXNrKG1lbWJlciwgdGFzaykpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyU3RhdHMucHVzaChtZW1iZXIgKyBcInxcIiArIHRhc2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIEdFVCBPVVQuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTk9UIFBPV0VSRlVMIEVOT1VHSCBGT1IgV0FSRkFSRS4gU08sIElHTk9SRSAnVGVycml0b3J5IFdhcmZhcmUnLCBETyBTRU9NVEhJTkcgRUxTRS4uLiAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3ZlcnJpZGVUYXNrID09IFwiVGVycml0b3J5IFdhcmZhcmVcIiAmJiBlYXJuZWRSZXNwZWN0IDwgMTAwMDApIHtcblxuICAgICAgICAgICAgICAgIC8vIFRISVMgSVMgTk9OLU5FR09USUFCTEUuIElGIEhBQ0sgTEVWRUwgSVMgPCA1MDAsIFdFIFJFUVVJUkUgU1RSSUNUIFRSQUlOSU5HLiBcbiAgICAgICAgICAgICAgICAvLyBJR05PUkUgQUxMIE9USEVSIEpPQlMvVEFTS1MuXG4gICAgICAgICAgICAgICAgLy8gVFJBSU5cbiAgICAgICAgICAgICAgICBpZiAoaGFja1NraWxsTGV2ZWwgPCA0MDAgJiYgZWFybmVkUmVzcGVjdCA8IDUwMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBcmUgd2UgYSBIYWNraW5nIGdhbmc/IFxuICAgICAgICAgICAgICAgICAgICAvLyBUUkFJTiBIQUNLSU5HXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW5nSW5mby5pc0hhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sgPSB0cmFpbmluZ1sxXTsgLy8gVHJhaW4gQ29tYmF0IDAsIFRyYWluIEhhY2tpbmcgMSwgVHJhaW4gQ2hhcmlzbWEgMlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIEFyZSB3ZSBhIENvbWJhdCBnYW5nPyBcbiAgICAgICAgICAgICAgICAgICAgLy8gVFJBSU4gQ09NQkFUXG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2FuZ0luZm8uaXNIYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0gdHJhaW5pbmdbMF07IC8vIFRyYWluIENvbWJhdCAwLCBUcmFpbiBIYWNraW5nIDEsIFRyYWluIENoYXJpc21hIDJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBBU1NJR04gVFJBSU5JTkcgdGFza1xuICAgICAgICAgICAgICAgICAgICBpZiAobnMuZ2FuZy5zZXRNZW1iZXJUYXNrKG1lbWJlciwgdGFzaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbWJlclN0YXRzLnB1c2gobWVtYmVyICsgXCJ8XCIgKyB0YXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gR0VUIE9VVC5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBET04nVCBUUkFJTi4gVE9PIEVYUEVSSUVOQ0VELlxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2FudGVkTGV2ZWwgPj0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERFQ1JFQVNFIFdBTlRFRCBMRVZFTFxuICAgICAgICAgICAgICAgICAgICB0YXNrID0gdG9wVmlydHVvdXNbZ2V0UmFuZG9tSW50KHRvcFZpcnR1b3VzLmxlbmd0aCldOyAvLyBFdGhpY2FsIEhhY2tpbmcsIFZpZ2lsYW50ZSBKdXN0aWNlICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVhcm5lZFJlc3BlY3QgPCAxMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEJVSUxEIFJFU1BFQ1RcbiAgICAgICAgICAgICAgICAgICAgdGFzayA9IHRvcFJlc3BlY3RbZ2V0UmFuZG9tSW50KHRvcFJlc3BlY3QubGVuZ3RoKV07IC8vIEN5YmVydGVycm9yaXNtLCBERG9TIEF0dGFja3MsIFBsYW50IFZpcnVzLCBNb25leSBMYXVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRUFSTiBNT05FWVx0XHRcdFx0XG4gICAgICAgICAgICAgICAgICAgIHRhc2sgPSB0b3BFYXJuZXJzW2dldFJhbmRvbUludCh0b3BFYXJuZXJzLmxlbmd0aCldOyAvLyBSYW5zb213YXJlLCBQaGlzaGluZywgSWRlbnRpdHkgVGhlZnQsIEZyYXVkICYgQ291bnRlcmZlaXRpbmcsIE1vbmV5IExhdW5kZXJpbmdcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBU1NJR04gTk9OLVRSQUlOSU5HIFRBU0tcbiAgICAgICAgICAgICAgICBpZiAobnMuZ2FuZy5zZXRNZW1iZXJUYXNrKG1lbWJlciwgdGFzaykpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyU3RhdHMucHVzaChtZW1iZXIgKyBcInxcIiArIHRhc2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIEdFVCBPVVQuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG92ZXJyaWRlVGFzayAhPSBcIlRlcnJpdG9yeSBXYXJmYXJlXCIpIHtcblxuICAgICAgICAgICAgICAgIC8vIFRZUEVcbiAgICAgICAgICAgICAgICBpZiAob3ZlcnJpZGUgPT0gXCJyZXNwZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzayA9IHRvcFJlc3BlY3RbZ2V0UmFuZG9tSW50KHRvcFJlc3BlY3QubGVuZ3RoKV07IC8vIEN5YmVydGVycm9yaXNtLCBERG9TIEF0dGFja3MsIFBsYW50IFZpcnVzLCBNb25leSBMYXVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcImVhcm5cIikge1xuICAgICAgICAgICAgICAgICAgICB0YXNrID0gdG9wRWFybmVyc1tnZXRSYW5kb21JbnQodG9wRWFybmVycy5sZW5ndGgpXTsgLy8gUmFuc29td2FyZSwgUGhpc2hpbmcsIElkZW50aXR5IFRoZWZ0LCBGcmF1ZCAmIENvdW50ZXJmZWl0aW5nLCBNb25leSBMYXVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcImRlY3JlYXNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzayA9IHRvcFZpcnR1b3VzW2dldFJhbmRvbUludCh0b3BWaXJ0dW91cy5sZW5ndGgpXTsgLy8gRXRoaWNhbCBIYWNraW5nLCBWaWdpbGFudGUgSnVzdGljZSAgXG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG92ZXJyaWRlID09IFwiY2hhcmlzbWFcIikge1xuICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGFzayA9IHRyYWluaW5nWzJdOyAvLyBUcmFpbiBDb21iYXQgMCwgVHJhaW4gSGFja2luZyAxLCBUcmFpbiBDaGFyaXNtYSAyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcImhhY2tpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGFzayA9IHRyYWluaW5nWzFdOyAvLyBUcmFpbiBDb21iYXQgMCwgVHJhaW4gSGFja2luZyAxLCBUcmFpbiBDaGFyaXNtYSAyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVycmlkZSA9PSBcImNvbWJhdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sgPSB0YXNrID0gdHJhaW5pbmdbMF07IC8vIFRyYWluIENvbWJhdCAwLCBUcmFpbiBIYWNraW5nIDEsIFRyYWluIENoYXJpc21hIDJcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBU1NJR04gVEFTS1xuICAgICAgICAgICAgICAgIGlmIChucy5nYW5nLnNldE1lbWJlclRhc2sobWVtYmVyLCB0YXNrKSkge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJTdGF0cy5wdXNoKG1lbWJlciArIFwifFwiICsgdGFzayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gR0VUIE9VVC5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUSElTIElTIE5PTi1ORUdPVElBQkxFLiBJRiBIQUNLIExFVkVMIElTIDwgNTAwLCBXRSBSRVFVSVJFIFNUUklDVCBUUkFJTklORy4gXG4gICAgICAgIC8vIElHTk9SRSBBTEwgT1RIRVIgSk9CUy9UQVNLUy5cblxuICAgICAgICAvLyBUUkFJTlxuICAgICAgICBpZiAoaGFja1NraWxsTGV2ZWwgPCA0MDAgJiYgZWFybmVkUmVzcGVjdCA8IDUwMCkge1xuICAgICAgICAgICAgLy8gQXJlIHdlIGEgSGFja2luZyBnYW5nPyBcbiAgICAgICAgICAgIC8vIFRSQUlOIEhBQ0tJTkdcbiAgICAgICAgICAgIGlmIChnYW5nSW5mby5pc0hhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gdHJhaW5pbmdbMV07IC8vIFRyYWluIENvbWJhdCAwLCBUcmFpbiBIYWNraW5nIDEsIFRyYWluIENoYXJpc21hIDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFyZSB3ZSBhIENvbWJhdCBnYW5nPyBcbiAgICAgICAgICAgIC8vIFRSQUlOIENPTUJBVFxuICAgICAgICAgICAgaWYgKCFnYW5nSW5mby5pc0hhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0YXNrID0gdHJhaW5pbmdbMF07IC8vIFRyYWluIENvbWJhdCAwLCBUcmFpbiBIYWNraW5nIDEsIFRyYWluIENoYXJpc21hIDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFTU0lHTiBUUkFJTklORyB0YXNrXG4gICAgICAgICAgICBpZiAobnMuZ2FuZy5zZXRNZW1iZXJUYXNrKG1lbWJlciwgdGFzaykpIHtcbiAgICAgICAgICAgICAgICBtZW1iZXJTdGF0cy5wdXNoKG1lbWJlciArIFwifFwiICsgdGFzayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBHRVQgT1VULlxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHdhbnRlZExldmVsID49IDEwMCkge1xuICAgICAgICAgICAgLy8gREVDUkVBU0UgV0FOVEVEIExFVkVMXG4gICAgICAgICAgICB0YXNrID0gdG9wVmlydHVvdXNbZ2V0UmFuZG9tSW50KHRvcFZpcnR1b3VzLmxlbmd0aCldOyAvLyBFdGhpY2FsIEhhY2tpbmcsIFZpZ2lsYW50ZSBKdXN0aWNlICBcbiAgICAgICAgfSBlbHNlIGlmIChlYXJuZWRSZXNwZWN0IDwgMTAwMCkge1xuICAgICAgICAgICAgLy8gQlVJTEQgUkVTUEVDVFxuICAgICAgICAgICAgdGFzayA9IHRvcFJlc3BlY3RbZ2V0UmFuZG9tSW50KHRvcFJlc3BlY3QubGVuZ3RoKV07IC8vIEN5YmVydGVycm9yaXNtLCBERG9TIEF0dGFja3MsIFBsYW50IFZpcnVzLCBNb25leSBMYXVuZGVyaW5nXG4gICAgICAgIH0gZWxzZSBpZiAoZWFybmVkUmVzcGVjdCA+IDEwMDApIHtcbiAgICAgICAgICAgIC8vIEVBUk4gTU9ORVlcdFx0XHRcdFxuICAgICAgICAgICAgdGFzayA9IHRvcEVhcm5lcnNbZ2V0UmFuZG9tSW50KHRvcEVhcm5lcnMubGVuZ3RoKV07IC8vIFJhbnNvbXdhcmUsIFBoaXNoaW5nLCBJZGVudGl0eSBUaGVmdCwgRnJhdWQgJiBDb3VudGVyZmVpdGluZywgTW9uZXkgTGF1bmRlcmluZ1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQVNTSUdOIE5PTi1UUkFJTklORyBUQVNLXG4gICAgICAgIGlmIChucy5nYW5nLnNldE1lbWJlclRhc2sobWVtYmVyLCB0YXNrKSkge1xuICAgICAgICAgICAgbWVtYmVyU3RhdHMucHVzaChtZW1iZXIgKyBcInxcIiArIHRhc2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbnMucHJpbnQoXCIgICB1bmFibGUgdG8gYXNzaWduIFwiICsgbWVtYmVyICsgXCIgd2l0aCBcIiArIHRhc2sgKyBcIlxcblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1hdGguZmxvb3IobWF4KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRm9ybWF0TnVtYmVyKG51bSkge1xuICAgICAgICBsZXQgc3ltYm9scyA9IFtcIlwiLCBcIktcIiwgXCJNXCIsIFwiQlwiLCBcIlRcIiwgXCJRYVwiLCBcIlFpXCIsIFwiU3hcIiwgXCJTcFwiLCBcIk9jXCJdO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoOyAobnVtID49IDEwMDApICYmIChpIDwgc3ltYm9scy5sZW5ndGgpOyBpKyspIG51bSAvPSAxMDAwO1xuXG4gICAgICAgIHJldHVybiAoKE1hdGguc2lnbihudW0pIDwgMCkgPyBcIi0kXCIgOiBcIiRcIikgKyBudW0udG9GaXhlZCgzKSArIHN5bWJvbHNbaV07XG4gICAgfVxuXG59Il19