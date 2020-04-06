/**
 * Great Homes Furniture - Backend
 * ----- ----- ---------   -------
 * Created by Lakshya Dev
 * Created on 15-March-2020
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config({ path: __dirname + '/.env' });
const constants = require('./Resources/constants');
const { fs, saveFileAsJson, readFileAsJson } = require('./Resources/Utils/fileSystemUtils');
const { saveDialog, getChatHistory, clearChatHistory } = require('./Resources/Utils/chatUtils');
const { getCurrentDateTime } = require('./Resources/Utils/commonUtils');

// Load env values & other resources
// const API_KEY = process.env.API_KEY;


// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Initialize server
const server = require('http').Server(app);

// Initialize socket.io connection
const io = require('socket.io')(server);
let socket;
const that = this;
// Handle socket.io events
io.on("connection", skt => {
    socket = skt;

    // Listen for product info broadcast from the app
    socket.on('Product Info', (data) => {
        // TEMP - Save product info to dummyDB.json
        console.log('Product info received', data);
        if (data && data.commondata && data.commondata.price && data.commondata.warData && data.commondata.prodDesc) {
            saveFileAsJson(constants.filePaths.PRODUCT_DATA, data);
        }
    });
});

// Receive product info from the app

// Webhook endpoint
app.post('/ghf-actions', (req, res) => {

    const bodyData = req.body && req.body.queryResult ? req.body.queryResult : null;
    const intentName = bodyData && bodyData.intent && bodyData.intent.displayName ? bodyData.intent.displayName : null;
    const params = bodyData && bodyData.parameters && bodyData.parameters ? bodyData.parameters : null;
    let fulfillmentText = bodyData && bodyData.fulfillmentText ? bodyData.fulfillmentText : "";
    const queryText = bodyData && bodyData.queryText ? bodyData.queryText : null;

    // Process intents
    if (intentName.toLowerCase() === constants.intents.CHANGE_OBJ_COLOR) {
        const objectColor = params && params.objectcolor ? params.objectcolor : null;
        if (objectColor) {
            //const movie = JSON.parse(completeResponse);
            fulfillmentText = `The color of the object is changed to ${objectColor}`;

            // Trigger socket emit event to app
            io.emit("Change renderable color", { intentName: intentName, color: objectColor.toUpperCase() });
        }
        else {
            fulfillmentText = `This color is currently unavailable`;
        }
    }
    else if (intentName.toLowerCase() === constants.intents.OPEN_ACTIVITY) {
        const activityName = params && params.activityname ? params.activityname : null;
        if (activityName) {
            //const movie = JSON.parse(completeResponse);
            fulfillmentText = `${activityName} activity is now opened`;
            if (activityName.toUpperCase().includes('CHAIRS') || activityName.toUpperCase().includes('DESKS') || activityName.toUpperCase().includes('TABLES'))
                fulfillmentText += ` Click on a product for details.`;

            if (activityName.toLowerCase() === "connect liveagent")
                fulfillmentText = 'Support team has been notified. You will receive an acknowledgement email shortly.'

            // Trigger socket emit event to app
            io.emit("Open Activity", { intentName: intentName, activityName: activityName.toUpperCase() });
        }
        else {
            fulfillmentText = `This activity is not available`;
        }
    }
    else if (intentName.toLowerCase() === constants.intents.CHECK_PRICE) {
        const prodData = readFileAsJson(constants.filePaths.PRODUCT_DATA).commondata;
        console.log(`Intent name: ${intentName},  data: `, prodData);
        fulfillmentText = `This product retails for $${prodData.price}`;
    }
    else if (intentName.toLowerCase() === constants.intents.CHECK_WARRANTY) {
        const prodData = readFileAsJson(constants.filePaths.PRODUCT_DATA).commondata;
        console.log(`Intent name: ${intentName},  data: `, prodData);
        fulfillmentText = `${prodData.warData}`;
    }
    else if (intentName.toLowerCase() === constants.intents.PRODUCT_INFO) {
        const prodData = readFileAsJson(constants.filePaths.PRODUCT_DATA).commondata;
        console.log(`Intent name: ${intentName},  data: `, prodData);
        fulfillmentText = prodData.prodDesc;
    }

    // Save chat to dummyDB->chatHistory.json
    saveDialog(constants.filePaths.CHAT_HISTORY, queryText, fulfillmentText);

    // Return response to dialogFlow agent
    return res.json({
        fulfillmentText: fulfillmentText,
        source: 'ghf-actions'
    });
});

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Hello ghf backend' });
})

// Get chat history from chatHistory.json
app.get('/get-chat-history', (req, res) => {
    let chatHistory = [];
    try {
        chatHistory = getChatHistory(constants.filePaths.CHAT_HISTORY);
    }
    catch (e) {
        console.error(`${getCurrentDateTime()} : Error reading chat history: ${e}`);
    }

    res.status(200).json({
        success: true,
        data: chatHistory
    });
})

// Clear chat history
app.get('/clear-chat-history', (req,res) => {
    if(clearChatHistory(constants.filePaths.CHAT_HISTORY))
        res.status(200).json({
            success: true,
            message: "Chat history cleared"
        });
    else
        res.json({
            success: false,
            message: "Chat history NOT cleared"
        });
})


// Fire up the server
server.listen((process.env.PORT || 8000), () => {
    console.log(`Server is running on ${process.env.PORT || 8000}`);
});

