function historyWithEmbed(data) {
    return {
        title: `History between ${data.p1_name} and ${data.p2_name}`,
        fields: [{
            name: "With",
            value: [
                `**Win/Loss:** ${data.winwith}/${data.with - data.winwith} (${data.with} games)`,
                `**Winrate:** ${Math.round(data.winwith / data.with * 10000) / 100}%`
            ].join("\n"),
            inline: true
        }, {
            name: "Against",
            value: [
                `**${data.p1_name}'s wins:** ${data.against[data.p1]}`,
                `**${data.p2_name}'s wins:** ${data.against[data.p2]}`
            ].join("\n"),
            inline: false
        }]
    };
}

module.exports = historyWithEmbed;
