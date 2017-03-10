module.exports = (client, user_id) => {
    return client.pg.query({
        "text": "UPDATE SCORES SET banned = NOT banned WHERE id = $1;",
        "values": [user_id]
    }).catch(err => client.helper.log("postgres", err));
};
