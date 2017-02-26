module.exports = (key) => {
    return key.replace(/'/g, "").replace(/ /g, "_").toLowerCase();
};
