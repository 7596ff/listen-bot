const util = require("util");

async function checks(client, member) {
    return member.id == client.config.owner;
}

async function exec(ctx) {
    try {
        let evaled = eval(ctx.options.join(" "));
        evaled = await Promise.resolve(evaled);
        if (typeof evaled !== "string") evaled = util.inspect(evaled);

        console.log(evaled);
        ctx.send(`${"```js\n"}${evaled}${"\n```"}`).catch((err) => {
            return ctx.send("result too long for one message");
        });
        return Promise.resolve();
    } catch (evalError) {
        console.error(evalError);
        ctx.send(`${"`ERROR`\n```js\n"}${evalError}${"\n```"}`).catch((err) => {
            return ctx.send("error too long for one message");
        });
        return Promise.resolve();
    }
}

module.exports = {
    name: "eval",
    category: "owner",
    ignoreCooldowns: true,
    checks,
    exec
};
