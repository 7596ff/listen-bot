function allMmr(list, members, name) {
    let earliest = list.slice().sort((a, b) => a.sat - b.sat)[0].sat;
    return {
        "author": {
            "name": this.get("mmr_all_title", name)
        },
        "timestamp": new Date(parseInt(earliest)),
        "footer": {
            "text": this.get("prommr_last_updated")
        }
    };
}

module.exports = allMmr;
