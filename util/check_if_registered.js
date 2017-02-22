module.exports = (client, dota_id) => {
    return new Promise((resolve, reject) => {
        client.pg.query({
            "text": "SELECT * FROM public.users WHERE dotaid = $1",
            "values": [dota_id]
        }).then(res => {
            if (res.rowCount != 0) {
                resolve({
                    "discord_id": res.rows[0].id,
                    "dota_id": res.rows[0].dotaid
                });
            } else {
                resolve(undefined);
            }
        }).catch(err => {
            reject(err);
        });
    });
};
