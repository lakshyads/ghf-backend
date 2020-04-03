/**
 * Common utilities for easy file system handling
 * ----------------------------------------------
 * Created by - Lakshya Dev
 * Created on - 02-April-2020
 * 
 * Available utils: fs, saveFileAsJson, readFileAsJson, saveFile, readFile
 */

const fs = require(`fs`);

/**Save a JSON object to file
 * @param {*} path Absolute path including file name. If file is not already present, new file will be created.
 * @param {*} data JSON object to be saved to file.
 */
function saveFileAsJson(path, data) {
    console.log(`Saving data to ${path}`);
    try {
        fs.writeFileSync(path, JSON.stringify(data));
        console.log(`Data saved to ${path}.`);
    }
    catch (e) {
        console.error(`Error saving data to ${path}: `, e);
        console.log(`Error saving data to ${path}: `, e);
    }
}

/**Reads a file containing JSON string and return a JSON object
 * @param {*} path Absolute path to a file containing JSON string
 */
function readFileAsJson(path) {
    try {
        let rawdata = fs.readFileSync(path);
        try {
            return JSON.parse(rawdata);
        } catch (e) {
            const message = `Error reading the file as JSON`;
            console.log(`${message} : ${e}`);
            return ({ error: e, message: message });
        }
    }
    catch (e) {
        const message = `Error opening the file`;
        console.log(`${message} : ${e}`);
        return ({ error: e, message: message });
    }
}

/**Save data to file
 * @param {*} path Absolute path including file name. If file is not already present, new file will be created.
 * @param {*} data Data to be saved to file.
 */
function saveFile(path, data) {
    console.log(`Saving data to ${path}`);
    try {
        fs.writeFileSync(path, String(data));
        console.log(`Data saved to ${path}.`);
    }
    catch (e) {
        console.error(`Error saving data to ${path}: `, e);
        console.log(`Error saving data to ${path}: `, e);
    }
}

/**Reads a file and return data as string
 * @param {*} path Absolute path to a file to read
 */
function readFile(path) {
    try {
        let rawdata = fs.readFileSync(path,);
        try {
            return (String(rawdata));
        } catch (e) {
            const message = `Error reading the file`;
            console.log(`${message} : ${e}`);
            return ({ error: e, message: message });
        }
    }
    catch (e) {
        const message = `Error opening the file`;
        console.log(`${message} : ${e}`);
        return ({ error: e, message: message });
    }
}

// ===================EXPORTS===================
module.exports = {
    fs, saveFileAsJson, readFileAsJson, saveFile, readFile
}