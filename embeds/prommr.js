function prommr(data) {
    let name = "";
    let url = "";
    if (data.regions.includes(data.region)) {
        name = data.region;
        url = data.region;
    } else {
        if (data.region == "all") {
            name = "all regions";
        } else {
            name = data.region;
        }
    }

    return {
        "author": {
            "name": this.get("prommr_header", name),
            "url": `http://www.dota2.com/leaderboards/#${url}`
        },
        "fields": [{
            "name": this.get("prommr_name"),
            "value": data.leaderboard.slice(0, 10).map((player) => {
                let flag = player.country ? `:flag_${player.country}:` : ":grey_question:";
                let str = `${flag} ${player.team_tag ? player.team_tag + "." : ""}**${player.name}**`;
                return str.replace(/`/g, "'");
            }).join("\n"),
            "inline": true
        }, {
            "name": "Rank",
            "value": data.leaderboard.slice(0, 10).map((player) => `${player.solo_mmr}<:blank:279251926409936896>`).join("\n"),
            "inline": true
        }],
        "timestamp": new Date(data.time_posted * 1000),
        "footer": {
            "text": this.get("prommr_last_updated")
        }
    };
}

module.exports = prommr;
