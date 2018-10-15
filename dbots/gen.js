const fs = require("fs");
const help = require("../core/locale/en").com.help_topics;

let bulma = ['<div class="block">',
    '<a href="https://discord.gg/qRE5aWh" class="button is-primary">Help Server</a>',
    '</div>'
];

for (let cat in help) {
    bulma.push(`<h1>${cat.charAt(0).toUpperCase()}${cat.slice(1)} Commands</h1>`);
    cat = help[cat];

    bulma.push('<table class="table is-bordered"><thead><tr><th>Command</th><th>Description</th><th>Example</th><th>Aliases</th></tr></thead><tbody>');
    
    for (let topic in cat) {
        topic = cat[topic];

        bulma.push('<tr>');

        bulma.push(`<td>${topic.name}</td>`);
        bulma.push(`<td>${topic.summary}</td>`);
        let code = topic.example ? `<code>--${topic.example}</code>` : "";
        bulma.push(`<td>${code}</td>`)
        bulma.push(`<td>${topic.aliases ? topic.aliases.join(", ") : ""}</td>`)

        bulma.push('</tr>')
    }

    bulma.push('</tbody></table>');
}

fs.writeFile("./bulma.html", bulma.join(""), (err) => {
    if (err) console.log(err);
    console.log('wrote')
})
