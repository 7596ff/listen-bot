const clean = (text) => {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
}

module.exports = (message, client, helper) => {
  let params = message.content.split(' ').splice(1)
  
  if (message.member.id == '102645408223731712') {
    try {
      var code = params.join(" ")
      var evaled = eval(code)

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled)

      client.createMessage(message.channel.id, `${"```js\n"}${clean(evaled)}${"\n```"}`)
    } catch (err) {
      client.createMessage(message.channel.id, `${"`ERROR`\n```js\n"}${clean(err)}${"\n```"}`)
    }
  }
}
