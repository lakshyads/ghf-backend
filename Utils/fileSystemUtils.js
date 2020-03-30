const fs = require("fs");

function createFile(path, data) {
    fs.writeFileSync(path, data, (err, res) => {
        if (err) console.log(err);
        console.log(res);
    });
}

function readFileAsJSON(path) {
    let rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata);
}

module.exports = {
    fs, createFile, readFileAsJSON
}