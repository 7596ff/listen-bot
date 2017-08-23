class SteppedList {
    constructor(ctx, message, interval, template, headings, body) {
        this.ctx = ctx;
        this.message = message;
        this.template = template;
        this.interval = interval;
        this.headings = headings;
        this.body = body;

        this.step = 0;

        this.delete = setTimeout(() => {
            this.ctx.helper.log(this.ctx.message, `stopped watching ${this.message.id}`);
            delete this.ctx.client.watchers[this.message.id];
        }, 600000);

        Promise.all([
            this.message.addReaction("◀"),
            this.message.addReaction("▶")
        ]).catch((err) => {
            this.ctx.helper.log(`couldn't add reaction to ${this.message.id}`);
        });
    }

    embed(step) {
        let embed = {
            fields: this.headings.map((h, index) => {
                return {
                    name: h,
                    value: this.body[index]
                        .slice(this.interval * this.step)
                        .slice(0, this.interval)
                        .join("\n"),
                    inline: true
                };
            }),
            description: `Page ${this.step + 1}`
        };

        embed = Object.assign(embed, this.template);
        return { embed };
    }

    handle(message, emoji, userID) {
        if (userID !== this.ctx.author.id) return;
        if (!this.message) return;
        emoji = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;

        if (emoji === "◀") {
            if (this.step < 1) return;

            setTimeout(() => {
                this.message.removeReaction("◀", userID).catch((err) => { return; });
                this.step = this.step - 1;
                let embed = this.embed(this.step);
                this.message.edit(embed).catch((err) => { return; });
            }, 250);
        }

        if (emoji === "▶") {
            if ((this.step + 1) * this.interval > this.body[0].length) return;

            setTimeout(() => {
                this.message.removeReaction("▶", userID).catch((err) => { return; });
                this.step = this.step + 1;
                let embed = this.embed(this.step);
                this.message.edit(embed).catch((err) => { return; });
            }, 250);
        }
    }
}

module.exports = SteppedList;
