const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

app.get('/', (req, res) => {
  res.send('Note Taker');
});

app.listen(PORT);