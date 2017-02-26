const util = require("util");

class Helper {
    constructor() {
        this.last_guild = "";
        this.last_channel = "";
    }

    log(message, text) {
        if (this.last_guild == message.channel.guild.name) {
            if (this.last_channel == message.channel.name) {
                util.log(`  ${text.toString().trim()}`);
            } else {
                util.log(`${message.channel.name}: ${text.toString().trim()}`);
            }
        } else {
            util.log(`${message.channel.guild.name}/${message.channel.name}: ${text.toString().trim()}`);
        }

        this.last_guild = message.channel.guild.name;
        this.last_channel = message.channel.name;
    }

    handle(message, err) {
        let result = err.toString().split(" ")[1];
        if (result == "400") {
            this.log(message, "probably don't have permissions to embed here");
        } else if (result == "403") {
            this.log(message, "probably don't have permissions to send messages here");
        } else {
            this.log(err.toString());
        }
    }
}

module.exports = Helper;
