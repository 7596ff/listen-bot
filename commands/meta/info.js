const needle = require("needle");
const contributors = require("../../contributors.json");

async function exec(ctx) {
    needle.get("https://api.github.com/repos/bippum/listen-bot/commits", (err, response) => {
        let user_me = ctx.client.users.get(ctx.client.config.owner);
        let me = ctx.guild.members.has(ctx.client.config.owner) ? `<@${ctx.client.config.owner}>` : `${user_me.username}#${user_me.discriminator}`;

        let desc = ctx.strings.get("info_description", me);

        let links = [
            "https://github.com/bippum/listen-bot",
            "https://bots.discord.pw/bots/240209888771309568",
            `https://discordapp.com/oauth2/authorize?permissions=${ctx.client.config.permissions}&scope=bot&client_id=${ctx.client.user.id}`
        ].map((item, index) => ctx.strings.get(`info_links_${index}`, item));

        let gitlinks = err ? ["rip github"] : response.body.slice(0, 4).map((commit) => {
            let cmsg = commit.commit.message.slice(0, 40).split("\n")[0];
            return `[\`${commit.sha.slice(0, 7)}\`](${commit.html_url}) - ${cmsg}${commit.commit.message.length > 40 ? "..." : ""}`;
        });

        let contribs = Object.keys(contributors).map((key) => `**${ctx.strings.get(key)}:** ${contributors[key].join(", ")}`);

        return ctx.embed({
            "timestamp": new Date().toJSON(),
            "description": desc,
            "fields": [{
                "name": ctx.strings.get("info_github_log"),
                "value": gitlinks.join("\n"),
                "inline": true
            }, {
                "name": ctx.strings.get("info_links"),
                "value": links.join("\n"),
                "inline": true
            }, {
                "name": ctx.strings.get("info_special_thanks"),
                "value": contribs.join("\n"),
                "inline": false
            }, {
                "name": ctx.strings.get("info_links_3"),
                "value": ctx.strings.get("info_help_server_text", ctx.client.config.discord_invite),
                "inline": false
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
