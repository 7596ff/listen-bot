module.exports = (message, client, helper) => {
    require("./patch")(message, client, helper);
};
