const patch_list = require('../json/patch.json')
const short_heroes = require('../json/short_heroes.json')
const talents = require('../json/talents.json')

module.exports = (message, client, helper) => {
    let hero = message.content.toLowerCase().split(' ')
    hero.shift()
    hero = hero.join(' ')

    if (hero in short_heroes) {
        let patches = []
        let found = 0
        let patch_seq_num = 0
        while (found < 10) {
            if (patch_list.data[patch_seq_num]) {
                if (patch_list.data[patch_seq_num].heroes[short_heroes[hero]]) {
                    patches.push(patch_list.data[patch_seq_num].version)
                    found++
                }
            } else {
                found = 10
            }
            patch_seq_num++
        }
        client.createMessage(message.channel.id, `${talents[short_heroes[hero]].format_name} has changed in ${patches.join(', ')}`)
        helper.log(message, `listed hero (${short_heroes[hero]})`)
    }
}
