const abilities = require("../json/abilities.json");
const items = require("../json/items.json");
//const talents = require("../json/talents.json");

module.exports = () => {
    let questions = [];

    abilities.forEach(ability => {
        if (ability.manacost) {
            if (ability.manacost.match(/[ ]/g)) {
                ability.manacost.split(" ").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Mana Cost: Level ${index + 1} ${ability.name}`,
                        "answer": array[index].toString().trim()
                    });
                });
            }

            if (ability.manacost.match(/[\/]/g)) {
                ability.manacost.split("/").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Mana Cost: Level ${index + 1} ${ability.name}`,
                        "answer": array[index].toString().trim()
                    });
                });
            }

            if (!ability.manacost.match(/[ ]/g) && ability.manacost.match(/[\/]/g)) {
                questions.push({
                    "question": "Mana Cost: ${ability.name}",
                    "answer": ability.manacost.toString().trim()
                });
            }
        }

        if (ability.cooldown) {
            if (ability.cooldown.match(/[ ]/g)) {
                ability.cooldown.split(" ").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Cooldown: Level ${index + 1} ${ability.name}`,
                        "answer": array[index].toString().trim()
                    });
                });
            }

            if (ability.cooldown.match(/[\/]/g)) {
                ability.cooldown.split("/").forEach((cost, index, array) => {
                    questions.push({
                        "question": `Cooldown: Level ${index + 1} ${ability.name}`,
                        "answer": array[index].toString().trim()
                    });
                });
            }

            if (!ability.cooldown.match(/[ ]/g) && ability.cooldown.match(/[\/]/g)) {
                questions.push({
                    "question": "Cooldown: ${ability.name}",
                    "answer": ability.cooldown.toString().trim()
                });
            }
        }

        if (ability.stats) {
            ability.stats.forEach(attribute => {
                let attr = attribute.match(": ") ? attribute.split(": ") : attribute.split(" ");
                if (attribute.match(": ")) {
                    if (attr[1].match(/[/]/g)) {
                        attr[1].split("/").forEach((item, index) => {
                            questions.push({
                                "question": `${attr[0]}: Level ${index + 1} ${ability.name}`,
                                "answer": item.toString().trim()
                            });
                        });
                    } else {
                        questions.push({
                            "question": `${ability.name}: ${attr[0]}`,
                            "answer": attr[1].toString().trim()
                        });
                    }
                } else {
                    questions.push({
                        "question": `${ability.name}: ${attr.slice(1).join(" ")}?`,
                        "answer": attr[0].toString().trim()
                    });
                }
            });
        }

        if (ability.effects) {
            ability.effects.forEach(attribute => {
                let attr = attribute.match(": ") ? attribute.split(": ") : attribute.split(" ");
                if (attribute.match(": ")) {
                    if (attr[1].match(/[/]/g)) {
                        attr[1].split("/").forEach((item, index) => {
                            questions.push({
                                "question": `${attr[0]}: Level ${index + 1} ${ability.name}`,
                                "answer": item.toString().trim()
                            });
                        });
                    } else {
                        if (!attr[0] == "Behavior") {
                            questions.push({
                                "question": `${ability.name}: ${attr[0]}`,
                                "answer": attr[1].toString().trim()
                            });
                        }
                    }
                } else {
                    questions.push({
                        "question": `${ability.name}: ${attr.slice(1).join(" ")}?`,
                        "answer": attr[0].toString().trim()
                    });
                }
            });
        }
    });

    items.forEach(item => {
        if (!["diffusal_blade", "necronomicon", "dagon"].includes(item.true_name)) {
            if (item.manacost) {
                questions.push({
                    "question": `Mana Cost: ${item.format_name}`,
                    "answer": item.manacost.toString().trim()
                });
            }

            if (item.cooldown) {
                questions.push({
                    "question": `Cooldown: ${item.format_name}`,
                    "answer": item.cooldown.toString().trim()
                });
            }

            if (item.attributes) {
                item.attributes.forEach(attribute => {
                    let attr = attribute.match(": ") ? attribute.split(": ") : attribute.split(" ");
                    if (attribute.match(": ")) {
                        questions.push({
                            "question": `${item.format_name}: ${attr[0]}`,
                            "answer": attr[1].toString().trim()
                        });
                    } else {
                        questions.push({
                            "question": `${item.format_name}: ${attr.slice(1).join(" ")}?`,
                            "answer": attr[0].toString().trim()
                        });
                    }
                });
            }
        }
    });

    // talents.forEach(talent => {
    //     talent.keys().forEach(key => {
    //         if (!isNaN(key)) {
    //             talent[key].forEach(tale => {
    //                 let's do this later
    //             });
    //         }
    //     });
    // });

    return questions;
};
