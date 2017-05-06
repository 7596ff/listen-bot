const fs = require("fs");
const http = require("http");

function getBuffer(url, dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname.split("/").slice(0, -1).join("/"), (err, files) => {
            if (files.includes(dirname.split("/").slice(-1)[0])) {
                fs.readFile(dirname, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            } else {
                let file = fs.createWriteStream(dirname);
                http.get(url, (response) => {
                    response.pipe(file).on("finish", () => {
                        fs.readFile(dirname, (err, data) => {
                            if (err) reject(err);
                            resolve(data);
                        });
                    });
                });
            }
        });
    });
}

module.exports = getBuffer;
