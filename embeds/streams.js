function streamsEmbed(streams) {
    return {
        "title": this.get("twitch_streams_heading", streams[0].channel.language.toUpperCase()),
        "fields": [{
            "name": this.get("twitch_streams_title"),
            "value": streams.map((stream) => {
                let status = stream.channel.status;
                return str = (status.length > 20 ? `${status.slice(0, 20).trim()}...` : status) + "\u2000\u2000";
            }).join("\n"),
            "inline": true
        }, {
            "name": this.get("twitch_streams_streamer"),
            "value": streams.map((stream) => `[${stream.channel.display_name}](${stream.channel.url})`).join("\n"),
            "inline": true
        }, {
            "name": this.get("twitch_streams_viewers"),
            "value": streams.map((stream) => stream.viewers).join("\n"),
            "inline": true
        }],
        "timestamp": new Date()
    };
}

module.exports = streamsEmbed;
