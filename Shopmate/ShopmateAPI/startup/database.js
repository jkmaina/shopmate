const Sequelize = require('sequelize');
const config = require('config');
const winston = require('winston');

module.exports = new Sequelize(config.get('database.name'), config.get('database.username'), config.get('database.password'), {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timestamps: false,
    logging: (msg) => winston.info(msg),
    dialectOptions: {
        multipleStatements: true
    }
});

