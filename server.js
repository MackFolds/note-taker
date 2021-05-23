const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

const {v4: uuidv4 } = require('uuid');

const db  = require('./develop/db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));




// Routes

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./develop/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    const note = db;
    return res.json(note);
});

app.post('/api/notes', (req, res) => {
    req.body.id = uuidv4();
    const newNote = req.body;
    db.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './develop/db/db.json'),
        JSON.stringify( db , null, 2)
    );

    res.json(db);
});

// delete route
app.delete('/api/notes/:id', (req,res) => {
    const id = req.params.id;
    const index = db.findIndex(notes => notes.id === req.params.id);

    if(index > -1) {
        db.splice(index,1);
    }

    fs.writeFileSync(
        path.join(__dirname, './develop/db/db.json'),
        JSON.stringify( db , null, 2)
    );

    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});