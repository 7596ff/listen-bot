async function exec(ctx) {
    return ctx.send(`<https://discordapp.com/oauth2/authorize?permissions=${ctx.client.config.permissions}&scope=bot&client_id=${ctx.client.user.id}>`);
}

module.exports = {
    name: "invite",
    category: "meta",
    exec
};
