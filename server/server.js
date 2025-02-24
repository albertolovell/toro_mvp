require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/data', (req, res) => {
  res.status(200).send('server test');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`listening at port: ${PORT}`);

module.exports = app;