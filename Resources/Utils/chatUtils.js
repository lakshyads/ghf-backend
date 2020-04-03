/**
 * Utilities for user and agent dialogs
 * ----------------------------------------------
 * Created by - Lakshya Dev
 * Created on - 02-April-2020
 * 
 * Available utils: saveDialog, getChatHistory, clearChatHistory
 */

/************************************************************************************/
// Imports
const { getCurrentDateTime } = require('./commonUtils');
const { saveFileAsJson, readFileAsJson } = require('./fileSystemUtils');
/************************************************************************************/

/**Save dialogFlow chat dialog to chatHistory.json
 * @param {*} path path to storage (JSON file)
 * @param {*} queryText user query
 * @param {*} fulfillmentText agent response
 */
function saveDialog(path, queryText, fulfillmentText) {
    let chatHistory = [];
    let didSave = false;    
    const dialog = {
        queryText: queryText,
        fulfillmentText: fulfillmentText,
        timestamp: getCurrentDateTime(false)
    }
    try {
        chatHistory = getChatHistory(path);
        chatHistory.push(dialog);
        saveFileAsJson(path,chatHistory);
        didSave = true;
    }
    catch(e){
        console.log(`${getCurrentDateTime()} : Error saving dialog: ${e}`)
    }
    return didSave;
}

/**Get current chat History 
 * @param {*} path path to storage (JSON file)
 */
function getChatHistory(path) {
    const chatHistory = readFileAsJson(path);
    return chatHistory;
 }

/**Clear full chat history 
 * @param {*} path path to storage (JSON file)
 */
function clearChatHistory(path) {
    let chatHistory = [];
    let didClear = false;
    try {
        saveFileAsJson(path,chatHistory);
        didClear = true;
    }
    catch(e){
        console.log(`[${getCurrentDateTime}]:Error clearing history: ${e}`)
    }
    return didClear;
 }

/************************************************************************************/
module.exports = {
    saveDialog, getChatHistory, clearChatHistory
}