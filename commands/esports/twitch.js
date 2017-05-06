const streamsEmbed = require("../../embeds/streams");

const subcommands = {
    clip: async function(ctx) {
        try {
            let clips = await ctx.client.redis.getAsync("twitch:clips");
            clips = JSON.parse(clips).clips;

            let clip = clips[Math.floor(Math.random() * clips.length)];

            return ctx.send([
                `**${clip.broadcaster.display_name}** playing **Dota 2**, clipped by **${clip.curator.display_name}**, duration **${Math.ceil(clip.duration)} seconds**`,
                clip.url
            ].join("\n"));
        } catch (err) {
            console.error(err);
            return ctx.send("Something went wrong.")
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

            let embed = streamsEmbed(localstreams.slice(0, 5));
            return ctx.embed(embed);
        } catch (err) {
            console.error(err);
            return ctx.send("Something went wrong.");
        }
    }
};

async function exec(ctx) {
    let subcommand = ctx.options.splice(0, 1)[0];

    if (subcommands.hasOwnProperty(subcommand)) {
        return subcommands[subcommand](ctx);
    } else {
        return ctx.send(`Available subcommands: ${Object.keys(subcommands).map(cmd => `\`${cmd}\``).join(", ")}`);
    }
}

module.exports = {
    name: "twitch",
    category: "esports",
    typing: true,
    exec
};
