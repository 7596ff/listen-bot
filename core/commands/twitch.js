const subcommands = {
    "clip": async function(message, client, helper) {
        try {
            let clips = await client.redis.getAsync("twitch:clips");
            clips = JSON.parse(clips).clips;

            let clip = clips[Math.floor(Math.random() * clips.length)];

            message.channel.createMessage([
                `**${clip.broadcaster.display_name}** playing **Dota 2**, clipped by **${clip.curator.display_name}**, duration **${Math.ceil(clip.duration)} seconds**`,
                clip.url
            ].join("\n")).catch((err) => helper.handle(message, err)).then(() => {
                helper.log(message, "sent clip");
            });
        } catch (err) {
            helper.log(message, "redis error in clips");
            helper.log(message, err);
        }
    },
    "streams": async function(message, client, helper) {
        let lang = message.content.split(" ").slice(2)[0] || message.gcfg.locale;

        try {
            let streams = await client.redis.getAsync("twitch:streams");
            streams = JSON.parse(streams).streams;

            let localstreams = streams.filter((stream) => stream.channel.language == lang);

            if (localstreams.length < 1) {
                localstreams = streams.filter((stream) => stream.channel.language == "en");
            }

            let embed = await client.core.embeds.streams(localstreams.slice(0, 5));

            message.channel.createMessage({
                "embed": embed
            }).catch((err) => helper.handle(message, err)).then(() => {
                helper.log(message, "sent streams");
            });
        } catch (err) {
            helper.log(message, "redis error in streams");
            helper.log(message, err);
        }
    }
};

async function twitch(message, client, helper) {
    let subcommand = message.content.split(" ").slice(1)[0];

    if (subcommands.hasOwnProperty(subcommand)) {
        subcommands[subcommand](message, client, helper);
    } else {
        message.channel.createMessage(`Available subcommands: ${Object.keys(subcommands).map(cmd => `\`${cmd}\``).join(", ")}`).catch((err) => helper.handle(err));
    }
}

module.exports = twitch;
