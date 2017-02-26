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
    "Ranked",
    "1v1 Mid",
    "Battle Cup"
];

const skills = [
    "Unknown",
    "Normal",
    "High",
    "Very High"
];

module.exports = (match_data) => {
    let heading = ["Hero", "K/D/A", "LH/D", "HD", "TD", "GPM", "XPM", "\u200b"];
    let table = [];
    let ftable = [];
    let highest = new Array(9).fill(0);

    match_data.players.forEach(player => {
        let row = [od_heroes.find(hero => hero.id == player.hero_id).localized_name,
            `${player.kills}/${player.deaths}/${player.assists}`,
            `${player.last_hits}/${player.denies}`,
            player.hero_damage < 1000 ? player.hero_damage.toString() : `${(player.hero_damage / 1000).toFixed(1)}k`,
            player.tower_damage < 1000 ? player.tower_damage.toString() : `${(player.tower_damage / 1000).toFixed(1)}k`,
            player.gold_per_min.toString(),
            player.xp_per_min.toString(),
            player.mention_str || player.personaname || "Unknown"
        ];

        for (let val in row) {
            if (highest[val] < row[val].length) {
                highest[val] = row[val].length;
            }
        }

        table.push(row);
    });

    table.splice(5, 0, heading);
    table.splice(0, 0, heading);

    table.forEach(row => {
        for (let item in row) {
            row[item] = pad(row[item], highest[item]);
        }
        ftable.push(`\`${row.slice(0, row.length - 1).join(" ")}\`  ${row[row.length - 1]}`);
    });

    let victory = match_data.radiant_win ? "Radiant Victory!" : "Dire Victory!";
    let ptime = `${Math.floor(match_data.duration / 60)}:${("00" + match_data.duration % 60).substr(-2, 2)}`;
    let skill = match_data.skill ? skills[match_data.skill] : skills[0];

    return {
        "title": victory,
        "footer": {
            "text": "Ended"
        },
        "timestamp": new Date((match_data.start_time + match_data.duration) * 1000),
        "fields": [{
            "name": `${match_data.radiant_score} - ${match_data.dire_score}, ${ptime}`,
            "value": match_data.match_id,
            "inline": true
        }, {
            "name": lobby_types[match_data.lobby_type],
            "value": game_modes[match_data.game_mode],
            "inline": true
        }, {
            "name": `${skill} Skill`,
            "value": `[OD](https://www.opendota.com/matches/${match_data.match_id}) / [DB](https://www.dotabuff.com/matches/${match_data.match_id})`,
            "inline": true
        }, {
            "name": "Radiant",
            "value": ftable.slice(0, 6).join("\n"),
            "inline": false
        }, {
            "name": "Dire",
            "value": ftable.slice(6, 12).join("\n"),
            "inline": false
        }]
    };
};
