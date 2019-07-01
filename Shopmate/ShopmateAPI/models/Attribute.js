const Sequelize = require('sequelize');
const db = require('../startup/database');

const Attribute = db.define('attribute', {
    attribute_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(100)
    }
}, {
        timestamps: false,
        freezeTableName: true
    });

module.exports = Attribute;