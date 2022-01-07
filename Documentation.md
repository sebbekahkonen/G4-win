- Innehållsförteckning, data flow med flowchart, db relation med flowchart, vilka verktyg och npm vi använde, backend, frontend, overview, mail

# Dokumentation

## Innehållsförteckning

1) Översikt
2) Wireframes
3) Flowcharts
4) Code Struktur
5) Proxy
6) Trafikverkets externa API
7) Javascript/Frontend Design 
8) Mail
9) Förbättringar under processen
10) Javascript/Frontend Design 
11) Authentication och Authorization
12) Verktyg
13) Mail
14) Stripe (Hitta confluence länken till det)
15) Kanske en custom middle för API-Key till våra kontroller
16) Förbättringar under processen

### Översikt

Vårt tågapplikation består av ett backend projekt som körs på nodejs och en frontend projekt som körs på javascript/vue. Våra kunder kan gå in och välja deras från och till 
stationer med tur och retur i homepage url:n. Därefter kan dem se vilka resor som finns, kunna välja hur många biljetter och vad för biljettstyper i train departures/arrivals
url. Därefter väljer dem platser beroende på antal biljetter kunderna har valt. De måste välja exakt de antal biljetterna som dem har köpt annars lyckats dem ej gå vidare i
Seats url:n. Därefter fyller dem i deras kontakt information och betalinformation. Betalningen hanteras via ett extern api som heter stripe. Dessa syns på
stripe url:n och till slut har vi en confirmations url:n där vi kan se all info om kundernas bokning. Sedan har vi en side url:n så hanteras avbokningen och då kan
kunderna söka på deras ordernummer och välja att avboka deras biljett.


### Wireframes:

Här nedan ser vi alla url:n utfrån kundernas perspektiv:

![image](https://user-images.githubusercontent.com/48633146/148405234-8e429ac0-a9e6-4f91-b0cc-abcf0b3e70c6.png)


### Flowcharts 

> Data Flow

![Data Flow](https://user-images.githubusercontent.com/48633146/148553635-b07aef1f-07e5-4a3b-9cd0-5daa6a00b934.png)

> Databas diagram

Diagrammet är ritat i Microsoft SQL Server Management Studio:

![DB diagram](https://user-images.githubusercontent.com/48633146/148554800-ce0e3bad-182d-477c-9acd-e321ed7f1a3d.png)



### Code Struktur 
lägga in det med proxy som kopplar front o backend
trafikverketsapi

Dependencies som vi använda för vår projekt är följande:

1) Backend:
* axios
* better-sqlite3
* express
* sequalize
* sqlite3
* stripe
* underscore
* dotenv
* nodemon
* nodemailer
* fs

2) Frontend:
* vue-stripe
* axios
* v-calendar
* vuetify
* eslint

> Homepage

Här tänkte jag bryta ner vår wireframes i detaljer. Det som sker i homepage url:n är att kunden kan välja alla stationer och dessa ser ut som nedan i kod:

![Homepage](https://user-images.githubusercontent.com/48633146/148562817-9d3e8bf9-34ee-4654-b06f-952b1d283379.png)

I vår frontend booking.vue fil så har vi en search objekt med en departureStation och arrivalStation properties. Koden ser ut på det viset:
Dessa är tomt i början tills kunden skriver in vart dem ska.
Sedan har vi mappat in getStations och getSearched metoder i vår bookingStore.js via en spread-syntax.

``` javascript
Booking.vue:

data: () => ({
		search: {
			departureStation: '',
			arrivalStation: ''
		}),
methods: {
		...mapActions('bookingStore', ['getStations', 'getSearched'])
```

BookingStore.js fil är sparat i vår store map. Store map lagrar alla filer som kopplar vår backend och frontend.

Vi har några tomma state där vi t.ex. kan hämta alla stationer via vår getAllStations method i vår getters. Därefter använder vi oss av setStations metoden i
mutations och matar in alla stationer som hämtas från db:n. Sedan har vi en searchTrains method som är i princip en fetch get metod för att hämtas vad kundernas har
valt i från och till sök fältet som ser ut på det viset:

``` javascript
export default {
	searchTrains(from, to) {
		return axios.get(`/api/trains/${from}/${to}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				console.log('response: ', response);

				return response.data.data;
			});
	}
```

``` javascript
bookingStore.js:

