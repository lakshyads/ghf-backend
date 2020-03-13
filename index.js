const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
require('dotenv').config({ path: __dirname + '/.env' })

const API_KEY = process.env.API_KEY;

// Initialize server
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}));

// Webhook endpoint
server.post('/get-movie-details', (req, res) => {
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

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

server.get('/', (req, res) => {
res.json({message: 'Hello ghf backend'});
})

// Fire up the server
server.listen((process.env.PORT || 8000), () => {
    console.log(`Server is running on ${process.env.PORT || 8000}`);
});

