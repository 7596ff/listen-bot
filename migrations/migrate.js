const util = require("util");

module.exports = (message, client, helper) => {  
        util.log("migrating...");
        let guilds_list = require("../json/guilds.json");

        client.pg.query("CREATE TABLE IF NOT EXISTS public.guilds (" +
            "id BIGINT NOT NULL," + 
            "name VARCHAR (100)," + 
            "prefix VARCHAR(20)," + 
            "climit INT," +
            "mlimit INT," + 
            "PRIMARY KEY (id)" + 
            ");").then(res => {
                for (gid in guilds_list) {
                    qstring = "INSERT INTO public.guilds (id, name, prefix, climit, mlimit) VALUES (" + 
                        `'${gid}',` + 
                        `'${guilds_list[gid].name.replace("'", "")}',` + 
                        `'${guilds_list[gid].prefix}',` + 
                        `'${guilds_list[gid].channel_limit || 0}',` + 
                        `'${guilds_list[gid].member_limit || 0}'` + 
                        ");"
                    console.log(qstring);
                    client.pg.query(qstring).then(res => {
                            util.log(`migrated ${gid}/${guilds_list[gid].name}`);
                            util.log(res);
                        }).catch(err => {
                            console.error(`something went wrong with inserting ${gid}/${guilds_list[gid].name}`);
                            console.error(err);
                        });
                }
            }).catch(err => {
                console.error("something went wrong with creating the table");
                console.error(err);
            });
    
};
