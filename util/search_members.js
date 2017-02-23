function search_members(members, terms) {
    let res = [];

    for (let i = 0; i <= terms.length; i++) {
        for (let j = 0; j <= terms.length; j++) {
            if (i < j) {
                let term = terms.slice(i, j).join(" ").toLowerCase();
                console.log(term)
                let search = members.find(member => {
                    if (member.username.toLowerCase() === term) return true;
                    if (member.nick && member.nick.toLowerCase() === term) return true;
                });
                if (search) res.push(search.id);
            }
        }
    }

    return res;
}

module.exports = search_members;
