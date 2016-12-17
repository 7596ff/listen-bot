const clean  = (text) => {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
}

module.exports = (message) => {
  let params = message.content.split(' ').splice(1)
  
  if (message.member.id == '102645408223731712') {
    try {
      var code = params.join(" ")
      var evaled = eval(code)

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled)

      message.channel.sendCode("xl", clean(evaled))
    } catch (err) {
      message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
    }
  }
}