module.exports = (pg) => {
    pg.query("ALTER TABLE guilds ADD botspam BIGINT; UPDATE guilds SET botspam = 0;").then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err)
    });
};
