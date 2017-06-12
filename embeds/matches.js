const pad = require("pad");
const aliases = require("../json/aliases.json");

function matchesEmbed(ctx, matches) {
    let matchlist = [["Match ID", " ", "Hero", "K/D/A", "Time", "Date"]];
    let fmatchlist = [];
    let highest = new Array(6).fill(0);

    matches.forEach(match => {
        let row = [
            match.match_id.toString(),
            match.player_slot < 5 == match.radiant_win ? "W" : "L",
            aliases.find((hero) => hero.id == match.hero_id).local,
            [match.kills, match.deaths, match.assists].join("/"),
            `${Math.floor(match.duration / 60)}:${("00" + match.duration % 60).substr(-2, 2)}`,
            new Date((match.start_time + match.duration) * 1000).toDateString()
        ];
        
        for (let val in row) {
            if (highest[val] <= row[val].length) {
                highest[val] = row[val].length;
            }
        }

        matchlist.push(row);
    });

    matchlist.forEach(row => {
        for (let item in row) {
            row[item] = pad(row[item], highest[item]);
        }
        fmatchlist.push(row);
    });

    let content = [
        ctx.strings.get("matches_embed_title", ctx.gcfg.prefix),
        ""
    ];

    content.push(...fmatchlist.map((row) => `\`${row.join(" ")}\``));

    return content.join("\n");
}

module.exports = matchesEmbed;
