function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function exec(ctx) {
    let min = 1;
    let max = 100;

    if (!isNaN(parseInt(ctx.options[0]))) {
        max = parseInt(ctx.options[0]);
    }

    if (!isNaN(parseInt(ctx.options[1]))) {
        min = max;
        max = parseInt(ctx.options[1]);
    }

    if (!ctx.options[1]) {
        min = 1;
    }

    let msg = await ctx.send("🎰🎰🎰");

    let rand = Math.floor(Math.random() * (max - min)) + min;

    await sleep(1000);

    return msg.edit(`**${ctx.member.nick || ctx.member.username}** rolls (${min}/${max}): \`${rand}\``);
}

module.exports = {
    name: "roll",
    category: "fun",
    exec
}