function queryString(options) {
    let str = [];
    for (let p in options) {
        if (options.hasOwnProperty(p)) {
            if (Array.isArray(options[p])) {
                for (let index of options[p]) {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(index)}`);
                }
            } else {
                str.push(`${encodeURIComponent(p)}=${encodeURIComponent(options[p])}`);
            }
        }
    }
    return `?${str.join("&")}`;
}

module.exports = queryString;
