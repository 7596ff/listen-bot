const help = require("../../json/help.json");
var possible = [];
    
for (let cat in help) {
    if (cat != "admin" && cat != "meta") {
        for (let cmd in help[cat]) {
            possible.push(help[cat][cmd].name);
        }
    }
}

module.exports = (message, client, helper) => {
    let to = message.content.split(" ");
    let actual = [];

    for (let candidate in to) {
        if (possible.includes(to[candidate])) actual.push(to[candidate]);
    }

    client.pg.query({
        "text": "SELECT * FROM guilds WHERE id = $1",
        "values": [message.channel.guild.id]
    }).then(res => {
        let disabled = res.rows[0].disabled || {};
        let oldlist = disabled[message.channel.id] || [];
        for (let item in actual) oldlist.push(actual[item]);
        let newlist = oldlist.filter((item, inc, newlist) => newlist.indexOf(item) === inc);
        disabled[message.channel.id] = newlist;

        client.pg.query({
            "text": "UPDATE public.guilds SET disabled = $1 WHERE id = $2",
            "values": [disabled, message.channel.guild.id]
        }).then(() => {
            helper.log(message, `disabled some commands, new list: ${newlist.join(" ")}`);
            let prettylist = newlist.map(item => `\`${item}\``).join(" ");
            prettylist = newlist.length > 0 ? `:ok_hand: All disabled commands in this channel: ${prettylist}` : "No disabled commands in this channel.";
            message.channel.createMessage(prettylist);
        }).catch(err => {
            helper.log(message, "something went wrong with updating guild with disabled list");
            helper.log(message, err);
        });
    }).catch(err => {
        helper.log(message, "something went wrong with selecting guild from DB inside admin");
        helper.log(message, err);
    });
};
