const FuzzySet = require("fuzzyset.js");

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
        let threshold = 0.5;

        let matchedUsername = usernames.get(terms.join(" "));
        if (matchedUsername && matchedUsername[0][0] >= threshold && matchedUsername[0][1]) {
            let member = members.find((member) => member.username == matchedUsername[0][1]);
            res.all.push(member.id);
            res.terms[terms.join(" ")] = member.id;
            res.found = true;
        }

        let matchedNickname = nicknames.get(terms.join(" "));
        if (matchedNickname && matchedNickname[0][0] >= threshold && matchedNickname[0][1]) {
            let member = members.find((member) => member.nick == matchedNickname[0][1]);
            if (!~res.all.indexOf(member.id)) {
                res.all.push(member.id);
                res.terms[terms.join(" ")] = member.id;
                res.found = true;
            }
        }
    }

    return res;
}

module.exports = searchMembers;
