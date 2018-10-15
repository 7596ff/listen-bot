const levels = [25, 20, 15, 10];

function talentEmbed(data) {
    let talents = [];

    while (data.talents.length) {
        talents.push(data.talents.splice(0, 2));
    }

    talents.reverse();

    return {
        author: {
            name: data.hero.local,
            url: `http://dota2.gamepedia.com/${data.hero.local.replace(/ /g, "_")}#Talents`,
            icon_url: `http://cdn.dota2.com/apps/dota2/images/heroes/${data.hero.name}_icon.png`
        },
        title: "Talents",
        description: talents.map((row, index) => `**${levels[index]}:** ${row[1].dname} *or* ${row[0].dname}`).join("\n")
    };
}

module.exports = talentEmbed;
