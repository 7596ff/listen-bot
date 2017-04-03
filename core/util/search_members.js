function search_members(members, terms) {
    let res = {
        "all": [],
        "terms": {},
        "found": false
    };

    for (let i = 0; i <= terms.length; i++) {
        for (let j = 0; j <= terms.length; j++) {
            if (i < j) {
                let term = terms.slice(i, j).join(" ").toLowerCase();
                let search = members.find(member => {
                    if (member.username.toLowerCase() === term) return true;
                    if (member.nick && member.nick.toLowerCase() === term) return true;
                    if (term.split(" ").length == 1 && term.match(member.id)) return true;
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

module.exports = search_members;
