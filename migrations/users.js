const pg = require("pg");

module.exports = client => {
    var devconfig = JSON.parse(JSON.stringify(client.config.pgconfig));
    devconfig.database = "listendev";
    var dev = new pg.Client(devconfig);
    dev.connect((err) => {
        if (err) console.log(err);
        console.log("dev pg connected.");
        dev.query({
            "text": "SELECT * FROM public.users;"
        }).then(res => {
            for (row in res.rows) {
                client.pg.query({
                    "text": "SELECT * FROM public.users WHERE id = $1;",
                    "values": [res.rows[row].id]
                }).then((newres) => {
                    if (newres.rowCount == 0) {
                        client.pg.query({
                            "text": "INSERT INTO public.users (id, steamid, dotaid) VALUES ($1, $2, $3);",
                            "values": [discord_id, parseInt(steam_id), parseInt(dota_id)]
                        }).then(() => {
                            util.log(`  inserted dota id ${dota_id}`);
                        }).catch(err => {
                            util.log("  something went wrong inserting a user");
                            util.log(err);
                        });
                    } else {
                        client.pg.query({
                            "text": "UPDATE public.users SET id = $1, steamid = $2, dotaid = $3 WHERE id = $1;",
                            "values": [discord_id, parseInt(steam_id), parseInt(dota_id)]
                        }).then(() => {
                            util.log(`  updated dota id ${newres.rows[0].dotaid} -> ${dota_id}`);
                        }).catch(err => {
                            util.log("  something went wrong updating a user");
                            util.log(err);
                        });
                    }
                })
            }
        }).catch(err => {
            util.log("  something went wrong selecting a user");
            util.log(err);
        });
    })
};