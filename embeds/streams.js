function streamsEmbed(streams) {
    return {
        "title": `Top 5 streams of Dota 2 in ${streams[0].channel.language.toUpperCase()}`,
        "fields": [{
            "name": "Title",
            "value": streams.map((stream) => {
                let status = stream.channel.status;
                return str = (status.length > 20 ? `${status.slice(0, 20).trim()}...` : status) + "\u2000\u2000";
            }).join("\n"),
            "inline": true
        }, {
            "name": "Streamer",
            "value": streams.map((stream) => `[${stream.channel.display_name}](${stream.channel.url})`).join("\n"),
            "inline": true
        }, {
            "name": "Viewers",
            "value": streams.map((stream) => stream.viewers).join("\n"),
            "inline": true
        }],
        "timestamp": new Date()
    };
}

module.exports = streamsEmbed;
