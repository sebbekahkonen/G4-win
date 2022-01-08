# Dokumentation

## Innehållsförteckning

1) Översikt
2) Wireframes
3) Flowcharts
4) Code Struktur
5) Proxy
6) Trafikverkets externa API
7) Javascript/Frontend Design 
8) Mail (nodemailer)
9) Stripe (Hitta confluence länken till det)
10) Förbättringar under processen
11) Referens

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

I vår frontend booking.vue fil så använder vi först och främst fetchApi metoden och via det så hämtar vi alla stationer i DB:n. Sen populerar vi autocomplete fälten genom att binda items till vår stationsArr som ni ser på nedanstående kod:

``` javascript
fetchApi() {
			fetch('/api/stations')
				.then(res => res.json())
				.then(data => Object.keys(data.data).forEach(key => {
					this.stationsArr.push(data.data[key].AdvertisedLocationName);
				})
				);
		},

<v-autocomplete
				v-model="search.departureStation"
				label="Från"
				:items="stationsArr"
				hint="Ange de tre första bokstäverna"
				clearable
				dense
				filled
				@change="testBtnDisabled"
			/>
```

Därefter har vi en search objekt med en departureStation och arrivalStation properties. Dessa är tomt i början tills kunden skriver in vart dem ska. När kunden har matat in sök fälten så  commitar vi objektet in i store mappen så att vi kan använda objektet globalt. 
Koden ser ut på det viset:

``` javascript
nextPage() {
			this.bookingInformation.departure.departureDestination = this.search.departureStation;
			this.bookingInformation.departure.arrivalDestination = this.search.arrivalStation;
			this.bookingInformation.departure.departureDateTime = `${this.selectedExit} ${this.departureDate.toLocaleDateString()} ${this.depTime}`;		
			this.bookingInformation.departure.arrivalDateTime = '';

			this.$store.commit('travelStore/setTravelObj', this.bookingInformation);
			this.$store.commit('travelStore/setDate', this.departureDate.toLocaleDateString());
		}
```




> Train Departures/Arrivals

Efter att kunderna har valt deras från och till resa så ser dem vilka tider det finns för just den resan:

Frontend på denna url:n är TrainDepartures.vue filen 

