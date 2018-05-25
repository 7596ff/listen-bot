const eat = require("../../util/eat");
const searchMembers = require("../../util/searchMembers");
const findHero = require("../../util/findHero");
const checkDiscordID = require("../../util/checkDiscordID");

async function exec(ctx) {
    let result = await eat(ctx.content, {
        of: "member",
        as: "string",
        with: "member",
        in: "string"
    }, ctx.guild.members);

    // here we do a whole bunch of bullshit
    let discordIDs = [];
    let mikaOpts = {
        limit: 1,
        significant: 0
    };

    // if no match assume its a member
    if (!(Object.keys(result).length)) {
        let searchRes = await searchMembers(ctx.guild.members, ctx.options);
        if (searchRes.found) {
            result.of = searchRes.all;
        } else {
            discordIDs.push(ctx.author.id);
        }
    }

    if (result.of && result.of.found) {
        discordIDs.push(...result.of.all);
    }

    if (result.with && result.with.found) {
        discordIDs.push(ctx.author.id);
        discordIDs.push(...result.with.all);
    }

    if (result.of && result.with) {
        discordIDs.splice(discordIDs.indexOf(ctx.author.id), 1)
    }

    if (!discordIDs.length) {
        discordIDs.push(ctx.author.id);
    }

    if (result.as) {
        let hero = findHero(result.as);
        if (hero) {
            mikaOpts.hero_id = hero.id;
        } else {
            return ctx.failure(ctx.strings.get("bot_no_hero_error"));
        }
    }

    let results;
    try {
        let promises = discordIDs.map((id) => checkDiscordID(ctx.client.pg, id));
        results = await Promise.all(promises);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    results = results.map((result, index) => {
        return {
            discordID: discordIDs[index],
            dotaID: result
        };
    });

    let nullcheck = results.find((result) => result.dotaID === null);
    if (nullcheck) {
        let username = ctx.client.users.get(nullcheck.discordID).username;
        return ctx.failure(ctx.strings.get("bot_not_registered", username, ctx.gcfg.prefix));
    }

    if (results.length > 1) {
        mikaOpts.included_account_id = results.map((result) => result.dotaID).slice(1);
    }

    if (result.in) {
        if (result.in == "ranked") {
            mikaOpts.lobby_type = 7;
        } else if (result.in == "normal") {
            mikaOpts.lobby_type = 0;
        }
    }

    let match;
    try {
        match = await ctx.client.mika.getPlayerMatches(results[0].dotaID, mikaOpts);
        if (match.length) {
            match = match[0];
        } else {
            return ctx.failure(ctx.strings.get("lastmatch_no_match"));
        }
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_mika_error"));
    }

    ctx.match_id = match.match_id;
    return ctx.client.commands.matchinfo.exec(ctx);
}

module.exports = {
    name: "lastmatch",
    category: "personal",
    aliases: ["lm", "lastgame"],
    typing: true,
    exec
};
