class Unwatcher {
    constructor(message, client, helper, list) {
        this._message = message;
        this._client = client;
        this._helper = helper;
        this._list = list;
        this.timeout = setTimeout(() => {
            this._message.channel.createMessage(":x: No response detected, exiting.");
            delete this._client.unwatchers[`${message.channel.id}:${message.author.id}`];
        }, 60000);
    }

    handle(string) {
        let index = parseInt(string);
        if (this._list[index] !== undefined) {
            let split = this._list[index].split(":");
            this._client.pg.query({
                "text": "DELETE FROM subs WHERE owner = $1 AND type = $2 AND value = $3;",
                "values": [this._message.author.id, split[0], split[1]]
            }).catch((err) => console.error(err)).then((res) => {
                let gone = this._list.splice(index)[0];
                this._message.channel.createMessage(`:white_check_mark: Unsubscribed from feed \`${gone}\`.`)
                    .catch((err) => this._helper.log(this._message, err))
                    .then(() => {
                        this._helper.log(this._message, "unsubscribed from something");
                        clearTimeout(this.timeout);
                        delete this._client.unwatchers[`${this._message.channel.id}:${this._message.author.id}`];
                    });
            });
        } else {
            this._message.channel.createMessage(`:x: Index out of range. Try a different number.`)
                .catch((err) => this._helper.handle(this._message, err));
        }
    }
}

module.exports = Unwatcher;
