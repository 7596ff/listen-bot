const needle = require("needle");
const contributors = require("../../contributors.json");

async function exec(ctx) {
    let locale = ctx.client.core.locale[ctx.gcfg.locale].com.info;

    needle.get("https://api.github.com/repos/bippum/listen-bot/commits", (err, response) => {
        let user_me = ctx.client.users.get(ctx.client.config.owner);
        let me = ctx.guild.members.has(ctx.client.config.owner) ? `<@${ctx.client.config.owner}>` : `${user_me.username}#${user_me.discriminator}`;

        let desc = ctx.client.sprintf(locale.me, me);
        let links = [":page_facing_up: [GitHub](https://github.com/bippum/listen-bot)",
            `<:botTag:230105988211015680> [${locale.onlinehelp}](https://bots.discord.pw/bots/240209888771309568)`,
            `:link: [${locale.invitelink}](https://discordapp.com/oauth2/authorize?permissions=${ctx.client.config.permissions}&scope=bot&client_id=${ctx.client.user.id})`,
            `:information_source: [${locale.helpserver}](${ctx.client.config.discord_invite})`
        ];

        let gitlinks = err ? ["rip github"] : response.body.slice(0, 4).map(commit => {
            let cmsg = commit.commit.message.slice(0, 40).split("\n")[0];
            return `[\`${commit.sha.slice(0, 7)}\`](${commit.html_url}) - ${cmsg}${commit.commit.message.length > 40 ? "..." : ""}`;
        });

        let contribs = [];

        Object.keys(contributors).forEach(key => {
            contribs.push(`**${locale[key]}:** ${contributors[key].join(", ")}`);
        });

        return ctx.embed({
            "timestamp": new Date().toJSON(),
            "description": desc,
            "fields": [{
                "name": locale.githublog,
                "value": gitlinks.join("\n"),
                "inline": true
            }, {
                "name": locale.links,
                "value": links.join("\n"),
                "inline": true
            }, {
                "name": locale.specialthanks,
                "value": contribs.join("\n"),
                "inline": "false"
            }]
        });
    });
}

module.exports = {
    name: "info",
    category: "meta",
    aliases: ["about"],
    exec
};
