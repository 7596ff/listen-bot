module.exports = (message, client, helper) => {
    let locale = client.core.locale[message.gcfg.locale].com.admin.disable;

    let to_enable = message.content.split(" ");
    client.pg.query({
        "text": "SELECT * FROM guilds WHERE id = $1",
        "values": [message.channel.guild.id]
    }).then(res => {
        let disabled = res.rows[0].disabled;
        let oldlist = disabled[message.channel.id];

        if (!disabled || !oldlist) {
            message.channel.createMessage("Disable some commands first!");
            return;
        }

        for (let val of to_enable) {
            let index = oldlist.indexOf(val);
            if (index > -1) oldlist.splice(index, 1);
        }

        client.pg.query({
            "text": "UPDATE public.guilds SET disabled = $1 WHERE id = $2",
            "values": [disabled, message.channel.guild.id]
        }).then(() => {
            helper.log(message, `enabled some commands, new list: ${oldlist.join(" ")}`);
            let prettylist = oldlist.map(item => `\`${item}\``).join(" ");
            prettylist = oldlist.length > 0 ? client.sprintf(locale.confirmsome, prettylist) : prettylist = locale.confirmnone;
            message.channel.createMessage(prettylist);
        }).catch(err => {
            helper.log(message, "something went wrong with updating guild with disabled list");
            helper.log(message, err);
        });
    }).catch(err => {
        helper.log(message, "something went wrong with selecting guild from DB inside admin");
        helper.log(message, err);
    });
};
