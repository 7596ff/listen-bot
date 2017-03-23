const qwedfr = {
    "Q": 0,
    "W": 1,
    "E": 2,
    "D": 3,
    "F": 4,
    "R": 5
};

const reverse = {
    "0": "Q",
    "1": "W",
    "2": "E",
    "3": "D",
    "4": "F",
    "5": "R"
};

module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;

    let abilities = client.core.json.abilities;
    let heroes = client.core.json.heroes;
    let find_hero = client.core.util.find_hero;
    let hero_embed = client.core.embeds.hero;
    
    let alias = message.content.split(" ").slice(1).join(" ").toLowerCase();
    helper.log(message, `hero: ${alias}`);
    find_hero(alias).then(res => {
        let hero_obj = heroes.find(hero => hero.true_name == res);
        hero_obj.abilities = abilities
            .filter(ability => ability.hero_name == hero_obj.true_name)
            .map(ability => `${ability.key.toUpperCase()} - ${ability.name}`);

        hero_obj.abilities.forEach((item, index) => {
            hero_obj.abilities[index] = item.replace(/[QWEDFR]/, match => qwedfr[match]);
        });

        hero_obj.abilities.sort();

        hero_obj.abilities.forEach((item, index) => {
            hero_obj.abilities[index] = item.replace(/[012345]/, match => reverse[match]);
        });

        message.channel.createMessage({
            "embed": hero_embed(client, hero_obj)
        }).then(() => {
            helper.log(message, "sent hero embed");
        }).catch(err => {
            helper.handle(message, err);
        });
    }).catch(err => {
        if (!err) {
            helper.log(message, `hero: couldn't find ${alias}`);
        } else {
            helper.log(message, err.toString());
        }
    });
};
