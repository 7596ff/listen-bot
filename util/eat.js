const search_members = require("./search_members");

function eat(message, options) {
    return new Promise(resolve => {
        let searches = Object.keys(options);
        let responses = {};

        for (let search in options) {
            let type = options[search];
            let split = message.content.split(" ");
            let not_search = searches.slice(0);
            not_search.splice(searches.indexOf(search), 1);

            let first_found = split.includes(search) ? split.indexOf(search) : false;

            let outer_bound = false;
            not_search.forEach(term => {
                if (split.indexOf(term) > split.indexOf(search)) outer_bound = split.indexOf(term);
            });

            if (first_found) {
                let res = split.slice(first_found + 1, outer_bound || split.length);
                switch(type) {
                case "string":
                    responses[search] = res.join(" ");
                    break;
                case "member":
                    responses[search] = search_members(message.channel.guild.members, res);
                    break;
                }
            }
        }

        resolve(responses);
    });
}

module.exports = eat;
