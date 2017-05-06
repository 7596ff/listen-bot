function prommr(data) {
    return {
        "author": data.regions.includes(data.region) ? {
            "name": `Top 10 Players by Solo MMR in ${data.region}`,
            "url": `http://www.dota2.com/leaderboards/#${data.region}`
        } : data.region == "all" ? {
            "name": "Top 10 Players sorted by Solo MMR in all regions",
            "url": "http://www.dota2.com/leaderboards/"
        } : {
            "name": `Top 10 Players sorted by Solo MMR in ${data.region}`,
            "url": "http://www.dota2.com/leaderboards/"
        },
        "fields": [{
            "name": "Name",
            "value": data.leaderboard.slice(0, 10).map((player) => {
                let flag = player.country ? `:flag_${player.country}:` : ":grey_question:";
                let str = `${flag} ${player.name}`;
                return str.replace(/`/g, "'");
            }).join("\n"),
            "inline": true
        }, {
            "name": "Solo MMR",
            "value": data.leaderboard.slice(0, 10).map((player) => `${player.solo_mmr}<:blank:279251926409936896>`).join("\n"),
            "inline": true
        }],
        "timestamp": new Date(data.time_posted * 1000),
        "footer": {
            "text": "Last Updated"
        }
    };
}

module.exports = prommr;