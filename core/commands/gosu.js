const bluebird = require("bluebird");
const gg = bluebird.promisifyAll(require("gosugamers-api"));
const pad = require("pad");

let subcommands = {
    "list": async function(message, client, helper) {
        try {
            let matches = await gg.fetchMatchUrlsAsync("dota2");

            if (matches.length < 1) {
                message.channel.createMessage("Couldn't find enough matches to display.");
                return;
            }

            let matchinfos = await gg.parseMatchesAsync(matches);

            matchinfos = matchinfos.filter((match) => {
                if (!match) return false; // what
                if (match.datetime * 1000 >= Date.now()) return true;
            }).sort((a, b) => a.datetime - b.datetime).slice(0, 8);

            let matchlist = [["Home", "\u2000", "Away", "Rounds", "\u2000"]];
            let fmatchlist = [];
            let highest = new Array(matchlist[0].length).fill(0);

            matchinfos.forEach(match => {
                let row = [
                    match.home.name,
                    "vs",
                    match.away.name,
                    match.rounds,
                    `[${new Date(match.datetime * 1000).toDateString()}](${match.url})`
                ];
                
                for (let val in row) {
                    if (highest[val] <= row[val].length) {
                        highest[val] = row[val].length;
                    }
                }

                matchlist.push(row);
            });

            matchlist.forEach((row) => {
                for (let item in row) {
                    if (item != row.length - 1) {
                        row[item] = pad(row[item], highest[item], "\u2000");
                    }
                }
                fmatchlist.push(row);
            });

            await message.channel.createMessage({
                "embed": {
                    "description": fmatchlist.map(match => `\`${match.slice(0, -1).join("\u2000\u2000")}\` ${match[match.length - 1]}`).join("\n")
                }
            });
        } catch (err) {
            helper.log(message, "something with gosugamers");
            helper.log(message, err);
            console.log(err)
            message.channel.createMessage("Something went wrong fetching from GosuGamers.").catch((err) => helper.handle(err));
        }
    }
};

async function gosu(message, client, helper) {
    let subcommand = message.content.split(" ").slice(1)[0];

    if (subcommands.hasOwnProperty(subcommand)) {
        subcommands[subcommand](message, client, helper);
    } else {
        message.channel.createMessage(`Available subcommands: ${Object.keys(subcommands).map(cmd => `\`${cmd}\``).join(", ")}`).catch((err) => helper.handle(err));
    }
}

module.exports = gosu;