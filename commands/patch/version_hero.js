const patch_list = require('../../json/patch.json')
const short_heroes = require('../../json/short_heroes.json')

const patch_hero_embed = require('./patch_hero_embed')

module.exports = (message, client, helper, version, hero) => {
    helper.log(message, `patch: version (${version}) and hero name (${hero})`)
    if (patch_list.data[patch_list.schema.indexOf(version)]['heroes'][short_heroes[hero]]) {
        client.createMessage(message.channel.id, {
            "embed": patch_hero_embed(short_heroes[hero], patch_list.schema.indexOf(version), helper.prefix)
        }).then(new_message => {
            helper.log(message, "  sent patch message")
        }).catch(err => helper.log(message, err))
    } else {
        helper.log(message, "  couldn't find that version, sending latest")
        for (hero_list in patch_list.data) {
            if (short_heroes[hero] in patch_list.data[hero_list]['heroes']) {
                client.createMessage(message.channel.id, {
                    "content": "Can't find that version! Here's the latest: ",
                    "embed": patch_hero_embed(short_heroes[hero], hero_list, helper.prefix)
                }).then(new_message => {
                    helper.log(message, "  sent latest patch message")
                }).catch(err => helper.log(message, err))
                return
            }
        }
    }
}