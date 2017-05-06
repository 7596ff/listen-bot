function singleMmr(obj) {
    return {
        "author": {
            "icon_url": obj.member.avatarURL,
            "name": obj.member.username
        },
        "description": [
            `**Solo MMR:** ${obj.scr || "Unknown"}`,
            `**Party MMR:** ${obj.cr || "Unknown"}`
        ].join("\n"),
        "timestamp": new Date(obj.sat ? parseInt(obj.sat) : Date.now()),
        "footer": {
            "text": "Last updated"
        }
    };
}

module.exports = singleMmr;
