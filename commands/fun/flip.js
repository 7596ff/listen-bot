async function exec(ctx) {
    let coin = Math.floor(Math.random() * 2);

    return ctx.send(`**${ctx.member.nick || ctx.member.username}** flipped a coin: ***${coin === 0 ? "HEADS" : "TAILS"}***`);
}

module.exports = {
    name: "flip",
    category: "fun",
    exec
}