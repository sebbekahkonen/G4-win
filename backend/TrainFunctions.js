const index = require('./XMLRequest/sendXmlRequest');
// require("util").inspect.defaultOptions.depth = null;
// const fs = require('fs');
const Train = require('./Sequelize/Train');
// const Stations = require('./Stations');
// const express = require('express');
const sequelize = require('./Sequelize/database');
const _ = require('underscore');

// sequelize.sync({force: true}).then(() => console.log('db is ready'));

///// CREATING THE METHODS

async function getLocationSignatureForStation(stationName) {
	let allStations = await index.sendStationRequest();
	for (let station of allStations) 
		if (station.AdvertisedLocationName === stationName) 
			return station.LocationSignature;
}


async function getAdvertisedLocationName(signature) {
	let allStations = await index.sendStationRequest();
	for (let station of allStations) 
		if (station.LocationSignature === signature) {
			console.log(station.AdvertisedLocationName);
			return station.AdvertisedLocationName;
		}
}


async function autoComplete(city) {
	let allStations = await index.sendStationRequest();
	
	let matchedStations = [];

	for (let station of allStations) 
		if (station.AdvertisedLocationName.toUpperCase().includes(city.toUpperCase()))
			matchedStations.push(station);

	console.log(matchedStations);
}

async function getAllStations() {
	let allStations = await index.sendStationRequest();
	for (let station of allStations)
		Stations.create(station);
}

async function getDeparturesOrArrivals(activity, location, fromTime, toTime) {

	let locationSignature = await getLocationSignatureForStation(location);
	let travels = await index.sendDepartureOrArrivalRequest(activity, locationSignature, fromTime, toTime);

	return travels;
}


async function renderTrainAnnouncement(from, to) {
	
	if (from == to) {
		console.log('You have given from and to as the same station');
		return;
	}

	let trainDepartures = await getDeparturesOrArrivals('Avgang', from, '-19:50:00', '04:10:00');
	let trainArrivals = await getDeparturesOrArrivals('Ankomst', to, '-19:50:00', '04:10:00');
	
	let trainInformation = [];
	let iterator = 0;

	for (let trainDeparture of trainDepartures) {
		for (let trainArrival of trainArrivals) {
			if (trainDeparture.AdvertisedTrainIdent === trainArrival.AdvertisedTrainIdent
				&& new Date(trainDeparture.AdvertisedTimeAtLocation).getDate() == new Date(trainArrival.AdvertisedTimeAtLocation).getDate()
				&& new Date(trainArrival.AdvertisedTimeAtLocation).getHours() > new Date(trainDeparture.AdvertisedTimeAtLocation).getHours()) {
					
					let hours = Math.floor((new Date(trainArrival.AdvertisedTimeAtLocation).getTime() - new Date(trainDeparture.AdvertisedTimeAtLocation).getTime()) / (3600 * 1000));
					let minutes = Math.ceil(((new Date(trainArrival.AdvertisedTimeAtLocation).getTime() - new Date(trainDeparture.AdvertisedTimeAtLocation).getTime() )/ (3600 * 1000) - hours) * 60);
					
					let service = trainDeparture.Service != undefined ? true : false;
				
					let timeOptions = {hour: "2-digit", minute: "2-digit"};
					
					const dates = getDates(new Date(2022, 0, 26), new Date(2022, 0, 31))
						dates.forEach(function (date) {
							Train.create({
							trainId: trainDeparture.AdvertisedTrainIdent,
							from: from,
							to: to,
							owner: 'G4Win',
							date: date.toLocaleDateString(),
							departure: new Date(trainDeparture.AdvertisedTimeAtLocation).toLocaleTimeString("sv-SE", timeOptions),
							arrival: new Date(trainArrival.AdvertisedTimeAtLocation).toLocaleTimeString("sv-SE", timeOptions),
							travelTime: `${hours}h and ${minutes}min`,
							betweenStations: null,
							betweenStationDeparture: null,
							service: service
						});	
					})
				
				
					
				
				// .toString('dddd, d MMMM yyyy at HH:mm:ss')
					trainInformation.push({
						trainId: trainDeparture.AdvertisedTrainIdent,
						from: from,
						to: to, 
						owner: 'G4Win', 
						departure: new Date(trainDeparture.AdvertisedTimeAtLocation).toString(),
						arrival: new Date(trainArrival.AdvertisedTimeAtLocation).toString(),
						travelTime: `${hours}h and ${minutes}min`, 
						service: service,
					});
				
					iterator++;
				}
			}
	}

	// console.log(trainInformation);
	return trainInformation;

	// if (trainInformation.length == 0) {
	// 	await trainStops();
	// 	return;
	// }
	
	// trainInformation[0].vagnar = { vagn: 2, sitplats: 25 };


	// let json = JSON.stringify(trainInformation);

	// fs.writeFile(from + '-' + to + '.json', "", (err) => {
    // 	if (err) throw err;
	// 	console.log('Data inside data.json has been cleared');
	// });

	// fs.writeFile(from  + '-' + to + '.json', json, (err) => {
    // 	if (err) throw err;
	// 	console.log('Data written to file');
	// });
}

