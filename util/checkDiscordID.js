async function checkDiscordID(pg, id) {
    try {
        let res = await pg.query({
            "text": "SELECT * FROM public.users WHERE id = $1",
            "values": [id]
        });

        if (res.rows.length && res.rows[0].dotaid) {
            return Promise.resolve(res.rows[0].dotaid);
        } else {
            return Promise.resolve(null);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = checkDiscordID;
