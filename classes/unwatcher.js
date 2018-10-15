class Unwatcher {
    constructor(ctx, list) {
        this._ctx = ctx;
        this._list = list;
        this.timeout = setTimeout(() => {
            this._ctx.failure(this._ctx.strings.get("unsub_timeout"));
            delete this._ctx.client.unwatchers[`${ctx.channel.id}:${ctx.author.id}`];
        }, 60000);
    }

    handle(string) {
        let index = parseInt(string);
        if (this._list[index] !== undefined) {
            let split = this._list[index].split(":");
            this._ctx.client.pg.query({
                "text": "DELETE FROM subs WHERE owner = $1 AND type = $2 AND value = $3;",
                "values": [this._ctx.author.id, split[0], split[1]]
            }).catch(this._ctx.error).then((res) => {
                let gone = this._list.splice(index)[0];
                this._ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                    "action": "remove",
                    "type": gone.split(":")[0],
                    "ids": gone.split(":")[1]
                }));
                this._ctx.success(this._ctx.strings.get("unsub_success", gone))
                    .catch(this._ctx.error)
                    .then(() => {
                        clearTimeout(this.timeout);
                        delete this._ctx.client.unwatchers[`${this._ctx.channel.id}:${this._ctx.author.id}`];
                    });
            });
        } else {
            this._ctx.faliure(this._ctx.strings.get("unsub_out_of_range")).catch(this._ctx.error);
        }
    }
}

module.exports = Unwatcher;
