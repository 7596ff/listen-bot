const arteezy = require("../../json/arteezy.json");

async function exec(ctx) {
    return ctx.send(arteezy[Math.floor(Math.random() * arteezy.length)]).then((msg) => {
        if (msg.channel.guild.id == "137589613312081920") msg.addReaction("rtzW:302222677991620608");
    });
}

module.exports = {
    name: "arteezy",
    category: "fun",
    aliases: ["rtz"],
    exec
};
