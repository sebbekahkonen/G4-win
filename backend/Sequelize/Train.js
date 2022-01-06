const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Sequelize/database');

class Train extends Model { };

Train.init({
	trainId: {
		type: DataTypes.INTEGER
	},
	from: {
		type: DataTypes.STRING
	},
	to: {
		type: DataTypes.STRING
	},
	date: {
		type: DataTypes.STRING
	},
	owner: {
		type: DataTypes.STRING
	},
	departure: {
		type: DataTypes.STRING
	},
	arrival: {
		type: DataTypes.STRING
	},
	travelTime: {
		type: DataTypes.STRING
	},
	betweenStations: {
		type: DataTypes.STRING
	},
	betweenStationDeparture: {
		type: DataTypes.STRING
	},
	service: {
		type: DataTypes.STRING
	}
}, {
	sequelize,
	modelName: 'trains',
	timestamps: false
});

module.exports = Train;