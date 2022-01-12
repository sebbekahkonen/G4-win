const index = require('./XMLRequest/sendXmlRequest');
const Train = require('./Sequelize/Train');
const Stations = require('./Sequelize/Station');
const sequelize = require('./Sequelize/database');
const _ = require('underscore');

// sequelize.sync({ force: true }).then(() => console.log('db is ready'));

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


async function renderTrainAnnouncement(from, to, intervalStart, intervalStop) {

	if (from == to) {
		console.log('You have given from and to as the same station');
		return;
	}

	let trainDepartures = await getDeparturesOrArrivals('Avgang', from, intervalStart, intervalStop);
	let trainArrivals = await getDeparturesOrArrivals('Ankomst', to, intervalStart, intervalStop);

	let trainInformation = [];
	let iterator = 0;

	for (let trainDeparture of trainDepartures) {
		for (let trainArrival of trainArrivals) {
			if (trainDeparture.AdvertisedTrainIdent === trainArrival.AdvertisedTrainIdent
				&& new Date(trainDeparture.AdvertisedTimeAtLocation).getDate() == new Date(trainArrival.AdvertisedTimeAtLocation).getDate()
				&& new Date(trainArrival.AdvertisedTimeAtLocation).getHours() > new Date(trainDeparture.AdvertisedTimeAtLocation).getHours()) {

				let hours = Math.floor((new Date(trainArrival.AdvertisedTimeAtLocation).getTime() - new Date(trainDeparture.AdvertisedTimeAtLocation).getTime()) / (3600 * 1000));
				let minutes = Math.ceil(((new Date(trainArrival.AdvertisedTimeAtLocation).getTime() - new Date(trainDeparture.AdvertisedTimeAtLocation).getTime()) / (3600 * 1000) - hours) * 60);

				let service = trainDeparture.Service != undefined ? 'Ja' : 'Nej';

				let timeOptions = { hour: "2-digit", minute: "2-digit" };

				const dates = getDates(new Date(2022, 4, 30), new Date(2022, 4, 31))
				dates.forEach(function (date) {
					Train.create({
						trainId: trainDeparture.AdvertisedTrainIdent,
						from: from,
						to: to,
						owner: 'G4Win',
						date: date.toLocaleDateString(),
						departure: new Date(trainDeparture.AdvertisedTimeAtLocation).toLocaleTimeString("sv-SE", timeOptions),
						arrival: new Date(trainArrival.AdvertisedTimeAtLocation).toLocaleTimeString("sv-SE", timeOptions),
						travelTime: `${hours}h:${minutes}m`,
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
					travelTime: `${hours}h:${minutes}m`,
					service: service,
				});

				iterator++;
			}
		}
	}
	return trainInformation;
}

async function matchStops(intervalStart, intervalStop) {
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
				trainInfo.push(await renderTrainAnnouncement(fromDestination, route.toLocation[i], intervalStart, intervalStop));
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

							if (_.where(trainWithStops, { from: startStop.from, to: endStops[key].to, betweenStations: startStop.to, departure: startStop.departure, arrival: endStops[key].arrival, travelTime: `${hours}h:${minutes}m`, service: endStops[key].service }).length == 0) {


								let timeOptions = { hour: "2-digit", minute: "2-digit" };

								new Date().toLocaleTimeString("sv-SE", timeOptions)

								trainWithStops.push({
									from: startStop.from,
									to: endStops[key].to,
									betweenStations: startStop.to,
									betweenStationDeparture: startStop.arrival,
									departure: startStop.departure,
									arrival: endStops[key].arrival,
									travelTime: `${hours}h:${minutes}m`,
									service: endStops[key].service
								});


								const dates = getDates(new Date(2022, 4, 30), new Date(2022, 4, 31))
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
										travelTime: `${hours}h:${minutes}m`,
										service: endStops[key].service
									});
								});
							}
						}
					});
				}
				startStops = endStops;
			}
		}
	}
}


function getDates(startDate, endDate) {
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

// test();

//// RUNNING THE METHODS

matchStops('-22:22:00', '01:30:00');
// getAdvertisedLocationName('Hpbg');
// trainStops();
// getAllStations();
// renderTrainAnnouncement('Örebro C', 'Hallsberg');