const util = require("util");

function add_trivia(pg) {
    pg.query("ALTER TABLE guilds ADD trivia bigint; UPDATE guilds SET trivia = 0;").then(res => {
        util.log(res);
    }).catch(err => {
        util.log(err);
    });
}

function add_scores(pg) {
    pg.query([
        "CREATE TABLE scores (",
        "id BIGINT,",
        "score BIGINT,",
        "PRIMARY KEY (id)",
        ");"
    ].join(" ")).then(res => {
        util.log(res);
    }).catch(err => {
        util.log(err);
    });
}

function add_streaks(pg) {
    pg.query("ALTER TABLE scores ADD streak bigint; UPDATE scores SET streak = 0;").then(res => {
        util.log(res);
    }).catch(err => {
        util.log(err);
    });
}

module.exports = {
    "add_trivia": add_trivia,
    "add_scores": add_scores,
    "add_streaks": add_streaks
}
