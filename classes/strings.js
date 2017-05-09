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
            return str;
        }
    }

    all(str, delim) {
        let res = this._keys.filter((item) => item.includes(str));

        if (res) {
            res = res
                .map((item) => this._strings[item])
                .join(delim || "\n");

            if (arguments.length > 2) {
                return sprintf(res, ...Array.from(arguments).slice(2));
            } else {
                return res;
            }
        } else {
            return res;
        }
    }
}

module.exports = Strings;
