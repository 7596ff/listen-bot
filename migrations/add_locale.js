module.exports = (client) => {
    client.pg.query("ALTER TABLE guilds ADD locale varchar(2); UPDATE guilds SET locale = 'en';").then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};