![Departures/Arrivals Schedule](https://user-images.githubusercontent.com/48633146/148584113-ca7663ad-2544-416a-9668-75e76d011134.png)

Vi börjar med att hämta avgångar baserad på destination. I samband med det filtrear vi på datum så att vi hämtar tillgängliga resor för det valda datumet. Routen för detta ser ut så här: 
/api/:table/:from/:to


``` javascript
fetch(`/api/trains/${this.travelObj.departure.departureDestination}/${this.travelObj.departure.arrivalDestination}`)
				.then(res => res.json())
				.then(data => Object.keys(data.data).forEach(key => {
					if(data.data[key].date === this.date) {
						this.trainsArray.push(data.data[key]);
					}				
				})
```

``` javascript
computed: {
		...mapState('travelStore', ['travelObj', 'date', 'formatDate'])
	}
```

this.travelObj.departure.departureDestination = :from 
this.travelObj.departure.arrivalDestination = :to

Ovanstående objekt kommer ifrån store filen travelStore.js där användaren valde resa i Homepage url:n.

Dropdown menyn som syns i bilden kommer ifrån samma fetch metod där trainsArray bind till items och loopas igenom. 

``` javascript
<v-data-table
			:headers="trainHeaders"
			:items="trainsArray"
			:single-expand="singleExpand"
			:expanded.sync="expanded"
			item-key="id"
			show-expand
			mobile-breakpoint="0"
			@click:row="expandRow"
			@item-expanded="onExpand"
			@row-clicked="onExpand"
		>

```

För att komma åt den infon vi behöver så använder vi value i trainHeaders där value representerar datan i vår trains tabell o där text är headers.

``` javascript
trainHeaders: [
			{
				text: 'Tågnr',
				value: 'id'
			},
			{
				text: 'Avgång',
				value: 'departure'
			},
			{
				text: 'Ankomst',
				value: 'arrival'
			},
			{
				text: 'Restid',
				value: 'travelTime'
			},
			{
				text: 'Bistro',
				value: 'service'
			},
			{
				text: '',
				value: 'data-table-expand'
			}
		]
```


``` javascript
this.$store.commit('travelStore/setTrainId', value.item.id);
```

Slutligen när användaren har valt tåg så commitar vi in i store det unika trainId:t så att vi får rätt platser för rätt tåg för vår seats url.

> Seats

Därefter hamnar kunderna på seats url:n och beroende på antal biljetter dem har köpt så får kunder välja de exakta antal sitplatser i vilken vagn som helst och självklart
så kan dem ej boka platser som redan är upptagna och dessa platser är svartmarkerade som ni ser på bilden nedan:

![Seats](https://user-images.githubusercontent.com/48633146/148590574-c4bb0e86-6cf4-4804-bb79-bde9971f731a.png)

Kodens entrypoint är via vår Seats.vue:
Vi hämtar ifrån db:n alla bookade säten och därefter filtrerar vi på trainId. Om trainId matchar vår trainId i store (tåget användaren har valt) (svart markerade säten).

``` javascript
fetchBookedSeats() {
			fetch('api/seats')
				.then(res => res.json())
				.then(data => Object.keys(data.data).forEach(key => {
					if(data.data[key].train_id === this.trainId) {
						this.bookedSeatsArr.push({seat: data.data[key].seats_booked, wagon: data.data[key].wagon });
					}
				}));

		}
```

Nästa steg är vår nästa metod för att boka platser:
Metoden nedan är vår logik för att välja antal platser man har bokat beroende på antal biljetter kunder har köpt (röd markerade sätet). 

this.chosenSeats är array:en som kommer att skickas in i DB:n.

``` javascript

setClicked(event) {
			let seatID = event.currentTarget.id;
			let seatToChange = document.getElementById(`${seatID}`);

			if(this.chosenSeats.indexOf(seatID) === -1) {

				if(this.chosenSeats.length < this.nrOfTickets) {
					seatToChange.style.backgroundColor = 'red';
					this.chosenSeats.push(seatID);
				} else {
					let modal = document.getElementById('popup-modal');

					modal.style.display = 'block';

					window.onclick = (e) => {
						if(e.target == modal) {
							modal.style.display = 'none';
							console.log('Clicked!');
						}
					};
				} 
			} else {
				seatToChange.style.backgroundColor = 'green';
				this.chosenSeats.splice(this.chosenSeats.indexOf(seatID), 1);
			}

			if(this.chosenSeats.length < this.nrOfTickets) {
				this.btnDisable = true;
			} else {
				console.log(this.chosenSeats.length);
				this.btnDisable = false;
			}
		}
```

Därefter skickar vi dessa plats och vagn objekt till store vilket därefter nås i payment url:n:

``` javascript
nextPage() {
			this.$store.commit('travelStore/setBookedSeats', this.chosenSeats);
			this.$store.commit('travelStore/setBookedWagon', this.noOfWagons);
		}
```

> Payment

Här kan kunderna bekräfta all ovanstående info vi gick igenom via betala knappen:

![Payment](https://user-images.githubusercontent.com/48633146/148610760-b193260e-a06a-414a-a72c-bde7f8896738.png)


Kodens entrypoint är via vår Payment.vue:
Eftersom att DB:n inte tar emot array måste vi ha logik för dem bokade säterna. Logiken ser ut som nedan:

``` javascript
for(let seats of this.bookedSeats) {
				let dataSend = { train_id: this.trainId, seats_booked: seats, wagon: this.wagon, date: this.date  };

				fetch('/api/seats', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataSend)
				})
					.then(res => res.json())
					.then(data => {
						console.log('Success:', data);
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			}
```

Efter att vi har loopat igenom arrayen för sitplatserna så använder vi oss utav stripe dependency. Vi kallar på det genom this.$refs.checkoutRef.redirectToCheckout().
Vi skickar priserna till stripe checkout. 


> Stripe

Stripe har inbyggd funktionalitet för mail, betalnings och kortinformation och dem har i ett test kort där man slå in för att testa runt sig i development miljön.

![Stripe Credit information](https://user-images.githubusercontent.com/48633146/148611828-3b64911b-53a0-4789-b6aa-f248cfb4d536.png)


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


### Referens:

Lägg till alla stripes länkar



