const sprintf = require("sprintf-js").sprintf;

class Strings {
    constructor(strings) {
        this._strings = strings;
        this._keys = Object.keys(strings);
    }

    get(str) {
        if (~this._keys.indexOf(str)) {
            if (arguments.length > 1) {
                return sprintf(this._strings[str], ...Array.from(arguments).slice(1));
            } else {
                return this._strings[str];
            }
        } else {
            console.error(`BAD STRING: ${str}`);
            return str;
        }
    }

    all(str, delim) {
        let res = this._keys.filter((item) => item.includes(str));

        if (res) {
            res = res.map((item) => this._strings[item]);
            if (delim !== "array") res = res.join(delim || "\n");

            if (arguments.length > 2) {
                if (Array.isArray(res)) {
                    let temp = res.join("\n");
                    temp = sprintf(temp, ...Array.from(arguments).slice(2));
                    return temp.split("\n");
                } else {
                    return sprintf(res, ...Array.from(arguments).slice(2));
                }
            } else {
                return res;
            }
        } else {
            return false;
        }
    }
}

module.exports = Strings;
