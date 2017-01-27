const fs = require("fs");

function write_obj(guilds_list, message, helper) {
    fs.writeFile("./json/guilds.json", JSON.stringify(guilds_list), (err) => {
        if (err) {
            helper.log(message, err);
        } else {
            helper.log(message, "  wrote guilds list object successfully");
        }
    }); 
}

module.exports = (message, client, helper) => {
    if (message.content) {
        let to_disable = message.content.split(" ");
        client.guilds_list[message.channel.guild.id].disabled[message.channel.id] 
            = client.guilds_list[message.channel.guild.id].disabled[message.channel.id] 
            ? client.guilds_list[message.channel.guild.id].disabled[message.channel.id] 
            : [];
        var _disabled = client.guilds_list[message.channel.guild.id].disabled[message.channel.id];

        for (let cmd of to_disable) {
            if (_disabled.indexOf(cmd) == -1) {
                _disabled.push(cmd);
            }
        }

        if (_disabled.length > 0) {
            client.guilds_list[message.channel.guild.id].disabled[message.channel.id] = _disabled;
            write_obj(client.guilds_list, message, helper);
            helper.log(message, "disabled some commands");
            client.createMessage(message.channel.id, `:ok_hand: disabled ${_disabled.join(", ")}`);
        }
    } else {
        if (client.guilds_list[message.channel.guild.id].disabled[message.channel.id] 
                && client.guilds_list[message.channel.guild.id].disabled[message.channel.id].length > 0) {
            let send = `List of disabled commands: \`${client.guilds_list[message.channel.guild.id].disabled[message.channel.id].join("\`, \`")}\``;
            client.createMessage(message.channel.id, send).then(() => {
                helper.log(message, "listed disabled commands");
            }).catch(err => helper.handle(message, err));
        } else {
            client.createMessage(message.channel.id, "No disabled commands for this channel.");
        }
    }
};