state: {
		allStations: [],
		arrivals: [],
		departures: []
	},

	mutations: {
		setStations(state, data) {
			console.log('data in set: ', data);
			state.allStations.push(data);
		},
		setArrivals(state, data) {
			state.arrivals.push(data);
		},
		setDepartures(state, data) {
			state.departures.push(data);
		}
	},

	actions: {
		async getStations({ commit }, data) {
			const trainData = await trainServices.getAllStations(data);

			console.log('This is the traindata: ', trainData);
			commit('setStations', trainData);
		},

		async getSearched({ commit }, data) {
			const trainData = await trainServices.searchTrains(data.from, data.to);

			console.log('This is the traindata: ', trainData);
			commit('setStations', trainData);
		}

	},

	getters: {
		getAllStations(state) {
			return state.allStations;
		}
	}
``` 

> Train Departures/Arrivals

Efter att kunderna har valt deras från och till resa så ser dem vilka tider det finns för just den resan:

Frontend på denna url:n är TrainDepartures.vue filen 

![Departures/Arrivals Schedule](https://user-images.githubusercontent.com/48633146/148584113-ca7663ad-2544-416a-9668-75e76d011134.png)






> Seats
> Stripe
> Confirmation
> SearchTickets
> CancelBooking


### Proxy

Eftersom att vi inte ska få någon slags cors-issue så har vi lagt till en proxy i vår vue.config.js vill ser ut på det viset:

``` javascript
module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:4000'
			}
		}
	},
	transpileDependencies: [
		'vuetify'
	]
};
```
Det som sker i ovanstående kod är att när vi kör någon form av anrop och anger '/api' som kör vi i princip localhost:4000 som körs i backenden och då kan
vi använda dessa trots att vi kör på vår localhost:8080 i frontenden.


### Trafikverkets externa API
Vi använde oss utav trafikverkets api för att lagra viss antal data i våra databaser. Första behövde vi registrera oss för att kunna använda deras api:er. Här
är deras länk: https://api.trafikinfo.trafikverket.se/

Vi gjorde en xml request för ett dygn för att kunna få alla möjliga tider för alla tåg resor och detta har vi sparat i vår xmlRequest.js fil i backenden:

``` javascript
var xmlStations = `<REQUEST> 
	<LOGIN authenticationkey='APIKEY'/> 
	<QUERY objecttype='TrainStation' schemaversion='1'> 
	<FILTER> 
		<EQ name="Advertised" value="true" />
		<EQ name='CountryCode' value='SE' />
	</FILTER> 
	<INCLUDE>Prognosticated</INCLUDE> 
	<INCLUDE>AdvertisedLocationName</INCLUDE> 
	<INCLUDE>LocationSignature</INCLUDE>
	<INCLUDE>CountryCode</INCLUDE> 
	</QUERY> 
	</REQUEST>`;

	
const xmlDepartureOrArrival = function (activity, locationSignature, fromTime, toTime) { return `<REQUEST>
      <LOGIN authenticationkey="APIKEY" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.3" orderby="AdvertisedTimeAtLocation">
            <FILTER>
                  <AND>
                        <EQ name="ActivityType" value="${activity}" />
                        <EQ name="LocationSignature" value="${locationSignature}" />
						<EQ name='InformationOwner' value='SJ' />
                        <OR>
                              <AND>
                                    <GT name="AdvertisedTimeAtLocation" value="$dateadd(${fromTime})" />
                                    <LT name="AdvertisedTimeAtLocation" value="$dateadd(${toTime})" />
                              </AND>
                              <AND>
                                    <LT name="AdvertisedTimeAtLocation" value="$dateadd(00:30:00)" />
                                    <GT name="EstimatedTimeAtLocation" value="$dateadd(-00:15:00)" />
                              </AND>
                        </OR>
                  </AND>
            </FILTER>
			<INCLUDE>InformationOwner</INCLUDE>
			<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
			<INCLUDE>AdvertisedTrainIdent</INCLUDE>
			<INCLUDE>TrackAtLocation</INCLUDE>
			<INCLUDE>FromLocation</INCLUDE>
			<INCLUDE>ToLocation</INCLUDE>
			<INCLUDE>Service</INCLUDE>
			<INCLUDE>Booking</INCLUDE>
      </QUERY>
</REQUEST>`
}
	
