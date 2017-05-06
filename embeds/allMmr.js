function allMmr(list, members, name) {
    let earliest = list.slice().sort((a, b) => { return a.sat - b.sat; })[0].sat;
    return {
        "author": {
            "name": `Top 15 players sorted by Solo MMR in ${name}`
        },
        "fields": [{
            "name": "Players",
            "value": list.map(row => members.get(row.id).username.slice(0, 16)).join("\n"),
            "inline": true
        }, {
            "name": "Solo",
            "value": list.map(row => row.scr || "Unknown").join("\n"),
            "inline": true
        }, {
            "name": "Party",
            "value": list.map(row => row.cr || "Unknown").join("\n"),
            "inline": true
        }],
        "timestamp": new Date(parseInt(earliest)),
        "footer": {
            "text": "Last updated"
        }
    };
}

module.exports = allMmr;
