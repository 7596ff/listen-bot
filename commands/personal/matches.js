const eat = require("../../util/eat");
const searchMembers = require("../../util/searchMembers");
const findHero = require("../../util/findHero");
const checkDiscordID = require("../../util/checkDiscordID");
const matchesEmbed = require("../../embeds/matches");

async function exec(ctx) {
    let locale = ctx.client.core.locale[ctx.gcfg.locale];

    let result = await eat(ctx.content, {
        of: "member",
        as: "string",
        with: "member"
    }, ctx.guild.members);

    // here we do a whole bunch of bullshit
    let discordIDs = [];
    let mikaOpts = {
        limit: 12
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
        discordIDs.push(...result.with.all);
        discordIDs.push(ctx.author.id);
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
            return ctx.send("Couldn't find that hero.");
        }
    }

    let results;
    try {
        let promises = discordIDs.map((id) => checkDiscordID(ctx.client.pg, id));
        results = await Promise.all(promises);
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong, and the error has been logged.");
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
        return ctx.send(`${username} has not registered with me yet! Try \`${ctx.gcfg.prefix}help register\`.`);
    }

    if (results.length > 1) {
        mikaOpts.included_account_id = results.map((result) => result.dotaID).slice(1);
    }

    let matches;
    try {
        matches = await ctx.client.mika.getPlayerMatches(results[0].dotaID, mikaOpts);
        if (!matches.length) {
            return ctx.send("Couldn't find any matches with these paramaters.");
        }
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong while getting the match data from OpenDota, try again.");
    }

    let embed = matchesEmbed(ctx, matches);
    return ctx.embed(embed);
}

module.exports = {
    name: "matches",
    category: "personal",
    typing: true,
    exec
};
