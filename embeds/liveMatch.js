const tnhConfig = require("../config.json").thinknohands;
const prettyms = require("pretty-ms");
const heroes = require("dotaconstants").heroes;
const snekfetch = require("snekfetch");

const types = {
    "0": "Best of 1",
    "1": "Best of 3",
    "2": "Best of 5"
};

async function liveMatchEmbed(match) {
    let response = {};

    let embed = {
        title: `\`${match.match_id}\`: ${match.radiant_team.team_name} vs. ${match.dire_team.team_name}`,
        fields: []
    };

    if (match.scoreboard.duration > 0) {
        embed.fields.push({
            name: "Radiant",
            value: match.players
                .filter((player) => player.team == 0)
                .map((player) => `**${player.name}** playing **${heroes[player.hero_id] ? heroes[player.hero_id].localized_name : "Unknown Hero"}**`)
                .join("\n"),
            inline: true
        }, {
            name: "Dire",
            value: match.players
                .filter((player) => player.team == 1)
                .map((player) => `**${player.name}** playing **${heroes[player.hero_id] ? heroes[player.hero_id].localized_name : "Unknown Hero"}**`)
                .join("\n"),
            inline: true
        }, {
            name: "Stats",
            value: [
                `**Radiant:** ${match.scoreboard.radiant.score}`,
                `**In Game Time:** ${prettyms(Math.floor(match.scoreboard.duration) * 1000)}`,
                `**Spectators:** ${match.spectators}`,
                `**Series Type:** ${types[match.series_type]}`,
            ].join("\n"),
            inline: true
        }, {
            name: "\u200b",
            value: [
                `**Dire:** ${match.scoreboard.dire.score}`,
                match.scoreboard.roshan_respawn_timer > 0 ? `**Roshan respawns in:** ${prettyms(match.scoreboard.roshan_respawn_timer * 1000)}` : "Roshan is **alive**",
                `**Stream Delay:** ${match.stream_delay_s}`,
                match.series_type && `**Radiant Score:** ${match.radiant_series_wins}, **Dire Score:** ${match.dire_series_wins}`
            ].join("\n"),
            inline: true
        });
    } else if (match.scoreboard.radiant && match.scoreboard.dire) {
        embed.image = { url: "attachment://draft.png" };

        let url = `${tnhConfig.url}/draft?key=${tnhConfig.key}&`;
        let queries = [];
        if (match.scoreboard.radiant.picks.length) queries.push(`radiant_picks=${match.scoreboard.radiant.picks.join(",")}`);
        if (match.scoreboard.dire.picks.length) queries.push(`dire_picks=${match.scoreboard.dire.picks.join(",")}`);
        if (match.scoreboard.radiant.bans.length) queries.push(`radiant_bans=${match.scoreboard.radiant.bans.join(",")}`);
        if (match.scoreboard.dire.bans.length) queries.push(`dire_bans=${match.scoreboard.dire.bans.join(",")}`);
        url += queries.join("&");

        let img = await snekfetch.get(url);
        response.file = {
            name: "draft.png",
            file: img.body
        };
    } else {
        embed.description = "Nothing has happened yet!";
    }

    response.content = { embed };

    return response;
}

module.exports = liveMatchEmbed;
