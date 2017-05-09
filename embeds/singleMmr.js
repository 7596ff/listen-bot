function singleMmr(obj) {
    return {
        "author": {
            "icon_url": obj.member.avatarURL,
            "name": obj.member.username
        },
        "description": [
            `**Solo MMR:** ${obj.scr || this.get("matchinfo_match_unknown_player")}`,
            `**Party MMR:** ${obj.cr || this.get("matchinfo_match_unknown_player")}`
        ].join("\n"),
        "timestamp": new Date(obj.sat ? parseInt(obj.sat) : Date.now()),
        "footer": {
            "text": this.get("prommr_last_updated")
        }
    };
}

module.exports = singleMmr;
