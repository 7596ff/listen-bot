const choices = ["mike", "arteezy", "envy"];

module.exports = (message, client, helper) => {
    client.core.commands[choices[Math.floor(Math.random() * choices.length)]](message, client, helper);
};
