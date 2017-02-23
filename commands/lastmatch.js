const matchinfo = require("./matchinfo");
const resolve_dota_id = require("../util/resolve_dota_id");
const search_members = require("../util/search_members");

module.exports = (message, client, helper) => {
    message.channel.sendTyping().then(() => {
        message.content = message.content.replace(/<@[0-9]+>/g, "");
        let options = message.content.split(" ");
        let queries = [];

        if (message.content.match("with")) {
            let found_any = false;

            for (let ping in message.mentions) {
                queries.push(resolve_dota_id(message, message.mentions[ping].id));
                found_any = true;
            }

            let names = options.slice(options.indexOf("with") + 1);
            let results = search_members(message.channel.guild.members, names);
            if (results.length > 0) {
                queries.push(...results.map(result => resolve_dota_id(message, result)));
                found_any = true;
            }

            if (found_any) {
                queries.push(resolve_dota_id(message, message.author.id));
            } else {
                message.channel.createMessage("Couldn't find any server members in your match!").catch(err => helper.handle(message, err));
                return;
            }
        } else if (options.length > 1) {
            let names = options.slice(1);
            let results = search_members(message.channel.guild.members, names);
            if (results.length > 0) {
                queries.push(...results.map(result => resolve_dota_id(message, result)));
            }
        } else {
            queries.push(resolve_dota_id(message, message.author.id));
        }

        Promise.all(queries).then(results => {
            results.forEach(result => {
                if (result.length < 1) {
                    message.channel.createMessage("This user's account is private.").catch(err => helper.handle(message, err));
                    return;
                }
            });

            helper.log(message, `lastmatch: ${results.join(", ")}`);
            client.mika.getPlayerMatches(results[0], {
                "limit": 1,
                "included_account_id": results.slice(1)
            }).then(match => {
                if (match) {
                    let match_id = match[0].match_id;
                    message.content = `matchinfo ${match_id}`;
                    matchinfo(message, client, helper);
                }
            }).catch(err => {
                helper.log(message, err);
                message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
            });
        }).catch(err => {
            if (err.err) {
                message.channel.createMessage(err.text || "Something went wrong.").catch(err => helper.handle(message, err));
                helper.log(message, err.text);
                helper.log(message, err.err);
            } else if (err.text) {
                message.channel.createMessage(err.text).catch(err => helper.handle(message, err));
                helper.log(message, err.log);
            } else {
                message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
                helper.log(message, err);
            }
        });
    });
};
