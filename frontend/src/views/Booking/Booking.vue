<template>
	<v-container> 
		<v-card class="justify-center mx-auto" width="100%">
			<h1 class="text-center">Boka din resa här!</h1>
			<form>
				<v-text-field v-model="search.departureStation" class="pa-1" label="Från" outlined clearable />
				<v-text-field v-model="search.arrivalStation" label="Till" class="pa-1" outlined clearable />
			</form>
			<v-col align="center">
				<v-btn class="blue darken-1 white--text" @click="testWithStore">Testa store</v-btn>
				<v-btn class="blue darken-1 white--text" @click="testSearch">Sök resa</v-btn>
			</v-col>
			<div v-for="(stationSingle, i) in singleStation" :key="i">
				{{ stationSingle.AdvertisedLocationName }}
			</div>			
		</v-card>
		<v-container v-show="isClicked" fluid style="margin: 0px; padding: 0px;" class="justify-center mx-auto">	
			<v-col class="pa-0 mt-3">
				<v-card>
					<div class="flex-center">
						<p class="mb-0 mt-2 ml-2 font-italic">Utresa</p>
						<v-select :items="timePick" :label="timeFormatted" dense solo @change="setDepartureTime" />
					</div>
					<v-radio-group v-model="selectedExit" row class="ma-0 pa-0">
						<v-radio label="Avgång" value="Avgång" @click="getValueExit('Avgång')" />
						<v-radio label="Ankomst" value="Ankomst" @click="getValueExit('Ankomst')" />
					</v-radio-group>
					<vc-date-picker v-model="departureDate" is-expanded @dayclick="departureDateClick" />
				</v-card>
			</v-col>
			<v-col class="pa-0 mt-3">
				<v-card-actions class="justify-center">
					<v-btn color="black" text @click="displayArrivalCalendar">
						Vill du boka återresa?
						<v-icon right>{{ displayArrival ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
					</v-btn>
				</v-card-actions>
				<v-card v-if="displayArrival">
					<div class="flex-center">
						<p class="mb-0 mt-2 ml-2 font-italic">Återresa</p>
						<v-select :items="timePick" :label="timeFormatted" dense solo @change="setArrivalTime" />
					</div>
					<v-radio-group v-model="selectedEntry" row class="ma-3">
						<v-radio label="Avgång" value="Avgång" @click="getValueEntry('Avgång')" />
						<v-radio label="Ankomst" value="Ankomst" @click="getValueEntry('Ankomst')" />
					</v-radio-group>
					<vc-date-picker v-model="arrivalDate" class="mt-0" is-expanded @dayclick="arrivalDateClick" />
				</v-card>
				<v-btn class="blue darken-1 white--text" small depressed block @click="nextPage">
					Fortsätt <v-icon right>{{ 'mdi-chevron-right' }}</v-icon>
				</v-btn>
			</v-col>
		</v-container>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
		search: {
			departureStation: '',
			arrivalStation: ''
		},
		singleStation: '',
		departureDate: new Date(),
		arrivalDate: new Date(),
		isClicked: false,
		displayArrival: false,
		timeFormatted: '',
		timePick: [],
		depTime: '',
		arrTime: '',
		selectedExit: '',
		selectedEntry: '',
		bookingInformation: {
			departure: {
				departureDestination: '',
				departureDateTime: '',
				arrivalDestination: '',
				arrivalDateTime: ''
			},
			returnTrip: {
				departureDestination: '',
				departureDateTime: '',
				arrivalDestination: '',
				arrivalDateTime: ''
			}
		}
	}),
	computed: {
		...mapGetters('bookingStore', ['getAllStations'])

	},
	created() {
		vue.nextTick(this.showTimeLabel());
	},
	methods: {
		...mapActions('bookingStore', ['getStations']),

		getValueExit(v) {
			this.selectedExit = v;
		},
		getValueEntry(v) {
			this.selectedEntry = v;
		},

		testWithStore() {
			this.getStations(this.search.departureStation);
			console.log(this.getAllStations);
		},
		displayArrivalCalendar() {
			if (!this.displayArrival) {
				this.displayArrival = true;
			} else {
				this.displayArrival = false;
			}
		},
		showTimeLabel() {
			let hours = new Date().getHours();
			let minutes = new Date().getMinutes();

			this.timeFormatted = minutes < 10 ? `${hours}:0${minutes}` : `${hours}:${minutes}`;
			
			for (let i=hours; i<24; i++) {
				this.timePick.push(`${hours++}:00`);
			}
		},
		departureDateClick() {
			let timePickReplace = [];

			for (let i=0; i<24; i++) {
				timePickReplace.push(this.timeFormatted = i < 10 ? `0${i}:00` : `${i}:00`);
				this.timePick = timePickReplace.slice(0);
			}
		},
		arrivalDateClick() {
			let timePickReplace = [];

			for (let i=0; i<24; i++) {
				timePickReplace.push(this.timeFormatted = i < 10 ? `0${i}:00` : `${i}:00`);
				this.timePick = timePickReplace.slice(0);
			}				
		},
		testSearch() {
			if (!this.isClicked && this.search.departureStation.length > 0) {
				this.isClicked = true;
			}

			let body =
		'<REQUEST>' +
		'<LOGIN authenticationkey=\'7dcd599fb8f3436382d20e4e54ddf57a\' />' +
		' <QUERY objecttype=\'TrainStation\' schemaversion=\'1\'>' +
		' <FILTER>' +
		' <AND> ' +
					' <EQ name=\'Advertised\' value=\'true\' />' +
		`<IN name='AdvertisedLocationName' value='${this.search.departureStation}' />` +
		'</AND> ' +
		'</FILTER>' +
		'<INCLUDE>AdvertisedLocationName</INCLUDE>' +
		'</QUERY> ' +
		'</REQUEST> ';

			fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'text/xml'
				},
				body: body
			}).then(res => res.json())
				.then(data => this.singleStation = data.RESPONSE.RESULT[0].TrainStation);
		},

		setDepartureTime(depTime) {
			this.depTime = depTime;
		},
		setArrivalTime(arrTime) {
			this.arrTime = arrTime;
		},
		nextPage() {
			/* DEPARTURE INFORMATION */
			this.bookingInformation.departure.departureDestination = this.search.departureStation;
			this.bookingInformation.departure.arrivalDestination = this.search.arrivalStation;
			this.bookingInformation.departure.departureDateTime = `${this.selectedExit} ${this.departureDate.toLocaleDateString()} ${this.depTime}`;		
			this.bookingInformation.departure.arrivalDateTime = '';
			/* RETURN TRIP INFORMATION */
			this.bookingInformation.returnTrip.departureDestination = this.search.arrivalStation;
			this.bookingInformation.returnTrip.arrivalDestination = this.search.departureStation;
			this.bookingInformation.returnTrip.departureDateTime = `${this.selectedEntry} ${this.arrivalDate.toLocaleDateString()} ${this.arrTime}`;
			this.bookingInformation.returnTrip.arrivalDateTime = '';
			console.log(JSON.stringify(this.bookingInformation));
			this.$router.push({name: 'TrainDepartures'});
		}
	}
};
</script>

<style>
.flex-center {
  display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
}
.time-input {
	align-content: right;
}
.v-radio-group {
	min-width: 100%;
}
.v-input--radio-group__input {
	justify-content: center;
}
</style>
