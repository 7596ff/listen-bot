const prettyms = require("pretty-ms");
const heroes = require("dotaconstants").heroes;

function liveMatchEmbed(match) {
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
                `**Dire:** ${match.scoreboard.dire.score}`,
                `**In Game Time:** ${prettyms(Math.floor(match.scoreboard.duration) * 1000)}`,
                match.scoreboard.roshan_respawn_timer > 0 ? `**Roshan respawns in:** ${prettyms(match.scoreboard.roshan_respawn_timer * 1000)}` : "Roshan is **alive**",
            ].join("\n"),
            inline: false
        });
    } else if (match.scoreboard.radiant && match.scoreboard.dire) {
        embed.fields.push({
            name: "Radiant",
            value: [
                `**Picks**: ${match.scoreboard.radiant.picks.map((id) => heroes[id].localized_name).join(", ")} (${match.scoreboard.radiant.picks.length})`,
                `**Bans**: ${match.scoreboard.radiant.bans.map((id) => heroes[id].localized_name).join(", ")} (${match.scoreboard.radiant.bans.length})`
            ].join("\n"),
            inline: false
        }, {
            name: "Dire",
            value: [
                `**Picks**: ${match.scoreboard.dire.picks.map((id) => heroes[id].localized_name).join(", ")} (${match.scoreboard.dire.picks.length})`,
                `**Bans**: ${match.scoreboard.dire.bans.map((id) => heroes[id].localized_name).join(", ")} (${match.scoreboard.dire.bans.length})`
            ].join("\n"),
            inline: false
        });
    }

    return embed;
}

module.exports = liveMatchEmbed;
