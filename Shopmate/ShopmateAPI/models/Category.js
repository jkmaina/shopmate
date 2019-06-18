const Sequelize = require('sequelize');
const db = require('../startup/database');

const Category = db.define('category', {
    category_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    department_id: {
        type: Sequelize.INTEGER(11)
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

module.exports = Category;