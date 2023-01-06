const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const uuid = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
};

const readAndAppend = (content, file) => {
    const data = fs.readFileSync(file, 'utf8');
    if (data) {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
    }
  };

const deleteAndAppend = (file, id) => {
    const data = fs.readFileSync(file, 'utf8');
    const parsedData = JSON.parse(data);
    const newNotes = parsedData.filter(note => note.id !== id);
    writeToFile(file, newNotes);
}

const writeToFile = (destination, content) =>
  fs.writeFileSync(destination, JSON.stringify(content, null, 4));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved!`);
    const data = fs.readFileSync('./db/db.json', 'utf8');
    res.json(JSON.parse(data));
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received!`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid()
        }
        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully!');
    } else {
        res.error('Error adding note.');
    };
})

app.delete(`/api/notes/:id`, (req, res) => {
    console.info(`${req.method} request recieved!`);
    const id = req.params.id;

    deleteAndAppend('./db/db.json', id);
    res.send();
})

app.listen(PORT, () =>
    console.log(`Express server listening at ${PORT}.`)
);