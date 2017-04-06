const subcommands = {
    "clip": async function(message, client, helper) {
        try {
            let clips = await client.redis.getAsync("twitch:clips");
            clips = JSON.parse(clips).clips;

            let clip = clips[Math.floor(Math.random() * clips.length)];

            message.channel.createMessage([
                `**${clip.broadcaster.display_name}** playing **Dota 2**, clipped by **${clip.curator.display_name}**, duration **${Math.ceil(clip.duration)} seconds**`,
                clip.url
            ].join("\n")).catch((err) => helper.handle(err));
        } catch (err) {
            helper.log(message, "redis error in clips");
            helper.log(message, err);
            console.log(err)
        }
    },
    "streams": async function(message, client, helper) {

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