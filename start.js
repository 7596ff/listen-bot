const pm2 = require("pm2");
const async = require("async");

const apps = require("./apps.json");
const config = require("./config.json");

apps.services = apps.services.map((service) => {
    service.name = `${config.pm2_prefix}${service.name}`;
    return service;
});

apps.bot.name = `${config.pm2_prefix}${apps.bot.name}`;

pm2.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    async.each(apps.services, (app, cb) => {
        console.log(`starting ${app.name}`);
        pm2.start(app, cb);
    }, (err) => {
        if (err) {
            console.error(err);
            pm2.disconnect();
            process.exit(1);
        } else {
            setTimeout(() => {
                console.log("starting bot");
                pm2.start(apps.bot, (err) => {
                    if (err) console.error(err);
                    pm2.disconnect();
                    process.exit(err ? 1 : 0);
                });
            }, 1500);
        }
    })
});
