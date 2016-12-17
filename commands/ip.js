const send_ip = () => {
  console.log('sending ip')

  public_ip.v4().then(ip => {
    message.channel.sendMessage(ip).then(new_m => {
      setTimeout(() => {
        util.log('deleting ip')
        new_m.delete()
        message.delete()
      }, 10000)
    }).catch(err => util.log(err))
  }).catch(err => util.log(err))
}

module.exports = message => {
  message.channel.sendMessage('IP removed for pressing ceremonial reasons.')
}

