const _ = require('underscore');
const Price = require('./Sequelize/Price');
const Train = require('./Sequelize/Train');
// const sequelize = require('./Sequelize/database');
// const sqlite3 = require('sqlite3').verbose();

let run = async () => { prices(JSON.parse(JSON.stringify(await Train.findAll()))) };
run();

function prices(rows) {
	let registeredTrainsWithoutStops = new Array();

	for (let train of rows) {
		let travelArray = new Array();
		// Göteborg C --> Stockholm Central 2022-01-01
		if (_.where(registeredTrainsWithoutStops, { from: train.from, to: train.to, date: train.date }).length < 1) {
			registeredTrainsWithoutStops.push({ from: train.from, to: train.to, date: train.date });
			const table = _.where(rows, { from: train.from, to: train.to, date: train.date });

			Object.keys(table).forEach(key => {
				let travelTime = table[key].travelTime;
				
				let hours = parseInt(travelTime[0]);
				let minutes = parseInt(travelTime.substring(travelTime.indexOf(':') + 1, travelTime.indexOf('m')));
				let totalMinutes = parseInt(hours * 60 + minutes);

				travelArray.push(totalMinutes);
			});

			let shortestTravelTime = Math.min(...travelArray);

			calculatePrices(table, shortestTravelTime);
		}
	}
}


function calculatePrices(table, shortestTravelTime) {
	
	let adultFee = 70;
	let studentFee = 25;
	let retiredFee = 23;

	Object.keys(table).forEach(key => {
		let travelTime = table[key].travelTime;
		
		let hours = parseInt(travelTime[0]);
		let minutes = parseInt(travelTime.substring(travelTime.indexOf(':') + 1, travelTime.indexOf('m')));
		let totalMinutes = parseInt(hours * 60 + minutes);
		
		let priceAdult = shortestTravelTime * 2 + adultFee;
		let priceStudent = shortestTravelTime * 2 + studentFee;
		let priceRetired = shortestTravelTime * 2 + retiredFee;
		

		if (table[key].betweenStations != undefined) {
			let deductionStop = 0.05;
			priceAdult -= Math.ceil(priceAdult * deductionStop);
			priceStudent -= Math.ceil(priceStudent * deductionStop);
			priceRetired -= Math.ceil(priceRetired * deductionStop);
		}

		if (shortestTravelTime != totalMinutes) {
			let difference = totalMinutes - shortestTravelTime;

			// glöm inte ta med id
			priceAdult -= difference;
			priceStudent -= difference;
			priceRetired -= difference;
		}

		if (table[key].date >= new Date().toLocaleDateString()) {
			
			// avdrag med 5kr/dag beroende på hur många dagar tidigare man bokar en resa
			let deduction = 5;

			if (table[key].date - new Date().toLocaleDateString() >= 7) {
				days = 7;
			}

			const days = dateDiffInDays(new Date(), new Date(table[key].date));

			priceAdult -= deduction * days;
			priceStudent -= deduction * days;
			priceRetired -= deduction * days;
			
			Price.create({
				train_id: table[key].id,
				price_adult: priceAdult,
				price_student: priceStudent,
				price_retired: priceRetired
			});
		}
	});
}

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
	// Discard the time and time-zone information.
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}