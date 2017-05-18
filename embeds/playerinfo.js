const aliases = require("../json/aliases.json");

function playerinfoEmbed(player) {
    let winrate = (player.wl.win / (player.wl.win + player.wl.lose));
    winrate = winrate * 10000;
    winrate = Math.round(winrate);
    winrate = winrate / 100;

    let countrycode = player.profile.loccountrycode || "Unknown";
    let flag = countrycode == "Unknown" ? "" : `:flag_${countrycode.toLowerCase()}:`;

    let mmr = {};

    if (player.solo_competitive_rank) mmr.solo = player.solo_competitive_rank;
    if (player.competitive_rank) mmr.party = player.competitive_rank;
    if (player.mmr_estimate.estimate) mmr["est."] = player.mmr_estimate.estimate;

    if (!Object.keys(mmr).length) mmr["\u200b"] = "No mmr data found.";

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

    return {
        "title": `Player Stats for ${player.profile.personaname}`,
        "fields": [{
            "name": `MMR: ${Object.keys(mmr).join(" / ")}`,
            "value": Object.values(mmr).join(" / "),
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
            "value": `[DB](${dotabuff_link}) / [OD](${opendota_link}) / [Steam](${player.profile.profileurl})`,
            "inline": true
        }, {
            "name": "Top 5 Heroes",
            "value": display_heroes.join("\n"),
            "inline": false
        }],
        "thumbnail": {
            "url": player.profile.avatarfull
        }
    };
}

module.exports = playerinfoEmbed;
