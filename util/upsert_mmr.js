function upsert_mmr(pg, mika, row, force) {
    return new Promise((resolve, reject) => {
        if (!force || (row.sat && parseInt(row.sat) + 604800000 > Date.now())) {
            resolve(row);
        } else {
            mika.getPlayer(row.dotaid).then(player => {
                let now = Date.now();
                pg.query({
                    "text": "UPDATE public.users SET scr = $1, cr = $2, sat = $3 WHERE dotaid = $4;",
                    "values": [player.solo_competitive_rank || 0, player.competitive_rank || 0, now, row.dotaid]
                }).then(() => {
                    row.scr = player.solo_competitive_rank;
                    row.cr = player.competitive_rank;
                    row.sat = now;
                    resolve(row);
                }).catch(err => {
                    err._origin = "postgres";
                    reject(err);
                });
            }).catch(err => {
                err._origin = "mika";
                reject(err);
            });
        }
    });
}

module.exports = upsert_mmr;
