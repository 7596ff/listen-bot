class ReactionChooser {
    constructor(ctx, msg, options) {
        this.ctx = ctx;
        this.msg  = msg;
        this.options = options;

        let promises = options.map((item, index) => this.msg.addReaction(`${index}\u20e3`));

        Promise.all(promises).catch((err) => {
            ctx.helper.log(this.ctx.message, "couldn't add reactions");
        });

        this.delete = setTimeout(() => {
            this.ctx.helper.log(this.ctx.message, `stopped watching ${this.msg.id}`);
            delete ctx.client.watchers[this.msg.id];
        }, 600000);

        this.ctx.helper.log(this.ctx.message, `started watching ${this.msg.id}`);
    }

    handle(message, emoji, userID) {
        if (userID !== this.ctx.author.id) return;
        emoji = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;

        if (isNaN(emoji = parseInt(emoji[0]))) return;

        if (this.options[emoji]) {
            this.msg.edit({ embed: this.options[emoji] }).catch((err) => this.ctx.helper.log(this.ctx.message, "cant edit in reaction chooser"));
            this.msg.removeReactions().catch((err) => this.ctx.helper.log(this.ctx.message, "cant remove reactions in reaction chooser"));
            this.ctx.helper.log(this.ctx.message, `stopped watching ${this.msg.id}`);
            delete this.ctx.client.watchers[this.msg.id];
        }
    }
}

module.exports = ReactionChooser;
