const statsEmbed = require("../../templates/stats");

async function exec(ctx) {
    try {
        let embed = await statsEmbed(ctx.client);
        return ctx.embed(embed);
    } catch (err) {
        console.error(err);
        return ctx.send("Something went horribly wrong.");
    }
}

module.exports = {
    name: "botstats",
    category: "meta",
    exec
};
