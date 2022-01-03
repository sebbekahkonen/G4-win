const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('traindb', 'user', 'pass', {
	dialect: 'sqlite',
	host: '../database/traindb.sqlite3'
});

module.exports = sequelize;
