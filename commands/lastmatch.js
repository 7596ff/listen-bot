const matchinfo = require("./matchinfo");
const resolve_dota_id = require("../util/resolve_dota_id");

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
            loop1: for (let i = 0; i <= names.length; i++) {
                loop2: for(let j = 0; j <= names.length; j++) {
                    if (i < j) {
                        let term = names.slice(i, j).join(" ");
                        let search = message.channel.guild.members.find(member => (member.nick || member.username) == term);
                        if (search) {
                            queries.push(resolve_dota_id(message, search.id));
                            found_any = true;
                        }
                    }
                }
            }
            
            if (found_any) queries.push(resolve_dota_id(message, message.author.id));
        } else if (options.length > 1) {
            queries.push(resolve_dota_id(message));
        } else {
            queries.push(resolve_dota_id(message, message.author.id));
        }

        console.log(queries)

        Promise.all(queries).then(results => {
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
                message.channel.createMessage("Something went wrong.");
            });
        }).catch(err => {
            if (err.err) {
                message.channel.createMessage(err.text || "Something went wrong.");
                helper.log(message, err.text);
                helper.log(message, err.err);
            } else if (err.text) {
                message.channel.createMessage(err.text);
                helper.log(message, err.text);
            } else {
                message.channel.createMessage("Something went wrong.");
                helper.log(message, err);
            }
        });
    });
};
