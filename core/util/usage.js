class Usage {
    constructor(stats) {
        if (stats) {
            this._stats = stats;
        } else {
            this._stats = { "all": 0 };
        }
    }

    increment(field) {
        this._stats[field] ? this._stats[field] += 1 : this._stats[field] = 1;
        this._stats.all += 1;
    }

    get stats() {
        return this._stats;
    }
}

module.exports = Usage;
