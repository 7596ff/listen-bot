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

                    let un = usernames.get(term);
                    if (!exact && un && un[0][0] >= 0.75 && un[0][1] == member.username) return true;

                    let nn = nicknames.get(term);
                    if (!exact && nn && un[0][0] >= 0.75 && nn[0][1] == member.nick) return true;
                });

                if (search) {
                    res.all.push(search.id);
                    res.terms[term] = search.id;
                    res.found = true;
                }
            }
        }
    }

    return res;
}

module.exports = searchMembers;
