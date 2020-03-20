const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

// Load env values
const API_KEY = process.env.API_KEY;

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
const that=this;
// Handle socket.io events
io.on("connection", skt => {
    socket = skt;
});

// Webhook endpoint
app.post('/get-movie-details', (req, res) => {
    const bodyData = req.body;
    const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'The Godfather';
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}`;

            // Trigger socket emit event to app
            io.emit("Change renderable color", {eventname: 'Change renderable color', color: 'Blue'});

            return res.json({
                fulfillmentText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            fulfillmentText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

app.get('/', (req, res) => {
res.json({message: 'Hello ghf backend'});
})


// Fire up the server
server.listen((process.env.PORT || 8000), () => {
    console.log(`Server is running on ${process.env.PORT || 8000}`);
});

