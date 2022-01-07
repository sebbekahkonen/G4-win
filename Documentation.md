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




### Javascript/Frontend Design




### Förbättringar under processen t.ex. nämna att själva sequalize löste vårt problem för pris tabell ist för sqllite3

### bokade säter ![image](https://user-images.githubusercontent.com/48633146/148439086-01ae6410-08dd-4b45-bcc3-3e15f9fef7cf.png)


