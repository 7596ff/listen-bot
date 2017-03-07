const util = require("util");

class Trivia {
    constructor(questions) {
        this.questions = questions;
        this.active_questions = {};
        this.channels = [];
        this.hints = {};
        this.points = {};
    }

    clean(str) {
        return str.toString().replace(/[+\-%s\.]/g, "").trim().toLowerCase();
    }

    get_new_question(old_question, redis, channel) {
        let res = this.questions[Math.floor(Math.random() * this.questions.length)];
        let ret = old_question.question != "new" && old_question.question == res.question ? this.get_new_question(old_question) : res;

        if (redis && channel) {
            redis.set(`trivia:${channel}:hint`, true);
            redis.expire(`trivia:${channel}:hint`, 10);
            redis.set(`trivia:${channel}:retries`, 2);

            this.active_questions[channel] = ret;
            this.hints[channel] = ret.answer.replace(/[^+\-%s\.]/g, "•");
        }

        return ret;
    }

    init(client, channel) {
        this.channels.push(channel);
        client.createMessage(channel, "Trivia game started in this channel.");
        let question = this.get_new_question("new", client.redis, channel);
        client.createMessage(channel, `**${question.question}** (Hint: ${this.hints[channel]})`);
    }

    increment_user(pg, user_id, score) {
        pg.query({
            "text": "UPDATE scores SET score = (SELECT score FROM scores WHERE id = $1) + $2 WHERE id = $1;",
            "values": [user_id, score]
        }).catch(err => {
            util.log(err);
        });

        pg.query({
            "text": "INSERT INTO scores (id, score) SELECT $1, $2 WHERE NOT EXISTS (SELECT id FROM scores WHERE id = $1);",
            "values": [user_id, score]
        }).catch(err => {
            util.log(err);
        });
    }

    handle(message, client) {
        let question = this.active_questions[message.channel.id];
        this.points[message.channel.id] = this.points[message.channel.id] || {};
        this.points[message.channel.id][message.author.id] = this.points[message.channel.id][message.author.id] || 5;
        if (this.clean(message.content) == this.clean(question.answer)) {
            let new_question = this.get_new_question(question, client.redis, message.channel.id);
            this.increment_user(client.pg, message.author.id, this.points[message.channel.id][message.author.id]);
            message.channel.createMessage(`(+${this.points[message.channel.id][message.author.id]}) **${message.author.username}#${message.author.discriminator}** is correct! The answer was **${question.answer}**. New question:\n**${new_question.question}** (Hint: ${this.hints[message.channel.id]})`);
            delete this.points[message.channel.id];
        } else {
            let pts = this.points[message.channel.id][message.author.id];
            this.points[message.channel.id][message.author.id] = pts > 1 ? pts - 1 : 1;
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
        let split_content = message.split(":");
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
                        delete this.points[channel];
                    } else {
                        this.channels.splice(this.channels.indexOf(channel), 1);
                        client.createMessage(channel, `Time's up! The answer was **${question.answer}**. Not enough activity detected in this channel.\nUse \`--trivia start\` to start up a new game.`).catch(err => util.log(err));
                        util.log(`${channel}: trivia timed out`);
                        delete this.points[channel];
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
