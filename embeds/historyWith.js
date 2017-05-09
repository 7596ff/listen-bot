function historyWithEmbed(data) {
    return {
        title: this.get("history_with_title", data.p1_name, data.p2_name),
        fields: [{
            name: this.get("history_with_with"),
            value: [
                `**${this.get("history_with_winloss")}** ${data.winwith}/${data.with - data.winwith} (${data.with} games)`,
                `**${this.get("history_as_winrate")}:** ${Math.round(data.winwith / data.with * 10000) / 100}%`
            ].join("\n"),
            inline: true
        }, {
            name: this.get("history_with_against"),
            value: [
                `**${data.p1_name}'s wins:** ${data.against[data.p1]}`,
                `**${data.p2_name}'s wins:** ${data.against[data.p2]}`
            ].join("\n"),
            inline: false
        }]
    };
}

module.exports = historyWithEmbed;
