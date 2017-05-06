async function exec(ctx) {
    return ctx.send("You forgot to write this u idiot");
}

module.exports = {
    name: "help",
    category: "meta",
    exec
};
