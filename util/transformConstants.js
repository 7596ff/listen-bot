function transformConstants(constant) {
    let keys = Object.keys(constant);
    let values = Object.values(constant);

    return keys.map((key, index) => {
        let value = values[index];
        value.name = key;
        return value;
    });
}

module.exports = transformConstants;
