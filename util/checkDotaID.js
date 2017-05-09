async function checkDotaID(pg, id) {
    try {
        let res = await pg.query({
            "text": "SELECT * FROM public.users WHERE dotaid = $1",
            "values": [id]
        });

        if (res.rows.length) {
            return Promise.resolve(res.rows[0].id);
        } else {
            return Promise.resolve(null);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = checkDotaID;
