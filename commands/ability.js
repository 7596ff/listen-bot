const short_heroes = require('../json/short_heroes.json')
const keys = require('../json/keys.json')
const abilities = require('../json/abilities.json')

function capitalize_first(key) {
    words = key.split(' ')
    for (word in words) {
        words[word] = words[word].substr(0, 1).toUpperCase() + words[word].substr(1, words[word].length)
    }
    return words.join(' ')
}

function ability_embed(hero, ability) {
    let ability_obj = abilities[hero][ability]
    let temp = {
        "stats": new Array(ability_obj.stats.length, ""),
        "effects": new Array(ability_obj.effects.length, "")
    }

    if (ability_obj.stats) {
        for (stat in ability_obj.stats) {
            let temp_arr = ability_obj.stats[stat].split(": ")
            temp.stats[stat] = `**${temp_arr[0]}** ${temp_arr[1]}`
        }
    }

    if (ability_obj.effects) {
        for (eff in ability_obj.effects) {
            let temp_arr = ability_obj.effects[eff].split(": ")
            temp.effects[eff] = `**${temp_arr[0]}** ${temp_arr[1]}`
        }
    }

    let mana = ability_obj.manacost ? ability_obj.manacost.split(' ').join(' / ') : "None"
    let cool = ability_obj.cooldown ? ability_obj.cooldown.split(' ').join(' / ') : "Passive"
    let desc = ability_obj.description ? ability_obj.description.join('\n') : ""
    let note = ability_obj.notes ? ability_obj.notes.join('\n') : ""
    let agha = ability_obj.agha ? ability_obj.agha : ""

    return {
        "author": {
            "name": ability,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero}_vert.jpg`
        },
        "description": `${desc}\n\n${note}\n\n${agha}`,
        "fields": [
            {
                "name": `<:manacost:273091790603550730> ${mana}`,
                "value": temp.stats.join('\n'),
                "inline": true
            },
            {
                "name": `<:cooldown:273091737617170432> ${cool}`,
                "value": temp.effects.join('\n'),
                "inline": true
            }
        ]
    }
}

function create_message(message, client, helper, true_hero, ability, key) {
    if (key = ability) {
        helper.log(message, `ability: hero name (${true_hero}) and ability (${ability})`)
    } else {
        helper.log(message, `ability: hero name (${true_hero}) and ability (${key}: ${ability})`)
    }
    client.createMessage(message.channel.id, {
        embed: ability_embed(true_hero, ability)
    }).then(new_message => {
        helper.log(message, '  sent ability message')
    }).catch(err => helper.handle(message, err))
}

module.exports = (message, client, helper) => {
    let options = message.content.toLowerCase().split(' ')
    options.shift()
    for (let i = 0; i < options.length; i++) {
        let key = capitalize_first(options.slice(options.length - i, options.length).join(' '))
        let hero = options.slice(0, options.length - i).join(' ')

        if (hero in short_heroes) {
            let true_hero = short_heroes[hero]
            if (true_hero == "invoker" && key.length == 3) key = key.toLowerCase().split('').sort().join('').toUpperCase()
            
            if (key in keys[true_hero]) {
                let ability = keys[true_hero][key]
                create_message(message, client, helper, true_hero, ability, key)
            }
            
            if (key in abilities[true_hero]) {
                create_message(message, client, helper, true_hero, key, key)
            }
        }
    }
}
