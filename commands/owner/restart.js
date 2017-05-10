const spawn = require("child_process").spawn;

async function checks(client, member) {
    return member.id == client.config.owner;
}

async function exec(ctx) {
    let tasks = [];

    ctx.client.shards.forEach(shard => {
        tasks.push(shard.editStatus("invisible"));
    });

    ctx.client.trivia.channels.forEach(channel => {
        tasks.push(ctx.client.createMessage(channel, ctx.strings.get("restart_trivia_message")));
    });

    await Promise.all(tasks);
    await ctx.send(`${ctx.client.shards.size} invised, ${tasks.length - ctx.client.shards.size} trivia games shut down`);
    await ctx.send(`${tasks.length} tasks complete, restarting`);
    spawn("./update.sh");
}

module.exports = {
    name: "restart",
    category: "owner",
    checks,
    exec
};
