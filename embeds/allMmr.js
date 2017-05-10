function allMmr(list, members, name) {
    let earliest = list.slice().sort((a, b) => a.sat - b.sat)[0].sat;
    return {
        "author": {
            "name": this.get("mmr_all_title", name)
        },
        "fields": [{
            "name": this.get("mmr_all_players"),
            "value": list.map(row => members.get(row.id).username.slice(0, 16)).join("\n"),
            "inline": true
        }, {
            "name": "Solo",
            "value": list.map(row => row.scr || this.get("matches_match_unknown_player")).join("\n"),
            "inline": true
        }, {
            "name": "Party",
            "value": list.map(row => row.cr || this.get("matches_match_unknown_player")).join("\n"),
            "inline": true
        }],
        "timestamp": new Date(parseInt(earliest)),
        "footer": {
            "text": this.get("prommr_last_updated")
        }
    };
}

module.exports = allMmr;
