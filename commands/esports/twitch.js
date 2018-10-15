const streamsEmbed = require("../../embeds/streams");

const subcommands = {
    clip: async function(ctx) {
        try {
            let clips = await ctx.client.redis.getAsync("twitch:clips");
            clips = JSON.parse(clips).clips;

            let clip = clips[Math.floor(Math.random() * clips.length)];

            return ctx.send([
                ctx.strings.get("twitch_clip", clip.broadcaster.display_name, clip.curator.display_name, Math.ceil(clip.duration)),
                clip.url
            ].join("\n"));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    streams: async function(ctx) {
        let lang = ctx.options[0] || ctx.gcfg.locale;

        try {
            let streams = await ctx.client.redis.getAsync("twitch:streams");
            streams = JSON.parse(streams).streams;

            let localstreams = streams.filter((stream) => stream.channel.language == lang);

            if (localstreams.length < 1) {
                localstreams = streams.filter((stream) => stream.channel.language == "en");
            }

            let embed = streamsEmbed.call(ctx.strings, localstreams.slice(0, 5));
            return ctx.embed(embed);
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    }
};

async function exec(ctx) {
    let subcommand = ctx.options.splice(0, 1)[0];

    if (subcommands.hasOwnProperty(subcommand)) {
        return subcommands[subcommand](ctx);
    } else {
        return ctx.send(ctx.strings.get("bot_available_subcommands", Object.keys(subcommands).map((cmd) => `\`${cmd}\``).join(", ")));
    }
}

module.exports = {
    name: "twitch",
    category: "esports",
    typing: true,
    exec
};
