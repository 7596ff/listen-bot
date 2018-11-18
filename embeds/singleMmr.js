const snekfetch = require("snekfetch");
const tnhConfig = require("../config.json").thinknohands;

const ranks = {
    "0": "Uncalibrated",

    "10": "Herald",
    "11": "Herald [1]",
    "12": "Herald [2]",
    "13": "Herald [3]",
    "14": "Herald [4]",
    "15": "Herald [5]",
    
    "20": "Guardian",
    "21": "Guardian [1]",
    "22": "Guardian [2]",
    "23": "Guardian [3]",
    "24": "Guardian [4]",
    "25": "Guardian [5]",
    
    "30": "Crusader",
    "31": "Crusader [1]",
    "32": "Crusader [2]",
    "33": "Crusader [3]",
    "34": "Crusader [4]",
    "35": "Crusader [5]",
    
    "40": "Archon",
    "41": "Archon [1]",
    "42": "Archon [2]",
    "43": "Archon [3]",
    "44": "Archon [4]",
    "45": "Archon [5]",
    
    "50": "Legend",
    "51": "Legend [1]",
    "52": "Legend [2]",
    "53": "Legend [3]",
    "54": "Legend [4]",
    "55": "Legend [5]",
    
    "60": "Ancient",
    "61": "Ancient [1]",
    "62": "Ancient [2]",
    "63": "Ancient [3]",
    "64": "Ancient [4]",
    "65": "Ancient [5]",
    
    "70": "Divine",
    "71": "Divine [1]",
    "72": "Divine [2]",
    "73": "Divine [3]",
    "74": "Divine [4]",
    "75": "Divine [5]",

    "80": "Immortal",
    "81": "Immortal",
    "82": "Immortal",
}

async function singleMmr(data) {
    let url = `${tnhConfig.url}/rank?key=${tnhConfig.key}&badge=${data.tier}`;
    if (data.rank) url += `&rank=${data.rank}`;
    let image = await snekfetch.get(url);

    return {
        "file": {
            "name": "rank.png",
            "file": image.body
        },
        "embed": {
            "author": {
                "icon_url": data.member.avatarURL,
                "name": `${data.member.username} is ${data.rank ? "Rank " + data.rank : ranks[data.tier]}`
            },
            "description": [
                `**${this.get("history_with_winloss")}:** ${data.winlose.win}/${data.winlose.lose}`,
                `**${this.get("history_as_games")}:** ${data.winlose.win + data.winlose.lose}`,
                `**${this.get("history_as_winrate")}:** ${Math.round(data.winlose.win / (data.winlose.win + data.winlose.lose) * 10000) / 100}%`
            ].join("\n"),
            "timestamp": new Date(Date.now()),
            "footer": {
                "text": this.get("prommr_last_updated")
            },
            "thumbnail": {
                "url": "attachment://rank.png"
            }
        }
    };
}

module.exports = singleMmr;
