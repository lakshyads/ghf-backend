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

// Load env values & other resources
const constants = require('./Resources/constants');
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
});

// Receive product info from the app
let prodDesc = "Dummy description";
let price = "Dummy price";
let warData = "Dummy warranty";
socket.on('Product Info', (productData) => {
    if (productData) {
        if (productData.prodDesc)
            prodDesc = productData.prodDesc;
        if (productData.warData)
            warData = productData.warData;
        if (productData.price)
            price = productData.price;
    }
    // send to 
});

// Webhook endpoint
app.post('/ghf-actions', (req, res) => {

    const bodyData = req.body;
    const intentName = req.body.queryResult.intent.displayName;
    const params = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters ? req.body.queryResult.parameters : null;
    let dataToSend = "";

    // Process intents
    if (intentName.toLowerCase() === constants.intents.CHANGE_OBJ_COLOR) {
        const objectColor = params && params.objectcolor ? params.objectcolor : null;
        if (objectColor) {
            //const movie = JSON.parse(completeResponse);
            dataToSend = `The color of the object is changed to ${objectColor}`;

            // Trigger socket emit event to app
            io.emit("Change renderable color", { intentName: intentName, color: objectColor.toUpperCase() });
        }
        else {
            dataToSend = `This color is currently unavailable`;
        }
    }
    else if (intentName.toLowerCase() === constants.intents.OPEN_ACTIVITY) {
        const activityName = params && params.activityname ? params.activityname : null;
        if (activityName) {
            //const movie = JSON.parse(completeResponse);
            dataToSend = `${activityName} activity is now opened`;
            if (activityName.toUpperCase().includes('CHAIRS') || activityName.toUpperCase().includes('DESKS') || activityName.toUpperCase().includes('TABLES'))
                dataToSend += `Click on a product for details.`;

            if (activityName.toLowerCase() === "connect liveagent")
                dataToSend = 'Support team has been notified. You will receive an acknowledgement email shortly.'

            // Trigger socket emit event to app
            io.emit("Open Activity", { intentName: intentName, activityName: activityName.toUpperCase() });
        }
        else {
            dataToSend = `This activity is not available`;
        }
    }
    else if (intentName.toLowerCase() === constants.intents.CHECK_PRICE) {
        dataToSend = `This item retails at ${price}`;
    }
    else if (intentName.toLowerCase() === constants.intents.CHECK_WARRANTY) {
        dataToSend = `This item comes with a warranty of ${warData}`;
    }
    else if (intentName.toLowerCase() === constants.intents.PRODUCT_INFO) {
        dataToSend = prodDesc;
    }

    // Return response to dialogFlow agent
    return res.json({
        fulfillmentText: dataToSend,
        source: 'ghf-actions'
    });
});

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Hello ghf backend' });
})


// Fire up the server
server.listen((process.env.PORT || 8000), () => {
    console.log(`Server is running on ${process.env.PORT || 8000}`);
});

