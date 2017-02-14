module.exports = (key) => {
    let words = key.split(" ");
    let short_words = ["of", "and", "in", "the", "de"];
    for (let word in words) {
        if (short_words.indexOf(words[word]) == -1) {
            words[word] = words[word].substr(0, 1).toUpperCase() + words[word].substr(1, words[word].length);
        }
    }
    return words.join(" ");
}
