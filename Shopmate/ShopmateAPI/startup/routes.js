const error = require('../middleware/error');
const express = require('express');
const home = require('../routes/home');
const departments = require('../routes/departments');
const categories = require('../routes/categories');
const attributes = require('../routes/attributes');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', home);
    app.use('/departments', departments);
    app.use('/categories', categories);
    app.use('/attributes', attributes);

    app.use(error);
};