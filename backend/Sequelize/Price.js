const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Sequelize/database');

class Price extends Model { };

Price.init({
	train_id: {
		type: DataTypes.INTEGER
	},
	price_adult: {
		type: DataTypes.INTEGER
	},
	price_student: {
		type: DataTypes.INTEGER
	},
	price_senior: {
		type: DataTypes.INTEGER
	}
}, {
	sequelize,
	modelName: 'prices',
	timestamps: false
});

module.exports = Price;