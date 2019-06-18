const express = require('express');
const config = require('config');
const moment = require('moment');

const router = express.Router();

router.get("/", (req, res) => {
    res.send({ app: config.get('name'), "now": moment().format('MMMM Do YYYY, h:mm:ss a') });
});

router.get("/api", (req, res) => {
    res.send({ app: config.get('name') });
});

module.exports = router;