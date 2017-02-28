module.exports = (message, client, helper) => {
    client.pg.query({
        "text": "SELECT * FROM public.users WHERE id = $1;",
        "values": [message.author.id]
    }).then(res => {
        if (res.rowCount > 0) {
            client.pg.query({
                "text": "DELETE FROM public.users WHERE id = $1;",
                "values": [message.author.id]
            }).then(() => {
                message.channel.createMessage(":ok_hand: Deleted. Sorry to see you go...").catch(err => helper.handle(message, err));
                helper.log(message, "deleted a user");
            });
        } else {
            message.channel.createMessage("You don't have a registration with me.").catch(err => helper.handle(message, err));
        }
    }).catch(err => {
        message.channel.createMessage("Couldn't delete. Use --info and contact me.").catch(err => helper.handle(message, err));
        helper.log(message, "something went wrong deleting from users");
        helper.log(err);
    });
};
