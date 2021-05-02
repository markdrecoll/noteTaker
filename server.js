// file system module
const fs = require('fs');
// express module
const express = require('express');
// path module
const path = require('path');
// sets up express
const app = express();
// use the port provided or your own
const PORT = process.env.PORT || 8080;

// sets up express to handle data parsing
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

function generateId(data){
    let currentIds = [];

    // gets current ids
    for (let i = 0; i < data.length; i++){
        currentIds.push(data[i].id)
    }

    // make a new id
    let newId = Math.floor(Math.random() * (10000 - 1) + 1);
    while (currentIds.includes(newId)){
        newId = Math.floor(Math.random() * (10000 -1) + 1);
    }

    // returns a random id
    return newId;
}

// notes route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// read and return the db.json file
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

// post new text to database
app.post('/api/notes', (req, res) => {

    // takes in note data
    const userNoteStuff = req.body;

    // takes in data from database
    let dataFromDatabase = fs.readFileSync(path.join(__dirname, '/db/db.json'));

    // parses database info to make an array of objects
    let parsedDataFromDatabase = JSON.parse(dataFromDatabase);

    // creates a new id that is unique
    userNoteStuff.id = generateId(parsedDataFromDatabase);

    // pushes the object with id to the object array
    parsedDataFromDatabase.push(userNoteStuff);

    // writes to the file new information
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(parsedDataFromDatabase), (err) => {
        if (err) {
            console.log('Save occurred.', err);
        }
    })
    // says processing ended
    res.end()
});


// delete from the database
app.delete('/api/notes/:id', (req, res) => {

    // takes the id out of the delete route request
    const theIdToReturn = req.params.id;

    // takes the database file and reads it
    let dataFromDatabase = fs.readFileSync(path.join(__dirname, '/db/db.json'));

    // parses the data into a array of objects
    let parsedDataFromDatabase = JSON.parse(dataFromDatabase);

    // loop which matches the id the database to remove it
    for (let i = 0; i < parsedDataFromDatabase.length; i++) {
        // if the id of the object being iterated over matches the id of the delete
        if (parsedDataFromDatabase[i].id == theIdToReturn) {
            // removes the item from the database
            parsedDataFromDatabase.splice(i, 1);
        }
    };
    
    // writes the array of objects to the database file
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(parsedDataFromDatabase), (err) => {
        if (err) {
            console.log('Save Occurred.', err);
        }
    })
    // returns a response back to the request
    res.end();
})


// leads to index.html with any request
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')))


// tells the server to start listening
app.listen(PORT, () => console.log(`App listening on PORT http://localhost:${PORT}`));