const eat = require("../../util/eat");
const checkDiscordID = require("../../util/checkDiscordID");
const findHero = require("../../util/findHero");
const historyWithEmbed = require("../../embeds/historyWith");

function findPlayerTeam(match, account_id) {
    let slot = -1;

    for (let hero in match.heroes) {
        if (match.heroes[hero].account_id == account_id) slot = hero;
    }

    return slot < 5;
}

async function historyWith(ctx, _with, _of, _in) {
    if (!_with.found) {
        return ctx.failure(ctx.strings.get("bot_no_member"));
    }

    if (_with.all.length !== 1) {
        return ctx.failure(ctx.strings.get("history_with_wrong_data"));
    }

    _with.all.push(_of || ctx.author.id);

    let results;
    try {
        results = await Promise.all(_with.all.map((id) => checkDiscordID(ctx.client.pg, id)));
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    let nullcheck = results.indexOf(null);
    if (~nullcheck) {
        return ctx.failure(ctx.strings.get("bot_not_registered", ctx.client.users.get(_with.all[nullcheck]).username, ctx.gcfg.prefix));
    }

    let constraints = results.length == 2 ? {
        "included_account_id": results[1]
    } : {};

    if (_in) {
        if (_in == "ranked") {
            constraints.lobby_type = 7;
        } else if (_in == "normal") {
            constraints.lobby_type = 0;
        }
    }

    let matches;
    try {
        matches = await ctx.client.mika.getPlayerMatches(results[0], constraints);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_mika_error"));
    }

    
    let data = {
        p1: results[0],
        p1_name: ctx.guild.members.get(_with.all[0]).username,
        p2: results[1],
        p2_name: ctx.guild.members.get(_with.all[1]).username,
        total: matches.length,
        with: 0,
        winwith: 0
    };

    if (results.length > 1) {
        data.against = {};
        data.against[data.p1] = 0;
        data.against[data.p2] = 0;
    }

    matches.forEach((match) => {
        let p1_team = findPlayerTeam(match, results[0]);
        let p2_team = data.against ? findPlayerTeam(match, results[1]) : p1_team;

        if (p1_team == p2_team) {
            data.with += 1;
            if (p1_team == match.radiant_win) {
                data.winwith += 1;
            }
        } else {
            p1_team == match.radiant_win ? data.against[results[0]] += 1 : data.against[results[1]] += 1;
        }
    });

    let embed = historyWithEmbed.call(ctx.strings, data);
    return ctx.embed(embed);
}

async function historyAs(ctx, _as, _of, _in) {
    if (!_of) _of = ctx.author.id;

    let hero;
    if (_as) {
        hero = findHero(_as);
        if (!hero) {
            return ctx.failure(ctx.strings.get("bot_no_hero_error"));
        }
    }

    let result;
    try {
        result = await checkDiscordID(ctx.client.pg, _of);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    if (result === null) {
        return ctx.failure(ctx.strings.get("bot_not_registered", ctx.client.users.get(_of).username, ctx.gcfg.prefix));
    }

    let mikaOpts = {
        significant: 0
    };

    if (_as) {
        mikaOpts.hero_id = hero.id;
    }

    if (_in) {
        if (_in == "ranked") {
            mikaOpts.lobby_type = 7;
        } else if (_in == "normal") {
            mikaOpts.lobby_type = 0;
        }
    }

    let matches;
    try {
        matches = await ctx.client.mika.getPlayerMatches(result, mikaOpts);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_mika_error"));
    }

    let wins = matches.filter(match => match.radiant_win == (match.player_slot < 5));

    let embed = {
        "description": [
            `**${ctx.strings.get("history_as_wins")}:** ${wins.length}`,
            `**${ctx.strings.get("history_as_games")}:** ${matches.length}`,
            `**${ctx.strings.get("history_as_winrate")}:** ${Math.round(wins.length / matches.length * 10000) / 100}%`
        ].join("\n")
    };

    if (hero) {
        embed.author = {
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_icon.png`,
            "name": `${ctx.guild.members.get(_of).username} as ${hero.local}`
        };
    } else {
        embed.author = {
            "name": `${ctx.guild.members.get(_of).username} in ${_in}`
        };
    }

    return ctx.embed(embed);
}

async function exec(ctx) {
    let response = await eat(ctx.content, {
        of: "member",
        with: "member",
        as: "string",
        in: "string"
    }, ctx.guild.members);

    if (!Object.keys(response).length) {
        return ctx.failure(ctx.strings.get("bot_wrong_data"));
    }

    if (response.with) return historyWith(ctx, response.with, ((response.of && response.of.found) && ctx.client.users.get(response.of.all[0]).id), response.in);
    if (response.as) return historyAs(ctx, response.as, ((response.of && response.of.found) && ctx.client.users.get(response.of.all[0]).id), response.in);
    if (response.in) return historyAs(ctx, null, ((response.of && response.of.found) && ctx.client.users.get(response.of.all[0]).id), response.in);
}

module.exports = {
    name: "history",
    category: "personal",
    typing: true,
    aliases: ["h", "winrate"],
    exec
};
