const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Sequelize/database');

class Station extends Model { };

Station.init({
	AdvertisedLocationName: {
		type: DataTypes.STRING
	},
	// CountryCode: {
	// 	type: DataTypes.STRING
	// },
	// LocationSignature: {
	// 	type: DataTypes.STRING
	// }
}, {
	sequelize,
	modelName: 'stations',
	timestamps: false
});

module.exports = Station;