async function trainStops() {

	let departures = await index.sendAllDeparturesRequest();
	let trainsWithStops = [];
	let allStations = await index.sendStationRequest();
	let alreadyRegisteredStations = new Array(); 

	for (let departure of departures) {

		let toLocation = [];
		let fromLocation = '';

		for (let location of departure.ToLocation) {
			for (let station of allStations) {
				if (station.LocationSignature == location) 
					toLocation.push(station.AdvertisedLocationName); 
			}
		}

		for (let station of allStations) {
			if (station.LocationSignature == departure.FromLocation[0])
				fromLocation = station.AdvertisedLocationName;
		}

		let stationChange = fromLocation;
		for (let i = 0; i < toLocation.length; i++) {
			
			if (_.where(alreadyRegisteredStations, { from: stationChange, to: toLocation[i] }).length > 0) {}
			else {
				if (stationChange == toLocation[i] || stationChange == '' || toLocation[i] == '' ) {}
				else {
					alreadyRegisteredStations.push({ from: stationChange, to:toLocation[i] });
					stationChange = toLocation[i];
				}
			}
		};

		trainsWithStops.push({
			advertisedTimeAtLocation: departure.AdvertisedTimeAtLocation,
			advertisedTrainIdent: departure.AdvertisedTrainIdent,
			fromLocation: fromLocation,
			owner: 'G4Win',
			service: 'yes',
			toLocation: toLocation,
			trackAtLocation: departure.trackAtLocation,
		})
	}

	
	let json = JSON.stringify(departures);

	fs.writeFile('departures.json', "", (err) => {
    	if (err) throw err;
			console.log('Data inside data.json has been cleared');
	});

	fs.writeFile('departures.json', json, (err) => {
    	if (err) throw err;
			console.log('Data written to file');
	});

	let json1 = JSON.stringify(trainsWithStops);

	fs.writeFile('trainsWithStops.json', "", (err) => {
    	if (err) throw err;
			console.log('Data inside data.json has been cleared');
	});

	fs.writeFile('trainsWithStops.json', json1, (err) => {
    	if (err) throw err;
			console.log('Data written to file');
	});

	let json2 = JSON.stringify(alreadyRegisteredStations);

	fs.writeFile('alreadyRegisteredStations.json', "", (err) => {
    	if (err) throw err;
			console.log('Data inside data.json has been cleared');
	});

	fs.writeFile('alreadyRegisteredStations.json', json2, (err) => {
    	if (err) throw err;
			console.log('Data written to file');
	});

	console.log(alreadyRegisteredStations.length);

	for (let i = 0; i < alreadyRegisteredStations.length; i++) {
		
		setTimeout(async () => {
			console.log(alreadyRegisteredStations[i].from, alreadyRegisteredStations[i].to);
			await renderTrainAnnouncement(alreadyRegisteredStations[i].from, alreadyRegisteredStations[i].to);
		}, 2000 * i);
	}

}


