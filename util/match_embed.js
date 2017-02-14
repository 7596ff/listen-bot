const pretty_ms = require("pretty-ms");
const pad = require("pad");

const od_heroes = require("../json/od_heroes.json");

const game_modes = [
    "Unknown",
    "All Pick",
    "Captain's Mode",
    "Random Draft",
    "Single Draft",
    "All Random",
    "Intro", // ???
    "Diretide",
    "Reverse Captain's Mode",
    "Greevling",
    "Tutorial", // k
    "Mid Only",
    "Least Played",
    "Limited Heroes",
    "Compendium Ranked",
    "Custom", 
    "Captian's Draft",
    "Balanced Draft",
    "Ability Draft",
    "Event",
    "ARDM", 
    "1v1 Mid", 
    "All Pick" // ranked all pick
];

const lobby_types = [
    "Normal",
    "Practice",
    "Tournament",
    "Tutorial",
    "Co-op Bots",
    "Team Ranked", 
    "Solo Ranked",
    "Party Ranked",
    "1v1 Mid",
    "Battle Cup"
];

const skills = [
    "Unknown",
    "Normal",
    "High",
    "Very High"
];

module.exports = (match_data, mentions) => {
    let table = [["Hero", "K/D/A", "LH/D", "HD", "HH", "GPM", "XPM", "Name"]];
    let ftable = [];
    let highest = new Array(9).fill(0);

    match_data.players.forEach(player => {
        let row = [od_heroes.find(hero => hero.id == player.hero_id).localized_name,
            `${player.kills}/${player.deaths}/${player.assists}`,
            `${player.last_hits}/${player.denies}`,
            player.hero_damage.toString(),
            player.hero_healing.toString(),
            player.xp_per_min.toString(),
            player.gold_per_min.toString(),
            (player.personaname || "Unknown").slice(0, 15)
        ];

        for (let val in row) {
            if (highest[val] < row[val].length) {
                highest[val] = row[val].length;
            }
        }

        table.push(row);
    });

    table.forEach(row => {
        for (let item in row) {
            row[item] = pad(row[item], highest[item]);
        }
        ftable.push(`\`${row.join(" ")}\``);
    });

    ftable.splice(1, 0, "Radiant");
    ftable.splice(7, 0, "\nDire");

    let victory = match_data.radiant_win ? "Radiant Victory!" : "Dire Victory!";
    let ptime = pretty_ms(match_data.duration * 1000);
    let gametype = `${lobby_types[match_data.lobby_type]} / ${game_modes[match_data.game_mode]}`;
    let skill = match_data.skill ? skills[match_data.skill] : skills[0];
    let mention_str = mentions.length > 0 
        ? `\n\nMembers from this server: ${mentions.map(mention => `<@${mention.discord_id}> (${od_heroes.find(hero => hero.id == mention.hero_id).localized_name})`).join(", ")}` 
        : "";

    return {
        "title": `${victory} ${match_data.radiant_score} - ${match_data.dire_score}, ${ptime}`,
        "fields": [{
            "name": "Lobby Type / Gamemode",
            "value": gametype,
            "inline": true
        }, {
            "name": `Skill: ${skill}`,
            "value": `Match ID: ${match_data.match_id}`,
            "inline": true
        }, {
            "name": "Links",
            "value": `[DB](https://www.dotabuff.com/matches/${match_data.match_id}) / [OD](https://www.opendota.com/matches/${match_data.match_id})`,
            "inline": true
        }, {
            "name": "Stats",
            "value": `${ftable.join("\n")}${mention_str}`,
            "inline": false
        }]
    };
};
