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
    helper.log(message, "evaled");

    if (message.member.id == client.config.owner) {
        try {
            var code = params.join(" ");
            var evaled = eval(code);
            Promise.resolve(evaled).then(evaled => {
                if (typeof evaled !== "string") evaled = util.inspect(evaled);

                message.channel.createMessage(`${"```js\n"}${clean(evaled)}${"\n```"}`).then(() => {
                    console.log(clean(evaled)); // eslint-disable-line
                }).catch(err => {
                    message.channel.createMessage("result too long for one message.");
                    console.log(clean(evaled)); // eslint-disable-line
                    console.log(err); // eslint-disable-line
                });
            });
        } catch (err) {
            message.channel.createMessage(`${"`ERROR`\n```js\n"}${clean(err)}${"\n```"}`).then(() => {
                console.log(clean(err)); // eslint-disable-line
            }).catch(e_err => {
                message.channel.createMessage("error too long for one message.");
                console.log(clean(err)); // eslint-disable-line
                console.log(e_err); // eslint-disable-line
            });
        }
    }
};
