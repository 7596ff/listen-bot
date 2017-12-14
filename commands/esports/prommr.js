const prommrEmbed = require("../../embeds/prommr");
const regions = ["americas", "europe", "se_asia", "china"];

async function exec(ctx) {
    if (regions.includes(ctx.options[0])) {
        try {
            let reply = await ctx.client.redis.getAsync(`prommr:${ctx.options[0]}`);
            reply = JSON.parse(reply);
            reply.leaderboard = reply.leaderboard.map((item, index) => {
                item.solo_mmr = index + 1;
                return item;
            });

            reply.region = ctx.options[0];
            reply.regions = regions;

            let embed = prommrEmbed.call(ctx.strings, reply);
            return ctx.embed(embed);
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    } else {
        let promises = regions.map((region) => ctx.client.redis.getAsync(`prommr:${region}`));
        let replies = await Promise.all(promises);
        replies = replies.map((reply) => JSON.parse(reply));

        let all = {
            time_posted: 0,
            region: "all",
            regions
        };

        let leaderboard = [];

        replies.forEach((reply) => {
            reply.leaderboard.forEach((item, index) => {
                item.solo_mmr = index + 1;
                leaderboard.push(item);
            });

            if (all.time_posted === 0 || all.time_posted > reply.time_posted) {
                all.time_posted = reply.time_posted;
            }
        });

        leaderboard.sort((a, b) => a.solo_mmr - b.solo_mmr);

        let filtered;
        if (ctx.options[0]) {
            filtered = leaderboard.filter((row) => row.country == ctx.options[0]);
            all.region = ctx.options[0];
        } else {
            filtered = leaderboard;
        }

        if (filtered.length) {
            all.leaderboard = filtered;
            let embed = prommrEmbed.call(ctx.strings, all);
            return ctx.embed(embed);
        } else {
            let regionsmap = regions.map((region) => `\`${region}\``).join(", ");
            let countries = leaderboard
                .map((row) => row.country)
                .filter((item, index, array) => item && array.indexOf(item) === index)
                .map((country) => `:flag_${country}: \`${country}\``);

            let rows = [];

            while (countries.length && rows.map((row) => row.join(" ")).join("\n").length < 1750) {
                rows.push(countries.splice(0, 8));
            }

            text = [
                ctx.strings.get("prommr_success", regionsmap),
                rows.map((row) => row.join(" ")).join("\n")
            ].join("\n");
            return ctx.send(text);
        }
    }
}

module.exports = {
    name: "prommr",
    category: "esports",
    exec
};
