const mike = require("../../json/mike.json");

async function exec(ctx) {
    return ctx.send(mike[Math.floor(Math.random() * mike.length)]).then((msg) => {
        if (msg.channel.guild.id == "137589613312081920") msg.addReaction("ixmikeW:256896118380691466");
    });
}

module.exports = {
    name: "mike",
    category: "fun",
    aliases: ["ixmike", "miek"],
    exec
};