async function matchStops() {
	let departures = await index.sendAllDeparturesRequest();
	let allStations = await index.sendStationRequest();
	let trainRoutes = new Array();
	let registeredRoutes = new Array();
	let trainWithStops = new Array();

	for (let departure of departures) {

		let toLocation = [];
		let fromLocation = '';

		for (let location of departure.ToLocation) {
			for (let station of allStations) {
				if (station.LocationSignature == location)
					toLocation.push(station.AdvertisedLocationName);
			}
		}
	
		for (let station of allStations) {
			if (station.LocationSignature == departure.FromLocation[0])
				fromLocation = station.AdvertisedLocationName;
		}

		trainRoutes.push({
			fromLocation: fromLocation,
			toLocation: toLocation,
			departure: departure.AdvertisedTimeAtLocation 
		});
	}

	let trainInfo = new Array();
	for (let route of trainRoutes) {
		let fromDestination = route.fromLocation; 

		for (let i = 0; i < route.toLocation.length; i++) {

			if (_.where(registeredRoutes, { fromLocation: fromDestination, toLocation: route.toLocation[i] }).length == 0 && fromDestination != '') { 

				registeredRoutes.push({ fromLocation: fromDestination, toLocation: route.toLocation[i] });
				trainInfo.push(await renderTrainAnnouncement(fromDestination, route.toLocation[i]));
				fromDestination = route.toLocation[i];
			}
		}
	}

	for (let route of trainRoutes) {
		let fromDestination1 = route.fromLocation; 
		let fromDest = route.fromLocation;

		let startStops = new Array();
		let endStops = new Array();
		for (let i = 1; i < route.toLocation.length; i++) {
			if (route.fromDestination != '') {
				if (i == 1) {
					for (let train of trainInfo) {
						if (train != []) {
							if (_.where(train, { from: fromDestination1, to: route.toLocation[0] }).length > 0) {
								// previousStop
								startStops = _.where(train, { from: fromDestination1, to: route.toLocation[0] });
							}
						}
					}
				}

				for (let train of trainInfo) {
						if (train != []) {
						if (_.where(train, { from: route.toLocation[i - 1], to: route.toLocation[i] }).length > 0) {
							endStops = _.where(train, { from: route.toLocation[i - 1], to: route.toLocation[i] });
						}
					}
				}
				
				for (let startStop of startStops) {
					Object.keys(endStops).forEach(key => {
						if (new Date(startStop.arrival).getTime() == new Date(endStops[key].departure).getTime()) {

							let hours = Math.floor((new Date(endStops[key].arrival).getTime() - new Date(startStop.departure).getTime()) / (3600 * 1000));
							let minutes = Math.ceil(((new Date(endStops[key].arrival).getTime() - new Date(startStop.departure).getTime()) / (3600 * 1000) - hours) * 60);

							if (_.where(trainWithStops, { from: startStop.from, to: endStops[key].to, betweenStations: startStop.to, departure: startStop.departure, arrival: endStops[key].arrival, travelTime: `${hours}h and ${minutes}min`,service: endStops[key].service }).length == 0) {
							

								let timeOptions = { hour: "2-digit", minute: "2-digit" };
								
								new Date().toLocaleTimeString("sv-SE", timeOptions)

								trainWithStops.push({
								from: startStop.from,
								to: endStops[key].to,
								betweenStations: startStop.to,
								betweenStationDeparture: startStop.arrival,
								departure: startStop.departure,
								arrival: endStops[key].arrival,
								travelTime: `${hours}h and ${minutes}min`,
								service: endStops[key].service
								});



								const dates = getDates(new Date(2022, 0, 26), new Date(2022, 0, 31))
								dates.forEach(function (date) {
									Train.create({
										from: startStop.from,
										to: endStops[key].to,
										owner: 'G4Win',
										betweenStations: startStop.to,
										date: date.toLocaleDateString(),
										betweenStationDeparture: new Date(startStop.arrival).toLocaleTimeString("sv-SE", timeOptions),
										departure: new Date(startStop.departure).toLocaleTimeString("sv-SE", timeOptions),
										arrival: new Date(endStops[key].arrival).toLocaleTimeString("sv-SE", timeOptions),
										travelTime: `${hours}h and ${minutes}min`,
										service: endStops[key].service
									});
								});
								// Train.create({
								// 	from: startStop.from,
								// 	to: endStops[key].to,
								// 	owner: 'G4Win',
								// 	betweenStations: startStop.to,
								// 	betweenStationDeparture: new Date(startStop.arrival).toLocaleTimeString("sv-SE", timeOptions),
								// 	departure: new Date(startStop.departure).toLocaleTimeString("sv-SE", timeOptions),
								// 	arrival: new Date(endStops[key].arrival).toLocaleTimeString("sv-SE", timeOptions),
								// 	travelTime: `${hours}h and ${minutes}min`,
								// 	service: endStops[key].service
								// });
							}
						}
					});
				}
				startStops = endStops;
			}
		}
	}
}





function getDates (startDate, endDate) {
const dates = []
let currentDate = startDate
const addDays = function (days) {
	const date = new Date(this.valueOf())
	date.setDate(date.getDate() + days)
	return date
}
while (currentDate <= endDate) {
	dates.push(currentDate)
	currentDate = addDays.call(currentDate, 1)
}
return dates
}



function test() {
	let uniqueStations = new Array(); 

	let num = 0;

	uniqueStations.push({ name: 'sebbe', age: 1 });
	uniqueStations.push({ name: 'mazdak', age: 1 });
	uniqueStations.push({ name: 'mazdak', age: 1 });
	uniqueStations.push({ name: 'mazdak', age: 2 });

	console.log(_.where(uniqueStations, { name: 'mazdak', age: 1 }).length);
}


// test();

//// RUNNING THE METHODS

matchStops();
// getAdvertisedLocationName('Hpbg');
// trainStops();
// getAllStations();
// renderTrainAnnouncement('Örebro C', 'Hallsberg');