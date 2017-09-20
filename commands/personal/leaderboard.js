const cacheMatches = require("../../util/cacheMatches");
const SteppedList = require("../../classes/SteppedList");
const searchMembers = require("../../util/searchMembers");
const findHero = require("../../util/findHero");
const prettyMs = require("pretty-ms");

function findPlayerTeam(match, account_id) {
    let slot = -1;

    for (let hero in match.heroes) {
        if (match.heroes[hero].account_id == account_id) slot = hero;
    }

    return slot < 5;
}

async function exec(ctx) {
    return ctx.delete(20000, "This command is disabled until further notice. Sorry for the inconvenience.");

    let rows;
    let msg = false;
    try {
        let res = await ctx.client.pg.query("SELECT * FROM public.users;");
        rows = res.rows.filter((row) => ctx.guild.members.get(row.id));

        msg = await ctx.send(`Gathering match data. This could take up to ${prettyMs(rows.length * 500, { verbose: true })}`);
    } catch (err) {
        ctx.error(err);
        if (msg) return msg.edit(ctx.strings.get("bot_generic_error"));
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    let data;
    try {
        data = await Promise.all(rows.map((row) => cacheMatches(ctx.client.redis, ctx.client.mika, row)));
    } catch (err) {
        ctx.error(err);
        if (msg) return msg.edit(ctx.strings.get("bot_mika_error"));
        return ctx.failure(ctx.strings.get("bot_mika_error"));
    }

    if (ctx.options[0] == "with") {
        let member = await searchMembers(ctx.guild.members, [ctx.options.slice(1).join(" ")]);
        if (!member.found) return msg.edit(`❌ ${ctx.strings.get("bot_no_member")}`);
        member = member.all[0];

        memberData = data.find((row) => row.id == member);
        let list = data.map((row) => {
            if (row.id == member) return false;

            let matches = row.data
                .filter((match) => Object.values(match.heroes).find((hero) => hero.account_id == memberData.dotaid))
                .filter((match) => findPlayerTeam(match, memberData.dotaid) == findPlayerTeam(match, row.dotaid));
            if (!matches.length) return false;

            let wins = matches.filter((match) => match.radiant_win == findPlayerTeam(match, row.dotaid));

            return [ctx.client.users.get(row.id).username, matches.length, Math.round(wins.length / matches.length * 10000) / 100];
        }).filter((row) => row).sort((a, b) => b[2] - a[2]);

        list = [
            list.map((row) => row[0]),
            list.map((row) => row[1]),
            list.map((row) => `${row[2]}%`)
        ];

        let embed = {
            author: {
                icon_url: ctx.client.users.get(memberData.id).avatarURL,
                name: `History of the server with ${ctx.client.users.get(memberData.id).username}`
            }
        };

        let watcher = new SteppedList(ctx, msg, 15, embed, ["Username", "Matches Played", "Winrate"], list);
        await msg.edit({ embed: watcher.embed(0).embed, content: "" });
        ctx.client.watchers[msg.id] = watcher;
        return Promise.resolve();
    }

    if (ctx.options[0] == "as") {
        let hero = findHero(ctx.options.slice(1).join(" "));
        if (!hero) return msg.edit(`❌ ${ctx.strings.get("bot_no_hero_error")}`);

        let list = data.map((row) => {
            let matches = row.data.filter((match) => match.hero_id == hero.id);
            if (!matches.length) return false;

            let wins = matches.filter((match) => match.radiant_win == findPlayerTeam(match, row.dotaid));

            return [ctx.client.users.get(row.id).username, matches.length, Math.round(wins.length / matches.length * 10000) / 100];
        }).filter((row) => row).sort((a, b) => b[1] - a[1]);

        list = [
            list.map((row) => row[0]),
            list.map((row) => row[1]),
            list.map((row) => `${row[2]}%`)
        ];

        let embed = {
            author: { 
                icon_url: `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_icon.png`, 
                name: `History of the server as ${hero.local}`
            }
        };

        let watcher = new SteppedList(ctx, msg, 15, embed, ["Username", "Matches Played", "Winrate"], list);
        await msg.edit({ embed: watcher.embed(0).embed, content: "" });
        ctx.client.watchers[msg.id] = watcher;
        return Promise.resolve();
    }

    let list = data.map((row) => {
        let matches = row.data;
        if (!matches.length) return false;

        let wins = matches.filter((match) => match.radiant_win == findPlayerTeam(match, row.dotaid));

        return [ctx.client.users.get(row.id).username, matches.length, Math.round(wins.length / matches.length * 10000) / 100];
    }).filter((row) => row).sort((a, b) => b[2] - a[2]);

    list = [
        list.map((row) => row[0]),
        list.map((row) => row[1]),
        list.map((row) => `${row[2]}%`)
    ];

    let watcher = new SteppedList(ctx, msg, 15, { title: "Winrate Leaderboard" }, ["Username", "Matches Played", "Winrate"], list);
    await msg.edit({ embed: watcher.embed(0).embed, content: "" });
    ctx.client.watchers[msg.id] = watcher;
    return Promise.resolve();
}

module.exports = {
    name: "leaderboard",
    category: "personal",
    aliases: ["lb"],
    typing: true,
    exec
};
