const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

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
            text
        }
        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully!');
    } else {
        res.error('Error adding note.');
    };
})

app.listen(PORT, () =>
    console.log(`Express server listening at ${PORT}.`)
);