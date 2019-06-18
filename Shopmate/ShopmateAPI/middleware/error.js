const winston = require('winston');

module.exports = function (err, req, res, next) {
    //log error using winston
    winston.error(err.message, err);
    //return standard error message to user
    res.status(500).send({
        "code": "ERR_01",
        "message": "Unexpected error has occured. Please try again.",
        "field": "",
        "status": "500"
    });
};