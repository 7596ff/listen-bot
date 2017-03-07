const util = require("util");

module.exports = (pg) => {
    pg.query("ALTER TABLE guilds ADD trivia bigint; UPDATE guilds SET trivia = 0;").then(res => {
        util.log(res);
    }).catch(err => {
        util.log(err);
    });
};
