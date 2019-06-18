const winston = require("winston");
const express = require("express");

const app = express();

require('./startup/logging')(app);
require('./startup/routes')(app);
const db = require('./startup/database');

db.authenticate()
    .then(() => {
        winston.info('Connection to the database has been established successfully.');
    })
    .catch(err => {
        winston.info('Unable to connect to the database:', err);
});


const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));