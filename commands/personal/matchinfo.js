async function exec(ctx) {
    let locale = ctx.client.core.locale[ctx.gcfg.locale];

    let match_id = String(ctx.match_id || ctx.options[0]);
    if (!match_id) {
        return ctx.send("Couldn't find a match ID.");
    }

    if (match_id.includes("dotabuff") || match_id.includes("opendota")) {
        match_id = match_id.split("/").slice(-1)[0];
    }

    if (isNaN(match_id)) {
        return ctx.send("Invalid match ID provided.");
    }

    try {
        let key = `matchinfo:${match_id}`;
        let match = await ctx.client.redis.getAsync(key);

        if (match) {
            match = JSON.parse(match);
        } else {
            match = await ctx.client.mika.getMatch(match_id);
            await ctx.client.redis.setexAsync(key, 604800, JSON.stringify(match));
        }

        // sometimes the scores are broken
        match.radiant_score = match.players.slice(0, 5).map(player => player.kills).reduce((a, b) => a + b, 0);
        match.dire_score = match.players.slice(5, 10).map(player => player.kills).reduce((a, b) => a + b, 0);

        let embed = await ctx.client.core.embeds.match(ctx.client.core.json.od_heroes, match, ctx.client, ctx.guild);
        return ctx.embed(embed);
    } catch (err) {
        console.error(err);
        return ctx.send(locale.generic.generic);
    }
}

module.exports = {
    name: "matchinfo",
    category: "personal",
    typing: true,
    exec
};
