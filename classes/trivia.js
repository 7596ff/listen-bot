class Trivia {
    constructor(questions, categories) {
        this.questions = questions;
        this.categories = categories;
        this.active_questions = {};
        this.channels = [];
        this.hints = {};
        this.hlock = {};
        this.points = {};
        this.streaks = {};
    }

    clean(str) {
        return str.toString().toLowerCase().replace(/[+\-%s]/g, "").trim();
    }

    notping(author) {
        return `**${author.username}#${author.discriminator}**`;
    }

    get_new_question(old_question, redis, channel, retries = 2) {
        let cat = this.categories[Math.floor(Math.random() * this.categories.length)];
        let fil = this.questions.filter(question => question.category == cat);
        let res = fil[Math.floor(Math.random() * fil.length)];
        let ret = old_question.question != "new" && old_question.question == res.question ? this.get_new_question(old_question) : res;

        ret.answer = ret.answer.toString();

        if (redis && channel) {
            this.hlock[channel] = true;
            this.active_questions[channel] = ret;
            this.hints[channel] = ret.answer.replace(/[^+\-%s\. ]/g, "•");
            if (ret.name) this.hints[channel] = this.hints[channel].replace(/[s]/g, "•");

            redis.set(`trivia:${channel}:hint`, true, () => {
                redis.expire(`trivia:${channel}:hint`, 10, () => {
                    redis.set(`trivia:${channel}:retries`, retries, () => {
                        this.hlock[channel] = false;
                    });
                });
            }); // AAAAAAAAAAAAAAAAAAAAAAAAAAAa
        }

        return ret;
    }

    init(client, channel) {
        this.channels.push(channel);
        client.createMessage(channel, "Trivia game started in this channel.");
        let question = this.get_new_question("new", client.redis, channel);
        client.createMessage(channel, `**${question.question}** (Hint: ${this.hints[channel]})`);
    }

    increment_user(client, user_id, score) {
        let sql = [
            "INSERT INTO public.scores (id, score, streak, banned)",
            "VALUES ($1, $2, 1, false)",
            "ON CONFLICT (id) DO",
            "UPDATE SET score = public.scores.score + (SELECT CASE WHEN banned IS TRUE THEN 1 ELSE EXCLUDED.score END FROM public.scores WHERE id = $1)",
            "WHERE scores.id = $1;"
        ].join(" ");

        client.pg.query({
            "text": sql,
            "values": [user_id, score]
        }).catch(err => client.helper.log("postgres", err));
    }

    store_streak(client, user_id, streak) {
        client.pg.query({
            "text": "UPDATE scores SET streak = $1 WHERE id = $2 AND streak <= $1;",
            "values": [streak, user_id]
        }).catch(err => client.helper.log("postgres", err));
    }

    handle(message, client) {
        let question = this.active_questions[message.channel.id];
        this.points[message.channel.id] = this.points[message.channel.id] || {};
        this.points[message.channel.id][message.author.id] = this.points[message.channel.id][message.author.id] || 5;
        if (this.clean(message.content) == this.clean(question.answer)) {
            let new_question = this.get_new_question(question, client.redis, message.channel.id);
            this.increment_user(client, message.author.id, this.points[message.channel.id][message.author.id]);

            let streakstr = "";

            if (!this.streaks[message.channel.id]) {
                this.streaks[message.channel.id] = {
                    "user": message.author.id,
                    "streak": 0
                };
            }

            if (this.streaks[message.channel.id].user == message.author.id) {
                this.streaks[message.channel.id].streak += 1;
                streakstr = `${this.notping(message.author)} is on a streak of ${this.streaks[message.channel.id].streak}! `;
            } else {
                if (this.streaks[message.channel.id].streak > 2) {
                    streakstr = `${this.notping(message.author)} broke ${this.notping(client.users.get(this.streaks[message.channel.id].user))}'s streak of ${this.streaks[message.channel.id].streak}! `;
                }

                this.store_streak(client, this.streaks[message.channel.id].user, this.streaks[message.channel.id].streak);

                this.streaks[message.channel.id] = {
                    "user": message.author.id,
                    "streak": 1
                };
            }

            message.channel.createMessage(`(+${this.points[message.channel.id][message.author.id]}) ${this.notping(message.author)} is correct! The answer was **${question.answer}**. ${streakstr}New question:\n\n**${new_question.question}** (Hint: ${this.hints[message.channel.id]})`);
            delete this.points[message.channel.id];
        } else {
            let pts = this.points[message.channel.id][message.author.id];
            this.points[message.channel.id][message.author.id] = pts > 1 ? pts - 1 : 1;
        }
    }

    replace(str, orig) {
        if (str.split("•").length === 1) return orig;
        let index = Math.floor(Math.random() * str.length);
        if (str.charAt(index) == "•") {
            return `${str.substr(0, index)}${orig.charAt(index)}${str.substr(index + 1)}`;
        } else {
            return this.replace(str, orig);
        }
    }

    keyevent(message, client) {
        let split_content = message.split(":");
        let channel = split_content[1],
            code = split_content[2];
        if (!this.channels.includes(channel)) return;

        if (code == "hint") {
            if (!this.hlock[channel]) {
                let question = this.active_questions[channel];
                this.hints[channel] = this.replace(this.hints[channel], question.answer);
                if (this.hints[channel].length > 10) this.hints[channel] = this.replace(this.hints[channel], question.answer);
                if (question.answer == this.hints[channel]) {
                    client.redis.get(`trivia:${channel}:retries`, (err, reply) => {
                        if (reply > 0) {
                            let new_question = this.get_new_question(question, client.redis, channel, reply - 1);
                            client.createMessage(channel, `Time's up! The answer was **${question.answer}**. New question:\n\n**${new_question.question}** (Hint: ${this.hints[channel]})`)
                                .catch(err => client.helper.handle("trivia", err));
                        } else {
                            this.channels.splice(this.channels.indexOf(channel), 1);
                            client.createMessage(channel, `Time's up! The answer was **${question.answer}**. Not enough activity detected in this channel.\nUse \`--trivia start\` to start up a new game.`)
                                .catch(err => client.helper.handle("trivia", err));
                            client.helper.log("trivia", `${channel}: trivia timed out`);
                        }

                        if (this.streaks[channel]) this.store_streak(client, this.streaks[channel].user, this.streaks[channel].streak);
                        delete this.points[channel];
                        delete this.streaks[channel];
                    });
                } else {
                    client.redis.set(`trivia:${channel}:hint`, true);
                    client.redis.expire(`trivia:${channel}:hint`, 10);
                    client.createMessage(channel, `Hint: ${this.hints[channel]}`).catch(err => client.helper.handle("trivia", err));
                }
            } else {
                client.helper.log("trivia", `lock jiggled in ${channel}`);
            }
        }
    }
}

module.exports = Trivia;
