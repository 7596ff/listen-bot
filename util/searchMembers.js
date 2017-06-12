const FuzzySet = require("fuzzyset.js");

function decideMatch(nick, user) {
    if (!nick) return false;
    if (!user) return true;

    return nick[0][0] > user[0][0];
}

async function searchMembers(members, terms, exact) {
    let res = {
        "all": [],
        "terms": {},
        "found": false
    };

    let usernames = FuzzySet(members.map((member) => member.username));
    let nicknames = FuzzySet(members.filter((member) => member.nick).map((member) => member.nick));

    for (let i = 0; i <= terms.length; i++) {
        for (let j = 0; j <= terms.length; j++) {
            if (i < j) {
                let term = terms.slice(i, j).join(" ").trim();
                let search = members.find((member) => {
                    if (res.all.includes(member.id)) return false;                    
                    if (term.replace(/\D/g, "") === member.id) return true;

                    if (member.username.toLowerCase() == term) return true;
                    if (member.nick && member.nick.toLowerCase() == term) return true;
                });

                if (search) {
                    res.all.push(search.id);
                    res.terms[term] = search.id;
                    res.found = true;
                }
            }
        }
    }

    if (!exact) {
        let threshold = 0.8;

        if (members.size < 5000) {
            threshold = members.size / 5000 * 0.3 + 0.5;
        }

        let matchedUsername = usernames.get(terms.join(" "));
        let matchedNickname = nicknames.get(terms.join(" "));

        let nickOrUser = decideMatch(matchedNickname, matchedUsername);
        let matched = nickOrUser ? matchedNickname : matchedUsername;

        if (matched && matched[0][0] >= threshold && matched[0][1]) {
            let member = members.find((member) => {
                if (nickOrUser) {
                    return member.nick === matched[0][1];
                } else {
                    return member.username === matched[0][1];
                }
            });

            res.all.push(member.id);
            res.terms[terms.join(" ")] = member.id;
            res.found = true;
        }
    }

    res.all = res.all.filter((item, index, array) => array.indexOf(item) === index);

    return res;
}

module.exports = searchMembers;
