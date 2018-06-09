module.exports = (client) => {
    client.pg.query("ALTER TABLE users ALTER COLUMN steamid DROP NOT NULL; ALTER TABLE users ALTER COLUMN dotaid DROP NOT NULL;").then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};
