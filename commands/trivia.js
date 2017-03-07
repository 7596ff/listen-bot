module.exports = (message, client, helper) => {
    const split_content = message.content.split(" ").slice(1)
    const command = split_content[0];
    if (command == "start") {
        if (message.gcfg.trivia == message.channel.id) {
            client.trivia.init(client, message.channel.id);
        } else if (message.gcfg.trivia != 0 && message.gcfg.trivia != message.channel.id) {
            message.channel.createMessage(`Try this command in the trivia channel! <#${message.gcfg.trivia}>`);
        } else {
            message.channel.createMessage(`This server does not have a desginated trivia channel! Try \`${message.gcfg.prefix}help admin trivia\`.`);
        }
    }

    if (command == "stop") {
        // if (!message.member.permission.has("manageMessages")) break;
        if (client.trivia.channels.includes(message.gcfg.trivia)) client.trivia.channels.splice(client.trivia.channels.indexOf(message.gcfg.trivia), 1);
        message.channel.createMessage(":ok_hand: Trivia stopped.").catch(err => helper.handle(message, err));
    }

    if (["top", "leaderboard", "scores", "points"].includes(command)) {
        const subcommand = split_content[1];

        client.pg.query("SELECT * FROM scores ORDER BY score DESC;").then(res => {
            let rows = res.rows;
            let msg = [];
            if (subcommand == "all") {
                msg.push("Top 10 users throughout bot: ");
            } else {
                rows = rows.filter(row => message.channel.guild.members.get(row.id));
                msg.push("Top 10 users in this server: ");
            }
            rows = rows.slice(0, 10);
            msg.push(...rows.map(row => `${client.users.find(user => user.id == row.id).username}: ${row.score}`));
            message.channel.createMessage(msg.join("\n")).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong selecting scores");
            helper.log(message, err);
        });
    }

    if (command == "stats") {
        client.pg.query("SELECT * FROM scores ORDER BY score DESC;").then(res => {
            let embed = {
                "description": [
                    `**Current trivia games running:** ${client.trivia.channels.length}`,
                    `**Total questions:** ${client.trivia.questions.length}`,
                    `**First place:** ${client.users.find(user => user.id == res.rows[0].id).username} - ${res.rows[0].score}`
                ].join("\n"),
                "timestamp": new Date()
            };

            message.channel.createMessage({
                "embed": embed
            }).catch(err => helper.handle(message, err)).then(res => {
                helper.log(message, "sent trivia stats");
            });
        });
    }
};
