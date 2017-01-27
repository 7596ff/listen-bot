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
        client.guilds_list[message.channel.guild.id].prefix = message.content.replace("\"", "");
        write_obj(client.guilds_list, message, helper);
        client.createMessage(message.channel.id, `:ok_hand: prefix set to \`${client.guilds_list[message.channel.guild.id].prefix}\``).then(() => {
            helper.log(message, "changed guild prefix");
        }).catch(err => helper.handle(message, err));
    }
};
