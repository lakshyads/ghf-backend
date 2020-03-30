const fs = require("fs");

function createFile(path, data) {
    console.log("Saving data to dummy db");
    try{
        fs.writeFileSync(path, data);
        console.log("Data saved to dummy DB.");
    }
    catch(e){
        console.error("Error saving data to dummy db: ", e);
        console.log("Error saving data to dummy db: ", e);
    }
}

function readFileAsJSON(path) {
    let rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata);
}

module.exports = {
    fs, createFile, readFileAsJSON
}