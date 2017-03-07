class Trivia {
    constructor(questions) {
        this.questions = questions;
        this.active_questions = {};
        this.channels = [];
        this.hints = {};
    }

    clean(str) {
        return str.toString().replace(/[+\-%s]/g, "").trim().toLowerCase();
    }

    get_new_question(old_question, redis, channel) {
        let res = this.questions[Math.floor(Math.random() * this.questions.length)];
        let ret = old_question.question != "new" && old_question.question == res.question ? this.get_new_question(old_question) : res;

        if (redis && channel) {
            redis.set(`trivia:${channel}:hint`, true);
            redis.expire(`trivia:${channel}:hint`, 20);
            redis.set(`trivia:${channel}:retries`, 2);

            this.active_questions[channel] = ret;
            this.hints[channel] = ret.answer.replace(/[^+\-%s]/g, "•");
        }

        return ret;
    }

    init(client, channel) {
        this.channels.push(channel);
        client.createMessage(channel, "Trivia game started in this channel.");
        let question = this.get_new_question("new", client.redis, channel);
        client.createMessage(channel, `**${question.question}** (Hint: ${this.hints[channel]})`);
    }

    handle(message, client, helper) {
        let question = this.active_questions[message.channel.id];
        if (this.clean(message.content) == this.clean(question.answer)) {
            // TODO: points
            let new_question = this.get_new_question(question, client.redis, message.channel.id);
            message.channel.createMessage(`**${message.author.username}#${message.author.discriminator}** is correct! The answer was **${question.answer}**. New question:\n**${new_question.question}** (Hint: ${this.hints[message.channel.id]})`);
        }
    }

    replace(str, orig) {
        let index = Math.floor(Math.random() * str.length);
        if (str.charAt(index) == "•") {
            return `${str.substr(0, index)}${orig.charAt(index)}${str.substr(index + 1)}`;
        } else {
            return this.replace(str, orig); // this can crash the bot
        }
    }

    keyevent(message, client) {
        let split_content = message.split(":")
        let channel = split_content[1], code = split_content[2];
        if (!this.channels.includes(channel)) return;

        if (code == "hint") {
            let question = this.active_questions[channel];
            this.hints[channel] = this.replace(this.hints[channel], question.answer);
            if (question.answer == this.hints[channel]) {
                client.redis.get(`trivia:${channel}:retries`, (err, reply) => {
                    if (reply > 0) {
                        let new_question = this.get_new_question(question, client.redis, channel);

                        client.redis.set(`trivia:${channel}:retries`, reply - 1);
                        client.createMessage(channel, `Time's up! The answer was **${question.answer}**. New question:\n**${new_question.question}** (Hint: ${this.hints[channel]})`).catch(err => util.log(err));     
                    } else {
                        this.channels.splice(this.channels.indexOf(channel), 1);
                        client.createMessage(channel, "Time's up! Not enough activity detected in this channel.\nUse `--trivia start` to start up a new game.").catch(err => util.log(err));
                    }
                });
            } else {
                client.redis.set(`trivia:${channel}:hint`, true);
                client.redis.expire(`trivia:${channel}:hint`, 10);
                client.createMessage(channel, `Hint: ${this.hints[channel]}`).catch(err => util.log(err));
            }
        }
    }
}

module.exports = Trivia;
