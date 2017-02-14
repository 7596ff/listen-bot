module.exports = (key) => {
    return key.replace("'", "").replace(" ", "_").toLowerCase();
}
