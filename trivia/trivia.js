class Trivia {
    constructor(questions) {
        this.questions = questions;
        this.channels = ["269635488002867200"];
    }

    get_new_question(old_question, redis, channel) {
        let res = this.questions[Math.floor(Math.random() * this.questions.length)];
        let ret = old_question.question != "new" && old_question.question == res.question ? this.get_new_question(old_question) : res;

        if (redis && channel) {
            redis.set(`trivia:${channel}:question`, JSON.stringify(ret));
            redis.set(`trivia:${channel}:20`, true);
            redis.expire(`trivia:${channel}:20`, 40);
            redis.set(`trivia:${channel}:0`, true);
            redis.expire(`trivia:${channel}:0`, 60);
            redis.set(`trivia:${channel}:retries`, 2);
        }

        return ret;
    }

    init(client, channel) {
        client.createMessage(channel, "Trivia game started in this channel.");
        let question = this.get_new_question("new", client.redis, channel);
        client.createMessage(channel, `**${question.question}**`);
    }

    handle(message, client, helper) {
        client.redis.get(`trivia:${message.channel.id}:question`, (err, reply) => {
            if (!reply) return;
            if (err) helper.log(message, err);

            reply = JSON.parse(reply);
            if (message.content == reply.answer) {
                let new_question = this.get_new_question(reply, client.redis, message.channel.id);
                message.channel.createMessage(`**${message.author.username}#${message.author.discriminator}** is correct! New question:\n**${new_question.question}**`);
            }
        });
    }

    keyevent(message, client) {
        let split_content = message.split(":")
        let channel = split_content[1], code = split_content[2];
        switch(code) {
            case "20":
                client.createMessage(channel, "20 seconds left!");
                break;
            case "0":
                client.redis.get(`trivia:${channel}:retries`, (err, reply) => {
                    console.log(reply)
                    if (reply > 0) {
                        client.redis.get(`trivia:${channel}:question`, (err, question) => {
                            question = JSON.parse(question);
                            let new_question = this.get_new_question(question, client.redis, channel);

                            client.redis.set(`trivia:${channel}:retries`, reply - 1);
                            client.createMessage(channel, `Time's up! The answer was **${question.answer}**. New question:\n**${new_question.question}**`).catch(err => util.log(err));
                        });
                    } else {
                        client.createMessage(channel, "Time's up! Not enough activity detected in this channel.\nUse `--trivia start` to start up a new game.").catch(err => util.log(err));
                    }
                });
                break;
        }
    }
}

module.exports = Trivia;
