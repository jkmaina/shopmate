const Sequelize = require('sequelize');
const db = require('../startup/database');

const Department = db.define('department', {
    department_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(100)
    },
    description: {
        type: Sequelize.STRING(1000)
    }
}, {
        timestamps: false,
        freezeTableName: true
});

module.exports = Department;