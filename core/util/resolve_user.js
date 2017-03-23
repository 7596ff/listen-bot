module.exports = (client, discord_id) => {
    return new Promise((resolve, reject) => {
        client.pg.query({
            "text": "SELECT * FROM public.users WHERE id = $1",
            "values": [discord_id]
        }).then(res => {
            if (res.rowCount == 1) {
                resolve(res.rows[0].dotaid);
            } else {
                reject("nouser");
            }
        }).catch(err => {
            reject(err);
        });
    });
};
