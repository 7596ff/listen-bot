const talents = require('../json/talents.json')
const short_heroes = require('../json/short_heroes.json')

module.exports = (message, client, helper) => {
    let options = message.content.split(' ')
    options.shift()
    let hero = options.join(' ')
    if (hero in short_heroes) {
        let underscore = talents[short_heroes[hero]].format_name.split(' ').join('_')
        client.createMessage(
            message.channel.id, 
            `<http://dota2.gamepedia.com/${underscore}>`
        ).then(new_message => {
            helper.log(message, `sent wiki link (${short_heroes[hero]})`)
        }).catch(err => helper.handle(message, err))
    }
}
