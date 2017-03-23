const util = require("util");

const clean = (text) => {
    if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
};

module.exports = (message, client, helper) => {
    let params = message.content.split(" ").splice(1);

    if (message.member.id == client.config.owner) {
        try {
            var code = params.join(" ");
            var evaled = eval(code);
            Promise.resolve(evaled).then(evaled => {
                if (typeof evaled !== "string") evaled = util.inspect(evaled);

                message.channel.createMessage(`${"```js\n"}${clean(evaled)}${"\n```"}`).then(() => {
                    util.log(clean(evaled));
                }).catch(err => {
                    message.channel.createMessage({ "content": message.content, "embed": { "description": "`err: bad request probably`" } });
                });
            })
        } catch (err) {
            message.channel.createMessage(`${"`ERROR`\n```js\n"}${clean(err)}${"\n```"}`).then(() => {
                util.log(clean(err));
            }).catch(e_err => helper.handle(message, e_err));
        }
    }
};