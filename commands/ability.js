const short_heroes = require('../json/short_heroes.json')
const keys = require('../json/keys.json')
const abilities = require('../json/abilities.json')

function ability_embed(hero, ability) {
    let ability_obj = abilities[hero][ability]

    fields = [{
        "name": "\u200b",
        "value": ability_obj.effects.join('\n'),
        "inline": true
    }]

    if (ability_obj.stats) {
        fields.unshift({
            "name": "\u200b",
            "value": ability_obj.stats.join('\n'),
            "inline": true
        })
    }

    if (ability_obj.effects[0] != "Behavior: Passive") {
        fields.push({
            "name": "Mana Cost",
            "value": ability_obj.manacost,
            "inline": true
        })
        fields.push({
            "name": "Cooldown",
            "value": ability_obj.cooldown,
            "inline": true
        })
    }

    let desc = ability_obj.description ? ability_obj.description.join('\n') : ""
    let note = ability_obj.notes ? ability_obj.notes.join('\n') : ""

    return {
        "author": {
            "name": ability,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero}_vert.jpg`
        },
        "description": `${desc}\n\n${note}`,
        "fields": fields
    }
}

module.exports = (message, client, helper) => {
    let options = message.content.split(' ')
    options.shift()
    let key = options.pop()
    let hero = options.join(' ')
    let letters = ['q', 'w', 'e', 'd', 'f', 'r']

    if (letters.indexOf(key) == -1) return

    if (hero in short_heroes) {
        let true_hero = short_heroes[hero]

        if (key in keys[true_hero]) {
            let ability = keys[true_hero][key]

            helper.log(message, `ability: hero name (${true_hero}) and ability (${key}: ${ability})`)
            client.createMessage(message.channel.id, {
                embed: ability_embed(true_hero, ability)
            }).then(new_message => {
                helper.log(message, '  sent ability message')
            }).catch(err => helper.handle(message, err))
        }
    }
}
