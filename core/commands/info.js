const needle = require("needle");

module.exports = (message, client, helper) => {
    needle.get("https://api.github.com/repos/bippum/listen-bot/commits", (err, response) => {
        let user_me = client.users.get(client.config.owner);
        let me = message.channel.guild.members.has(client.config.owner) ? `<@${client.config.owner}>` : `${user_me.username}#${user_me.discriminator}`;

        let desc = `A Dota 2 related bot. Contact ${me} for support and questions!`;
        let links = [":page_facing_up: [GitHub](https://github.com/bippum/listen-bot)",
            "<:botTag:230105988211015680> [Online Help](https://bots.discord.pw/bots/240209888771309568)",
            `:link: [Invite Link](https://discordapp.com/oauth2/authorize?permissions=${client.config.permissions}&scope=bot&client_id=${client.user.id})`,
            `:information_source: [Help Server](${client.config.discord_invite})`
        ];

        let gitlinks = err ? ["rip github"] : response.body.slice(0, 4).map(commit => {
            let cmsg = commit.commit.message.slice(0, 40).split("\n")[0];
            return `[\`${commit.sha.slice(0, 7)}\`](${commit.html_url}) - ${cmsg}${commit.commit.message.length > 40 ? "..." : ""}`;
        });

        message.channel.createMessage({
            "embed": {
                "timestamp": new Date().toJSON(),
                "description": desc,
                "fields": [{
                    "name": "Github Log",
                    "value": gitlinks.join("\n"),
                    "inline": true
                }, {
                    "name": "Links",
                    "value": links.join("\n"),
                    "inline": true
                }]
            }
        }).then(() => {
            helper.log(message, "sent info message");
        }).catch(err => helper.handle(message, err)); 
    });
};
