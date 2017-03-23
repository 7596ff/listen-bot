module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;
    
    let hero = message.content.split(" ").slice(1).join(" ").toLowerCase();
    client.core.util.find_hero(hero).then(res => {
        let underscore = client.core.json.od_heroes.find(od_hero => od_hero.name == `npc_dota_hero_${res}`).localized_name.split(" ").join("_");
        message.channel.createMessage(`<http://dota2.gamepedia.com/${underscore}>`).then(() => {
            helper.log(message, `sent wiki link (${res})`);
        }).catch(err => helper.handle(message, err));
    }).catch(() => {
        helper.log(message, `wiki: couldn't find hero ${hero}`);
    });
};
