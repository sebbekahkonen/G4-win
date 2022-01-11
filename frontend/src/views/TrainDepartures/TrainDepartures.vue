<template>
	<v-container>
		<v-btn depressed small class="pl-0 white" @click="returnPage">
			<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
			Tillbaka
		</v-btn>
		<v-btn @click="trainIdFetch">test</v-btn>
		{{ testPrices }}
		<v-layout column justify-center>
			<span class="text-center">{{ travelObj.departure.departureDestination }} - {{ travelObj.departure.arrivalDestination }}</span>
			<!-- <v-flex xs6>
				<h3 class="text-center">Från: {{ travelObj.departure.departureDestination }}</h3>
				<h3 class="text-center">Från: Göteborg</h3>
			</v-flex>
			<v-flex xs6>
				<h3 class="text-center">Till: {{ travelObj.departure.arrivalDestination }}</h3>
				<h3 class="text-center">Till: Stockholm</h3>
			</v-flex> -->
			<span class="text-center">{{ formatDate }}</span>
		</v-layout>
		
		<!-- <h3 class="pt-10 text-center mb-4">Valt datum: 2022-01-04</h3> -->
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
			<template v-slot:expanded-item="{ headers }">
				<td :colspan="headers.length">
					<v-col>
						<v-layout row wrap class="pt-2 flex text-right" justify-space-between>
							<h4>Ungdom/Student(100kr/st):</h4>
							<v-icon ref="student" value="-100" @click="changePrice($event, 'student')">mdi-account-minus-outline</v-icon>
							{{ tickets.student.value }}
							<v-icon ref="student" value="+100" @click="changePrice($event, 'student')">mdi-account-plus-outline</v-icon>
						</v-layout>
					</v-col>
					<v-col>
						<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
							<h4 class="mr-16">Vuxen(139kr/st):</h4>
							<v-icon ref="adult" value="-139" @click="changePrice($event, 'adult')">mdi-account-minus-outline</v-icon>
							{{ tickets.adult.value }}
							<v-icon ref="adult" value="+139" @click="changePrice($event, 'adult')">mdi-account-plus-outline</v-icon>
						</v-layout>
					</v-col>
					<v-col>
						<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
							<h4 class="mr-12">Pensionär(79kr/st):</h4>
							<v-icon ref="senior" value="-79" @click="changePrice($event, 'senior')">mdi-account-minus-outline</v-icon>
							{{ tickets.senior.value }}
							<v-icon ref="senior" value="79" @click="changePrice($event, 'senior')">mdi-account-plus-outline</v-icon>  
						</v-layout>
					</v-col>
					<v-col>
						<v-layout row wrap class="pt-5">
							<h4 style="color: red;">{{ errorCode }}</h4>
						</v-layout>
					</v-col>
					<v-col>
						<v-layout row wrap class="pt-10 pb-3">
							<h2 class="flex text-left">Pris: {{ price }}kr</h2>	 
							<v-btn align-content="right" @click="nextView">Nästa</v-btn>
						</v-layout>
					</v-col>
				</td>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
		chosen: false,
		hasBistro: false,
		expanded: [],
		singleExpand: true,
		tickets: {
			student: {id: 1, price: 0, amount: 0, title: 'student_biljett'},
			adult: {id: 2, price: 0, amount: 0, title: 'vuxen_biljett'},
			senior: {id: 3, price: 0, amount: 0, title: 'senior_biljett'}
		},
		price: 0,
		testTrainId: [],
		errorCode: '',
		trainsArray: [],
		testPrices: [],
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
	}),
	computed: {
		...mapState('travelStore', ['travelObj', 'date', 'formatDate'])
	},

	created() {
		vue.nextTick(this.testFetch());
		vue.nextTick(console.log(this.formatDate));
		vue.nextTick(console.log(this.date));
	},

	mounted() {
		this.resetCart();
	},

	methods: {
		...mapActions('ticketStore', ['changeStudentTickets', 'changeAdultTickets', 'changeSeniorTickets', 'changeThePrice', 'changePickedTrain', 'resetCart']),
		...mapActions('travelStore', ['changeFormatDate']),
		returnPage() {
			this.$router.push('/');
		},
		trainIdFetch() {
			for(let trainIdString of this.testTrainId) {
				console.log('test');
				fetch('/api/prices/')
					.then(res => res.json())
					.then(data => Object.keys(data.data).forEach(key => {
						if(data.data[key].train_id === trainIdString) {
							console.log(data.data[key].price_senior);
							this.testPrices.push(data.data[key].price_senior);
						}
					}));
			}
		},
		testFetch() {
			fetch(`/api/trains/${this.travelObj.departure.departureDestination}/${this.travelObj.departure.arrivalDestination}`)
				.then(res => res.json())
				.then(data => Object.keys(data.data).forEach(key => {
					if(data.data[key].date === this.date) {
						this.trainsArray.push(data.data[key]);
						console.log((data.data[key]));
						this.testTrainId.push(data.data[key].id);


					}				
				})
				);
			this.trainIdFetch();
			// Object.keys(this.testTrainId).forEach(key => {
			// 	console.log(this.testTrainId[key]);
			// });
			
			
		},

		dateFormatter() {
			const months = ['Jan', 'Feb', 'Mars', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
			const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'];
			let day = days[this.formatDate.getDay()];
			let month = months[this.formatDate.getMonth()];
			let dateNr = this.formatDate.getDate();
			let year = this.formatDate.getFullYear();
			
			this.changeFormatDate(this.datumTest = `${day} ${dateNr} ${month} ${year}`);

		},
		onExpand(value) {
			Object.keys(this.tickets).forEach(key => {
				Object.keys(this.tickets[key]).forEach(val => {
					if(val === 'amount' || val === 'price') {
						this.tickets[key][val] = 0;
					}
				});
			});
			this.price = 0;

			if(value.id === undefined) {
				this.$store.commit('travelStore/setTrainId', value.item.id);
				
				if(value.item.service === 'Ja') {
					this.hasBistro = true;
				} else {
					this.hasBistro = false;
				}

				console.log('Bistro: ',this.hasBistro);
				this.$store.commit('travelStore/setHasBistro', this.hasBistro);
			} else {
				this.$store.commit('travelStore/setTrainId', value.id);

				if(value.service === 'Ja') {
					this.hasBistro = true;
				} else {
					this.hasBistro = false;
				}

				console.log('Bistro: ',this.hasBistro);
				this.$store.commit('travelStore/setHasBistro', this.hasBistro);

			}
			// console.log(value.item.id);
			// this.$store.commit('travelStore/setTrainId', value.item.id);

		},
		expandRow(e) {
			this.onExpand(e);
			this.expanded = [e];

		},
		nextView() {
			Object.keys(this.tickets).forEach(key => {
				Object.keys(this.tickets[key]).forEach(val => {
					if(this.tickets[key][val] !== 0 && val === 'amount') {
						console.log(this.tickets[key]);

						if(this.tickets[key].title === 'student_biljett') {
							this.changeStudentTickets(this.tickets[key]);
						}

						if(this.tickets[key].title === 'vuxen_biljett') {
							this.changeAdultTickets(this.tickets[key]);
						}

						if(this.tickets[key].title === 'senior_biljett') {
							this.changeSeniorTickets(this.tickets[key]);
						}
					}
				});
			});

			if(this.price >= 79) {
				this.errorCode = '';
				this.changeThePrice(this.price);
				this.changePickedTrain(this.expanded);
				this.$router.push('/seats');
			} else{
				this.errorCode = 'Var vänlig välj minst 1 biljett';
			}
		},
		changePrice(e, type) {
			let value = parseInt(e.target.value);

			if(type.includes('student')) {

				if(value < 0 && this.tickets.student.amount > 0) {
					let val = Math.abs(value);

					this.tickets.student.price = this.tickets.student.price - val;
					this.tickets.student.amount--;
					
				}
 
				if(value > 0) {
					this.tickets.student.price = this.tickets.student.price + value;
					this.tickets.student.amount++;

				}

				this.price = this.tickets.student.price + this.tickets.adult.price + this.tickets.senior.price;

				return;
			}

			if(type.includes('adult')) {
				if(value < 0 && this.tickets.adult.amount > 0) {
					let val = Math.abs(value);

					this.tickets.adult.price = this.tickets.adult.price - val;
					this.tickets.adult.amount--;

				}
 
				if(value > 0) {
					this.tickets.adult.price = this.tickets.adult.price + value;
					this.tickets.adult.amount++;

				}

				this.price = this.tickets.student.price + this.tickets.adult.price + this.tickets.senior.price;

				return;
			}

			if(type.includes('senior')) {
				if(value < 0 && this.tickets.senior.amount > 0) {
					let val = Math.abs(value);

					this.tickets.senior.price = this.tickets.senior.price - val;
					this.tickets.senior.amount--;

				}
 
				if(value > 0) {
					this.tickets.senior.price = this.tickets.senior.price + value;
					this.tickets.senior.amount++;
			
				}

				this.price = this.tickets.student.price + this.tickets.adult.price + this.tickets.senior.price;

				return;
			}	
		}
	}
};
</script>
<style>
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  padding: 0 !important;
  transition: height 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}
.v-application--is-ltr .v-data-footer__select {
	margin-right: 0px !important;
}
</style>