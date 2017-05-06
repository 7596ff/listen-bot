const template = require("../../templates/shardinfo");

async function exec(ctx) {
    return ctx.send({
        content: `I am shard ${ctx.guild.shard.id + 1} of ${ctx.client.shards.size}.`,
        embed: {
            description: template(ctx.client)
        }
    });
}

module.exports = {
    name: "shardinfo",
    category: "owner",
    exec
}