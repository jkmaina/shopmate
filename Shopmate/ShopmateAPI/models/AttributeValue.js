const Sequelize = require('sequelize');
const db = require('../startup/database');

const AttributeValue = db.define('attribute_value', {
    attribute_value_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    attribute_id: {
        type: Sequelize.INTEGER(11),
    },
    value: {
        type: Sequelize.STRING(100)
    }
}, {
        timestamps: false,
        freezeTableName: true
    });

module.exports = AttributeValue;