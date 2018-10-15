const snekfetch = require("snekfetch");
const tnhConfig = require("../config.json").thinknohands;
const aliases = require("../json/aliases.json");

// i lazy
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
    "76": "Divine Elite"
}

async function playerinfoEmbed(player) {
    if (!player.rank_tier) player.rank_tier = 0;
    let url = `${tnhConfig.url}/rank?key=${tnhConfig.key}&badge=${player.rank_tier}`;
    if (player.leaderboard_rank) url += `&rank=${player.leaderboard_rank}`;
    let image = await snekfetch.get(url);

    let winrate = (player.wl.win / (player.wl.win + player.wl.lose));
    winrate = winrate * 10000;
    winrate = Math.round(winrate);
    winrate = winrate / 100;

    let countrycode = player.profile.loccountrycode || "Unknown";
    let flag = countrycode == "Unknown" ? "" : `:flag_${countrycode.toLowerCase()}:`;

    let display_heroes = player.heroes
        .slice(0, 5)
        .map((hero) => {
            let name = aliases.find((alias) => alias.id == hero.hero_id).local;
            let winrate = (hero.win / hero.games);
            winrate = winrate * 10000;
            winrate = Math.round(winrate);
            winrate = winrate / 100;

            return `**${name}**: ${winrate}% with ${hero.games} games`;
        });

    let dotabuff_link = `https://www.dotabuff.com/players/${player.profile.account_id}`;
    let opendota_link = `https://www.opendota.com/players/${player.profile.account_id}`;
    let stratz_link = `https://stratz.com/player/${player.profile.account_id}`;

    return {
        "file": {
            "name": "rank.png",
            "file": image.body
        },
        "embed": {
            "author": {
                "name": player.profile.personaname,
                "icon_url": player.profile.avatarfull
            },
            "fields": [{
                "name": `Medal`,
                "value": player.leaderboard_rank ? "Rank " + player.leaderboard_rank : ranks[player.rank_tier],
                "inline": true
            }, {
                "name": "Wins/Losses",
                "value": `${player.wl.win}/${player.wl.lose} (${winrate}%)`,
                "inline": true
            }, {
                "name": "Country",
                "value": `${flag} ${countrycode}`,
                "inline": true
            }, {
                "name": "Links",
                "value": `[DB](${dotabuff_link}) / [OD](${opendota_link}) / [STRATZ](${stratz_link})`,
                "inline": true
            }, {
                "name": "Top 5 Heroes",
                "value": display_heroes.join("\n"),
                "inline": false
            }],
            "thumbnail": {
                "url": "attachment://rank.png"
            }
        }
    };
}

module.exports = playerinfoEmbed;
