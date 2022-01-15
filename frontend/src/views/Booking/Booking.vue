<template>
	<v-container class="width-responsive">
		<div class="booking-responsive">
			<h1 id="header-booking" class="text-center">Boka din nästa resa här!</h1>
			<form class="form-responsive">
				<v-autocomplete
					v-model="search.departureStation"
					label="Från"
					:items="stationsArr"
					hint="Ange de tre första bokstäverna"
					clearable
					dense
					filled						
					class="from"
					@change="testBtnDisabled"
				/>
				<v-autocomplete
					v-model="search.arrivalStation"
					label="Till"
					:items="stationsArr"
					hint="Ange de tre första bokstäverna"
					clearable
					dense
					filled
					class="to"
					@change="testBtnDisabled"
				/>
			</form>
			<v-col align="center" class="pt-0">
				<v-btn id="button-responsive" :disabled="btnDisabled" class="blue darken-1 white--text" @click="testSearch">Sök resa</v-btn>
			</v-col>	
		</div>
		<v-container v-show="isClicked" fluid style="margin: 0px; padding: 0px;" class="justify-center mx-auto" @change="testBtnDisabled">
			<v-col class="pa-0 mt-3">
				<v-card>
					<div class="flex-center">
						<p class="mb-0 mt-2 ml-2 font-italic">Utresa</p>
						<v-select class="select-responsive" :items="timePick" :label="timeFormatted" dense solo
							@change="setDepartureTime"
						/>
					</div>
					<v-radio-group v-model="selectedExit" row class="ma-0 pa-0">
						<v-radio label="Avgång" value="Avgång" @click="getValueExit('Avgång')" />
						<v-radio label="Ankomst" value="Ankomst" @click="getValueExit('Ankomst')" />
					</v-radio-group>
					<vc-date-picker v-model="departureDate" :min-date="new Date()" is-expanded @dayclick="departureDateClick" />
				</v-card>
			</v-col>
			<v-col class="pa-0 mt-3">
				<v-card-actions class="justify-center">
					<v-btn color="blue" class="mb-4" outlined plain @click="displayArrivalCalendar">
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
					<vc-date-picker v-model="arrivalDate" :min-date="new Date()" class="mt-0" is-expanded @dayclick="arrivalDateClick" />
				</v-card>
				<v-btn class="blue darken-1 white--text mt-4" small depressed block
					@click="nextPage"
				>
					Fortsätt <v-icon right>{{ 'mdi-chevron-right' }}</v-icon>
				</v-btn>
			</v-col>
		</v-container>
	</v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
		search: {
			departureStation: '',
			arrivalStation: ''
		},
		btnDisabled: true,
		singleStation: '',
		departureDate: new Date(),
		arrivalDate: new Date(),
		isClicked: false,
		displayArrival: false,
		timeFormatted: '',
		timePick: [],
		stationsArr: [],
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
		...mapGetters('bookingStore', ['getAllStations']),
		...mapState('travelStore', [ 'count' ])
	},
	created() {
		vue.nextTick(this.testBtnDisabled());
		vue.nextTick(this.fetchStations());
		vue.nextTick(this.showTimeLabel());
	},
	methods: {
		...mapActions('bookingStore', ['getStations', 'getSearched']),
			
		fetchStations() {
			fetch('/api/stations')
				.then(res => res.json())
				.then(data => Object.keys(data.data).forEach(key => {
					this.stationsArr.push(data.data[key].AdvertisedLocationName);
				})
				);
		},
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
			if (!this.isClicked && !this.search.departureStation == '' && !this.search.arrivalStation == '') {
				this.isClicked = true;
			} else {
				this.isClicked = false;
			}
		},
		testBtnDisabled() {
			if (!this.search.departureStation == '' && !this.search.arrivalStation == '') {
				this.btnDisabled = false;		
			} else {
				this.btnDisabled = true;
			}

			if (this.isClicked && !this.search.departureStation == '' && !this.search.arrivalStation == '') {
				this.isClicked = true;
			} else {
				this.isClicked = false;
			}
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
			this.bookingInformation.departure.departureDateTime = `${this.selectedExit} ${this.departureDate.toLocaleDateString('sv-SE')} ${this.depTime}`;		
			this.bookingInformation.departure.arrivalDateTime = '';
			/* RETURN TRIP INFORMATION */
			this.bookingInformation.returnTrip.departureDestination = this.search.arrivalStation;
			this.bookingInformation.returnTrip.arrivalDestination = this.search.departureStation;
			this.bookingInformation.returnTrip.departureDateTime = `${this.selectedEntry} ${this.arrivalDate.toLocaleDateString('sv-SE')} ${this.arrTime}`;
			this.bookingInformation.returnTrip.arrivalDateTime = '';

			this.$store.commit('travelStore/setTravelObj', this.bookingInformation);
			this.$store.commit('travelStore/setDate', this.departureDate.toLocaleDateString('sv-SE'));

			const months = ['Jan', 'Feb', 'Mars', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
			const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'];
			let day = days[this.departureDate.getDay()];
			let month = months[this.departureDate.getMonth()];
			let dateNr = this.departureDate.getDate();
			let year = this.departureDate.getFullYear();
			
			this.departureDate = `${day} ${dateNr} ${month} ${year}`;
			this.$store.commit('travelStore/setFormatDate', this.departureDate);
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
#button-responsive {
		width: 50%;
}
.vc-container {
    border: none !important;
		border-top: 1px solid rgb(206, 206, 206) !important;
		border-radius: 0% !important;
}
#header-booking {
	font-style: italic;	
	font-weight: normal;
	margin-top: 10px;
	margin-bottom: 40px;
}

@media screen and (min-width: 1024px) {
	.form-responsive {
		max-width: 60%;
		display: flex;
		justify-content: space-around;
		margin: auto;
		padding-top: 40px;
		padding-bottom: 20px;
	}
	.v-messages__message {		
		background-color: transparent;
		color: rgb(29, 29, 29);
	}
	.from {
		margin-right: 20px !important;
		border-radius: 0% !important;		
	}
	.to {
		border-radius: 0% !important;
	}
	.v-application .primary--text {
    color: #ffffff !important;
    caret-color: #1976d2 !important;
	}
	#button-responsive {
		width: 20%;
		margin-bottom: 20px;
	}
	.select-responsive {
		margin-right: 0px !important;
		margin-top: 0px !important;
		box-shadow: none !important;
	}
	.vc-container {
    border: none !important;
		border-top: 1px solid rgb(206, 206, 206) !important;
		border-radius: 0% !important;
	}
	#header-booking {
	font-style: italic;	
	font-weight: normal;
	margin-top: 10px;
	margin-bottom: 0px;
}
}
</style>
