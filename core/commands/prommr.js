const regions = ["americas", "europe", "se_asia", "china"];

async function prommr(message, client, helper) {
    let region = message.content.split(" ").slice(1)[0];

    if (regions.includes(region)) {
        try {
            let reply = await client.redis.getAsync(`prommr:${region}`);
            reply = JSON.parse(reply);

            reply.region = region;
            let embed = await client.core.embeds.prommr(reply);

            message.channel.createMessage({
                "embed": embed
            }).catch((err) => helper.log(message, err));
        } catch (err) {
            helper.log(message, "redis err");
            helper.log(message, err);
        }
    } else if (region == "all") {
        try {
            let replies = await Promise.all(regions.map((region) => client.redis.getAsync(`prommr:${region}`)));

            let all = {
                "lastupdated": 0,
                "leaderboard": []
            };
            replies.forEach((reply) => {
                reply = JSON.parse(reply);
                all.leaderboard.push(...reply.leaderboard);
                all.lastupdated = all.lastupdated > reply.lastupdated ? all.lastupdated : reply.lastupdated;
            });

            all.leaderboard.sort((a, b) => {
                return b.solo_mmr - a.solo_mmr;
            });

            let embed = await client.core.embeds.prommr(all);

            message.channel.createMessage({
                "embed": embed
            }).catch((err) => helper.handle(message, err));
         } catch (err) {
            helper.log(message, "redis err");
            helper.log(message, err);
        }
    } else {
        message.channel.createMessage(`Available regions: \`all\`, ${regions.map(region => `\`${region}\``).join(", ")}`).catch((err) => helper.handle(message, err));
    }
}

module.exports = prommr;