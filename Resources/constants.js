/**
 * Define app level constants here
 * -------------------------------
 * Created by Lakshya Dev
 * Created on 20-March-2020
 */

/************************************************************************************/

// DialogFlow intents
const intents = {
    CHANGE_OBJ_COLOR: 'change-obj-color',
    OPEN_ACTIVITY: 'open-activity',
    PRODUCT_INFO: 'product-info',
    CHECK_WARRANTY: 'check-warranty',
    CHECK_PRICE: 'check-price'
}

// File paths for dummy db
const path = require('path');
const filePaths = {
    DUMMY_DB_DIR: path.resolve(__dirname + '/DummyDB'),
    // PRODUCT_DATA: path.resolve('./../Resources/DummyDB/productData.json'),
    PRODUCT_DATA: path.resolve( __dirname + '/DummyDB/productData.json'),
    CHAT_HISTORY: path.resolve(__dirname + '/DummyDB/chatHistory.json')
}

// Utility file paths
const utilPaths = {
    CONVERSATION_UTILS: path.resolve(__dirname + '/Utils/chatUtils.js'),
    FILE_SYSTEM_UTILS: path.resolve(__dirname + '/Utils/fileSystemUtils.js')
}

/************************************************************************************/
module.exports = {
    intents, filePaths, utilPaths
}