var xmlAllDepartures = `<REQUEST>
                                <LOGIN authenticationkey='APIKEY' />
                                <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation' schemaversion='1'>
                                    <FILTER>
                                    <AND>
                                        <OR>
                                            <AND>
                                                <GT name='AdvertisedTimeAtLocation' 
                                                            value='$dateadd(00:00:00)' />
                                                <LT name='AdvertisedTimeAtLocation' 
                                                            value='$dateadd(12:00:00)' />
                                            </AND>
                                            <GT name='EstimatedTimeAtLocation' value='$now' />
                                        </OR>
                                        <EQ name='ActivityType' value='Avgang' />
                                        <EQ name='InformationOwner' value='SJ' />
										</AND>
                                    </FILTER>
                                    <INCLUDE>InformationOwner</INCLUDE>
                                    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                                    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                                    <INCLUDE>TrackAtLocation</INCLUDE>
                                    <INCLUDE>FromLocation</INCLUDE>
                                    <INCLUDE>ToLocation</INCLUDE>
                                    <INCLUDE>Service</INCLUDE>
                                    <INCLUDE>Booking</INCLUDE>
                                    <INCLUDE>TrainComposition</INCLUDE>
                                </QUERY>
                                </REQUEST>`;

module.exports.xmlStations = xmlStations;
module.exports.xmlDepartureOrArrival = xmlDepartureOrArrival;
module.exports.xmlAllDepartures = xmlAllDepartures;

```

Därefter skickar vi dessa via vår sendXmlRequest.js fil. I det här filer gör vi en del post anrop för att plocka fram data från trafikverketsapi.

``` javascript
const axios = require('axios');
const xmlRequests = require('./xmlRequests');

const url = 'https://api.trafikinfo.trafikverket.se/v2/data.json';


async function sendStationRequest() {

	try {
		const response = await axios({
			method: 'post',
			url: url,
			data: xmlRequests.xmlStations,
			headers: { 'Content-Type': 'text/xml' }
		});
		return response.data.RESPONSE.RESULT[0].TrainStation;

	} catch (err) {
		console.log(err);
	}
}


async function sendDepartureOrArrivalRequest(activity, locationSignature, fromTime, toTime) {
	try {
		const response = await axios({
			method: 'post',
			url: url,
			data: xmlRequests.xmlDepartureOrArrival(activity, locationSignature, fromTime, toTime),
			headers: { 'Content-Type': 'text/xml' }
		});
		return response.data.RESPONSE.RESULT[0].TrainAnnouncement;

	} catch (err) {
		console.log(err);
	}
}


async function sendAllDeparturesRequest() {

	try {
		const response = await axios({
			method: 'post',
			url: url,
			data: xmlRequests.xmlAllDepartures,
			headers: { 'Content-Type': 'text/xml' }
		});
		return response.data.RESPONSE.RESULT[0].TrainAnnouncement;

	} catch (err) {
		console.log(err);
	}
}

module.exports.sendStationRequest = sendStationRequest;
module.exports.sendDepartureOrArrivalRequest = sendDepartureOrArrivalRequest;
module.exports.sendAllDeparturesRequest = sendAllDeparturesRequest;
```

Data använder vi sedan i vår TrainFunctions.js fil. Dessa data manipuleras i det här filen för att därefter kunna lagra det som behövs i vår sqlite DB som t.ex.
galla möjliga tåg rutter, alla stationer samt tåg rutter med byten:

``` javascript

const index = require('./XMLRequest/sendXmlRequest');
// require("util").inspect.defaultOptions.depth = null;
// const fs = require('fs');
const Train = require('./Sequelize/Train');
const Stations = require('./Sequelize/Station');
// const express = require('express');
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

				const dates = getDates(new Date(2022, 0, 3), new Date(2022, 0, 11))
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


								const dates = getDates(new Date(2022, 0, 3), new Date(2022, 0, 11))
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

//// RUNNING THE METHODS

matchStops('-16:25:00', '06:30:00');
// getAdvertisedLocationName('Hpbg');
// trainStops();
getAllStations();
// renderTrainAnnouncement('Örebro C', 'Hallsberg');
```


### Javascript/Frontend Design




### Förbättringar under processen t.ex. nämna att själva sequalize löste vårt problem för pris tabell ist för sqllite3

### bokade säter ![image](https://user-images.githubusercontent.com/48633146/148439086-01ae6410-08dd-4b45-bcc3-3e15f9fef7cf.png)


