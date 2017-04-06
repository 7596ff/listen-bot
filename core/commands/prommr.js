const regions = ["americas", "europe", "se_asia", "china"];

async function prommr(message, client, helper) {
    let region = message.content.split(" ").slice(1)[0];

    if (regions.includes(region)) {
        try {
            let reply = await client.redis.getAsync(`prommr:${region}`);
            // let old reply = await client.redis.getAsync(`prommr:${region}:old`);
            reply = JSON.parse(reply);
            // oldreply = JSON.parse(oldreply);

            reply.region = region;
            reply.regions = regions;
            let embed = await client.core.embeds.prommr(reply);

            message.channel.createMessage({
                "embed": embed
            }).catch((err) => helper.log(message, err)).then(() => {
                helper.log(message, `sent ${region} prommr`);
            });
        } catch (err) {
            helper.log(message, "redis err");
            helper.log(message, err);
        }
    } else {
        try {
            if (!region) {
                message.channel.createMessage(`Available regions: \`all\`, ${regions.map(region => `\`${region}\``).join(", ")}`).catch((err) => helper.handle(message, err));
                return;
            }

            let replies = await Promise.all(regions.map((region) => client.redis.getAsync(`prommr:${region}`)));
            // let oldreplies = await Promise.all(regions.map((region) => client.redis.getAsync(`prommr:${region}:old`)));

            let all = {
                "lastupdated": 0,
                "leaderboard": [],
                "region": region,
                "regions": regions
            };
            replies.forEach((reply) => {
                reply = JSON.parse(reply);
                all.leaderboard.push(...reply.leaderboard);
                all.lastupdated = all.lastupdated > reply.lastupdated ? all.lastupdated : reply.lastupdated;
            });

            all.leaderboard.sort((a, b) => {
                return b.solo_mmr - a.solo_mmr;
            });

            if (region != "all") {
                let filtered = all.leaderboard.filter((player) => player.country == region);
                if (filtered.length > 1) {
                    all.leaderboard = filtered;
                } else {
                    message.channel.createMessage(`Available regions: \`all\`, ${regions.map(region => `\`${region}\``).join(", ")}`).catch((err) => helper.handle(message, err));
                    return;
                }
            } else {
                region = "all"
            }

            let embed = await client.core.embeds.prommr(all);

            message.channel.createMessage({
                "embed": embed
            }).catch((err) => helper.handle(message, err)).then(() => {
                helper.log(message, `sent ${region} prommr`);
            });
         } catch (err) {
            helper.log(message, "redis err");
            helper.log(message, err);
        }
    }
}

module.exports = prommr;
