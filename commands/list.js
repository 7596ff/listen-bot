const patch_list = require('../json/patch.json')
const short_heroes = require('../json/short_heroes.json')
const talents = require('../json/talents.json')

module.exports = (message, client, helper) => {
    let hero = message.content.toLowerCase().split(' ')
    hero.shift()
    hero = hero.join(' ')

    if (hero in short_heroes) {
        let patches = []
        let found = false
        let patch_seq_num = 0
        while (!found) {
            if (patch_list.data[patch_seq_num]) {
                if (patch_list.data[patch_seq_num].heroes[short_heroes[hero]]) {
                    patches.push(patch_list.data[patch_seq_num].version)
                }
            } else {
                found = true
            }
            patch_seq_num++
        }
        client.createMessage(message.channel.id, `${talents[short_heroes[hero]].format_name} has changed in ${patches.join(', ')}`).then(new_message => {
            helper.log(message, `listed hero (${short_heroes[hero]})`)
        }).catch(err => helper.handle(message, err))
    }
}
