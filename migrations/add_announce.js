module.exports = (client) => {
    client.pg.query("ALTER TABLE guilds ADD announce bigint; UPDATE guilds SET announce = 0;").then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};
