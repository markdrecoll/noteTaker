//  dependencies
const express = require('express');
const path = require('path');

// sets up express
const app = express();
const PORT = process.env.PORT || 8080;

// sets up express to handle data parsing
app.use(express.urlencoded({ extend: true}));
app.use(express.json());

// static file is like index.html or script.js
app.use(express.static('publc'));

// returns the index.html file
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')))

// returns the notes.html file
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')))

// read and return the db.json file
app.get('/api/notes', (req, res) => res.json(notes));
let notes = []; // needs to link to dv.json

// tells the server to start listening
app.listen(PORT, () => console.log(`App listening on PORT http://localhost:${PORT}`));