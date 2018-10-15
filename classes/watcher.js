class Watcher {
    constructor(client, message, userID, behavior, map, start) {
        this.client = client;
        this.message = message;
        this.channelID = message.channel.id;
        this.messageID = message.id;
        this.userID = userID;
        this.behavior = behavior;
        this.map = map;
        this.working = true;
        this.delete = setTimeout(() => {
            this.client.helper.log(this.message, `stopped watching ${this.messageID}`);
            delete client.watchers[this.messageID];
        }, 600000);

        if (this.behavior == "p/n") {
            this.position = start;
            this.previousEmoji = "◀";
            this.nextEmoji = "▶";

            Promise.all([
                this.client.addMessageReaction(this.channelID, this.messageID, this.previousEmoji),
                this.client.addMessageReaction(this.channelID, this.messageID, this.nextEmoji)
            ]).catch((err) => {
                this.client.helper.log(`couldn't add reaction to ${this.messageID}`, err);
                this.working = false;
            });
        }

        this.client.helper.log(this.message, `started watching ${this.messageID}`);
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    edit(emoji, userID) {
        if (this.working === false) return;

        this.client.removeMessageReaction(this.channelID, this.messageID, emoji, userID).catch((err) => {
            this.client.helper.log(this.message, err);
        });
        this.client.editMessage(this.channelID, this.messageID, this.map[this.position]).catch((err) => {
            this.client.helper.handle(this.message, err);
        });
    }

    handle(message, emoji, userID) {
        if (userID !== this.userID) return;
        emoji = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;

        if (this.behavior == "p/n") {
            if (emoji == this.previousEmoji && this.position > 0) {
                this.sleep(250).then(() => {
                    this.position -= 1;
                    this.edit(emoji, userID);
                });
            }

            if (emoji == this.nextEmoji && this.position + 1 < this.map.length) {
                this.sleep(250).then(() => {
                    this.position += 1;
                    this.edit(emoji, userID);
                });
            }
        }
    }
}

module.exports = Watcher;
