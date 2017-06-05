const dc = require("dotaconstants");
const prettyms = require("pretty-ms");

const findHero = require("../../util/findHero");
const liveMatchEmbed = require("../../embeds/liveMatch");
const talentsEmbed = require("../../embeds/talents");

async function checkMatchStatus(ctx, match) {
    if (!match) return `You aren't watching a match in this channel! Please try \`${ctx.gcfg.prefix}live list\`.`;
    if (match.completed) return `This match is completed! You can look at its details with \`${ctx.gcfg.prefix}matchinfo ${match.match_id}\`.`;

    return false;
}

function formatItem(id) {
    let name = dc.item_ids[id];
    return dc.items[name].dname;
}

const subcommands = {
    list: async function(ctx) {
        try {
            let list = await ctx.client.leagues.getList();
            list = list
                .slice(0, 5)
                .map((match) => `\`${match.match_id}\`: **${match.radiant_team.team_name}** vs **${match.dire_team.team_name}**, with ${match.spectators} spectators`);

            list.splice(0, 0, "List of top 5 live games:", "");
            list.push("", `Use \`${ctx.gcfg.prefix}live watch <match_id>\` to start watching a game in this channel.`);

            return ctx.send(list.join("\n"));
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    watch: async function(ctx) {
        try {
            if (isNaN(ctx.options[0])) {
                return ctx.failure("Please provide a proper match ID!");
            }

            let match = await ctx.client.leagues.getMatch(null, ctx.options[0]);

            let message = await checkMatchStatus(ctx, match);
            if (message) return ctx.failure(message);

            await ctx.client.leagues.associate(ctx.channel.id, match.match_id);

            return this.info(ctx);
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    info: async function(ctx) {
        try {
            let match = await ctx.client.leagues.getMatch(ctx.channel.id);

            let message = await checkMatchStatus(ctx, match);
            if (message) return ctx.failure(message);

            let embed = liveMatchEmbed(match);
            return ctx.embed(embed);
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    talents: async function(ctx) {
        try {
            let match = await ctx.client.leagues.getMatch(ctx.channel.id);

            let message = await checkMatchStatus(ctx, match);
            if (message) return ctx.failure(message);

            let ourHero = await findHero(ctx.options.join(" "));
            if (!ourHero) return ctx.failure(ctx.strings.get("bot_no_hero_error"));

            let heroes = await ctx.client.leagues.getMatchHeroes(match);
            let theirHero = heroes.find((hero) => hero.hero_id == ourHero.id);
            if (!theirHero) return ctx.failure("That hero isn't in this game!");

            let embedData = {};
            embedData.hero = ourHero;
            embedData.talents = [];

            let ourTalents = JSON.parse(JSON.stringify(dc.hero_abilities[`npc_dota_hero_${ourHero.name}`].talents));
            let theirTalents = Object.keys(theirHero.abilities)
                .map((abilityID) => dc.ability_ids[abilityID])
                .filter((ability) => ability.startsWith("special_bonus"));

            ourTalents.forEach((talent) => {
                if (talent.name.startsWith("special_bonus")) {
                    talent.dname = dc.abilities[talent.name] ? dc.abilities[talent.name].dname : "?";
                    talent.dname = theirTalents.includes(talent.name) ? `**${talent.dname}**` : talent.dname;
                    embedData.talents.push(talent);
                }
            });

            let embed = talentsEmbed(embedData);
            embed = Object.assign(embed, {
                title: `Talents of ${match.players.find((player) => player.account_id == theirHero.account_id).name}`,
                footer: {
                    text: `level ${theirHero.level} as of ${prettyms(Math.floor(match.scoreboard.duration) * 1000)}`
                }
            });

            return ctx.embed(embed);
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    hero: async function(ctx) {
        try {
            let match = await ctx.client.leagues.getMatch(ctx.channel.id);

            let message = await checkMatchStatus(ctx, match);
            if (message) return ctx.failure(message);

            let ourHero = await findHero(ctx.options.join(" "));
            if (!ourHero) return ctx.failure(ctx.strings.get("bot_no_hero_error"));
            ourHero = dc.heroes[ourHero.id];

            let heroes = await ctx.client.leagues.getMatchHeroes(match);
            let theirHero = heroes.find((hero) => hero.hero_id == ourHero.id);
            if (!theirHero) return ctx.failure("That hero isn't in this game!");

            let theirSkills = {};

            if (theirHero.abilities) {
                for (let item of Object.keys(theirHero.abilities)) {
                    if (!dc.ability_ids[item].startsWith("special_bonus")) {
                        theirSkills[dc.ability_ids[item]] = theirHero.abilities[item];
                    }
                }
            }

            let embed = {
                author: {
                    name: ourHero.localized_name,
                    url: `http://dota2.gamepedia.com/${ourHero.url}`,
                    icon_url: `http://cdn.dota2.com${ourHero.icon}`
                },
                fields: [{
                    name: "Stats",
                    value: [
                        `**Player Name**: ${match.players.find((player) => player.hero_id == theirHero.hero_id).name}`,
                        `**K/D/A:** ${theirHero.kills}/${theirHero.death}/${theirHero.assists}`,
                        `**LH/D:** ${theirHero.last_hits}/${theirHero.denies}`
                    ].join("\n"),
                    inline: true
                }, {
                    name: `Level ${theirHero.level}`,
                    value: [
                        `**GPM/XPM:** ${theirHero.gold_per_min}/${theirHero.xp_per_min}`,
                        `**Net Worth (Current Gold):** ${theirHero.net_worth} (${theirHero.gold})`,
                        theirHero.respawn_timer ? `**Respawn Time:** ${theirHero.respawn_timer}` : "Currently **Alive**"
                    ].join("\n"),
                    inline: true,
                }, {
                    name: "Skill Build",
                    value: Object.keys(theirSkills).length 
                        ? Object.keys(theirSkills).map((skill) => `${dc.abilities[skill].dname} is level ${theirSkills[skill]}`).join("\n") 
                        : "nothing skilled",
                    inline: true
                }, {
                    name: "Item Build",
                    value: [
                        Array(3).fill(0).map((item, index) => theirHero[`item${index}`] > 0 ? formatItem(theirHero[`item${index}`]) : "No Item").join(", "),
                        Array(3).fill(0).map((item, index) => theirHero[`item${index + 3}`] > 0 ? formatItem(theirHero[`item${index + 3}`]) : "No Item").join(", "),
                    ].join("\n"),
                    inline: true
                }],
                footer: {
                    text: `as of ${prettyms(Math.floor(match.scoreboard.duration) * 1000)}`
                } 
            }

            return ctx.embed(embed);
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    }
};

async function exec(ctx) {
    let subcommand = ctx.options.splice(0, 1)[0];

    if (subcommands.hasOwnProperty(subcommand)) {
        return subcommands[subcommand](ctx);
    } else {
        return ctx.send(ctx.strings.get("bot_available_subcommands", Object.keys(subcommands).map((cmd) => `\`${cmd}\``).join(", ")));
    }
}

module.exports = {
    name: "live",
    category: "esports",
    typing: true,
    exec
};
