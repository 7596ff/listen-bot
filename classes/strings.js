const sprintf = require("sprintf-js").sprintf;

class Strings {
    constructor(strings, base) {
        this._strings = strings;
        this._keys = Object.keys(strings);
        this._base = base;
    }

    get(str) {
        if (this._keys.includes(str)) {
            if (arguments.length > 1) {
                return sprintf(str, ...arguments.slice(1));
            } else {
                return str;
            }
        }

        let filtered = this._keys.filter((key) => key.includes(str));
        if (filtered.length) {
            return filtered.map((key) => this._strings[key]);
        }
    }
}

module.exports = Strings;
