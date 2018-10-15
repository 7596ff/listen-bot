const util = require("util");

module.exports = (message, client, helper) => {  
    if (message.member.id == "102645408223731712") {
        util.log("migrating...");
        let guilds_list = require("../json/guilds.json");

        client.guilds.forEach(guild => {
            client.pg.query(`SELECT * FROM public.guilds WHERE id = '${guild.id}';`).then(res => {
                if (res.rowCount != 1) {
                    qstring = "INSERT INTO public.guilds (id, name, prefix, climit, mlimit) VALUES (" + 
                        `'${guild.id}',` + 
                        `'${guild.name.replace("'", "")}',` + 
                        `'${require("../json/config.json").default_prefix}',` + 
                        `'0',` + 
                        `'0'` + 
                        ");"
                    console.log(qstring);
                    client.pg.query(qstring).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.error(err);
                    });
                }
            }).catch(err => {
                console.error(err);
            });
        });
    }
};
