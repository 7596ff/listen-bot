function search_members(members, terms) {
    let res = [];

    for (let i = 0; i <= terms.length; i++) {
        for (let j = 0; j <= terms.length; j++) {
            if (i < j) {
                let term = terms.slice(i, j).join(" ");
                let search = members.find(member => member.username == term || member.nick == term);
                if (search) res.push(search.id);
            }
        }
    }

    return res;
}

module.exports = search_members;
