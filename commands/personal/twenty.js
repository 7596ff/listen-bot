const aliases = require("../../json/aliases.json");
const searchMembers = require("../../util/searchMembers");
const checkDiscordID = require("../../util/checkDiscordID");

let keys = ["kills", "deaths", "assists", "xp_per_min", "gold_per_min", "hero_damage", "tower_damage", "hero_healing", "last_hits", "duration"];

function fmtK(num) {
    return num < 1000 ? num : `${(num / 1000).toFixed(1)}k`;
}

function fmtTime(num) {
    return `${Math.floor(num / 60)}:${("00" + num % 60).substr(-2, 2)}`;
}

class Counter {
    constructor(name) {
        this.name = name;
        this.data = [];
        this._max = {
            value: 0,
            match: 0,
            hero: 0
        };
    }

    add(value, match, hero) {
        this.data.push(value);
        if (this.data.sort((a, b) => b - a)[0] <= value) {
            this._max.value = value;
            this._max.match = match;
            this._max.hero = hero;
        }
    }

    avg() {
        let total = this.data.reduce((total, next) => total + next);
        return Math.floor(total / this.data.length);
    }

    max() {
        return {
            value: this._max.value,
            match: this._max.match,
            hero: `<:${this._max.hero}:${aliases.find((a) => a.id == this._max.hero).emoji}>`
        }
    }
}

async function exec(ctx) {
    let member, ID;
    try {
        let members;
        if (ctx.options.length) {
            members = await searchMembers(ctx.guild.members, ctx.options);
            if (!members.found) return ctx.failure(ctx.strings.get("bot_no_member"));
        } else {
            members = false;
        }

        ID = members ? members.all[0] : ctx.author.id;
        member = await checkDiscordID(ctx.client.pg, ID);

        if (!member) {
            return ctx.failure(ctx.strings.get("bot_not_registered", ctx.guild.members.get(ID).username, ctx.gcfg.prefix));
        }
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    try {
        let data = await ctx.client.mika.getPlayerRecentMatches(member);

        let groomed = {};

        for (let key of keys) {
            groomed[key] = new Counter(key);
            
            for (let match of data) {
                groomed[key].add(match[key], match.match_id, match.hero_id);
            }
        }

        let wins = data.map((match) => match.player_slot < 6 == match.radiant_win).filter((result) => result).length;
        let winrate = Math.round(wins / data.length * 10000) / 100;

        let msg = [
            `**Summaries for ${ctx.client.users.get(ID).username}'s last ${data.length} matches**`,
            // "Name: **Average** (*maximum as hero in* `match ID`)",
            "",
            `${ctx.strings.get("history_as_winrate")}: **${winrate}%**`,
            `${"K"}: **${groomed.kills.avg()}** (*${groomed.kills.max().value} as ${groomed.kills.max().hero} in* \`${groomed.kills.max().match}\`)`,
            `${"D"}: **${groomed.deaths.avg()}** (*${groomed.deaths.max().value} as ${groomed.deaths.max().hero} in* \`${groomed.deaths.max().match}\`)`,
            `${"A"}: **${groomed.assists.avg()}** (*${groomed.assists.max().value} as ${groomed.assists.max().hero} in* \`${groomed.assists.max().match}\`)`,
            `${"XPM"}: **${groomed.xp_per_min.avg()}** (*${groomed.xp_per_min.max().value} as ${groomed.xp_per_min.max().hero} in* \`${groomed.xp_per_min.max().match}\`)`,
            `${"GPM"}: **${groomed.gold_per_min.avg()}** (*${groomed.gold_per_min.max().value} as ${groomed.gold_per_min.max().hero} in* \`${groomed.gold_per_min.max().match}\`)`,
            `${"HD"}: **${fmtK(groomed.hero_damage.avg())}** (*${fmtK(groomed.hero_damage.max().value)} as ${groomed.hero_damage.max().hero} in* \`${groomed.hero_damage.max().match}\`)`,
            `${"TD"}: **${fmtK(groomed.tower_damage.avg())}** (*${fmtK(groomed.tower_damage.max().value)} as ${groomed.tower_damage.max().hero} in* \`${groomed.tower_damage.max().match}\`)`,
            `${"HH"}: **${fmtK(groomed.hero_healing.avg())}** (*${fmtK(groomed.hero_healing.max().value)} as ${groomed.hero_healing.max().hero} in* \`${groomed.hero_healing.max().match}\`)`,
            `${"LH"}: **${groomed.last_hits.avg()}** (*${groomed.last_hits.max().value} as ${groomed.last_hits.max().hero} in* \`${groomed.last_hits.max().match}\`)`,
            `${"D"}: **${fmtTime(groomed.duration.avg())}** (*${fmtTime(groomed.duration.max().value)} as ${groomed.duration.max().hero} in* \`${groomed.duration.max().match}\`)`
        ];

        return ctx.send(msg.join("\n"));
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_mika_error"));
    }
}

module.exports = {
    name: "twenty",
    category: "personal",
    typing: true,
    exec
}
