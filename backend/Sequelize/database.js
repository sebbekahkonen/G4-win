const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('traindb', 'user', 'pass', {
	dialect: 'sqlite',
	storage: '../backend/database/traindb.sqlite3',
	host: 'localhost',
});

module.exports = sequelize;
