class Helper {
    constructor() {
        this.last_guild = "";
        this.last_channel = "";
    }

    print(text, type) {
        let now = new Date().toJSON();
        switch (type) {
        case "error":
            console.error(now, text);
            break;
        case "warn":
            console.warn(now, text);
            break;
        default:
            console.log(now, text);
            break;
        }
    }

    log(message, text, type = "log") {
        if (typeof message == "object") {
            if (this.last_guild == message.channel.guild.name) {
                if (this.last_channel == message.channel.name) {
                    this.print(`CMDS:  ${text.toString().trim()}`, type);
                } else {
                    this.print(`CMDS: ${message.channel.name}: ${text.toString().trim()}`, type);
                }
            } else {
                this.print(`CMDS: ${message.channel.guild.name}/${message.channel.name}: ${text.toString().trim()}`, type);
            }

            this.last_guild = message.channel.guild.name;
            this.last_channel = message.channel.name;
        } else {
            this.print(`${message.toUpperCase()}: ${text}`, type);
        }
    }

    handle(message, err) {
        let result = err.toString().split(" ")[1];
        if (result == "400") {
            this.log(message, "probably don't have permissions to embed here", "warn");
        } else if (result == "403") {
            this.log(message, "probably don't have permissions to send messages here", "warn");
        } else {
            this.log(message, err, "error");
        }
    }
}

module.exports = Helper;
