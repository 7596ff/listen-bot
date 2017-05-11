const searchMembers = require("./searchMembers");

async function eat(content, options, members) {
    let flags = Object.keys(options);
    let containsMember = flags.map((flag) => options[flag]).includes("member");
    if (containsMember && members === undefined) {
        return Promise.reject("no members provided to search through");
    }

    let result = {};

    for (flag of flags) {
        let split = content.split(" ");
        if (!split.includes(flag)) continue;

        let match = split.slice(split.indexOf(flag) + 1);
        let otherFlags = new Array(match.length).fill(false);
        for (otherFlag of flags) {
            if (otherFlag === flag) continue;
            if (~match.indexOf(otherFlag)) otherFlags[match.indexOf(otherFlag)] = otherFlag;
        }

        let isThereOtherFlag = otherFlags.find((flag) => flag);
        if (isThereOtherFlag) {
            let lastIndex = otherFlags.indexOf(isThereOtherFlag);
            if (lastIndex) match = match.slice(0, lastIndex);
        }

        if (options[flag] === "string") {
            result[flag] = match.join(" ");
        } else if (options[flag] === "member") {
            result[flag] = await searchMembers(members, match);
        }
    }

    return Promise.resolve(result);
}

module.exports = eat;
