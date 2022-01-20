<template>
	<v-container>
		<v-btn depressed small class="pl-0 white" @click="returnPage">
			<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
			Tillbaka
		</v-btn>
		<v-layout column justify-center>
			<span class="text-center">{{ travelObj.departure.departureDestination }} - {{ travelObj.departure.arrivalDestination }}</span>
			<span class="text-center">{{ formatDate }}</span>
		</v-layout>

		<v-data-table
			:headers="trainHeaders"
			:items="trainInformation.trainsArray"
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
						<v-layout row wrap class="pt-3 flex text-right" justify-space-between>
							<v-flex xs6 class="text-left">
								<h4>Ungdom/Student({{ studentPrice }}kr/st):</h4>
							</v-flex>
							<v-flex xs6 class="" justify="space-between">
								<v-icon ref="student" class="mr-3" :value="-studentPrice" color="red" @click="changePrice($event, 'student')">mdi-account-minus-outline</v-icon>
								<span class="ml-3 mr-3">{{ tickets.student.amount }}</span>
								<v-icon ref="student" class="ml-3" :value="+studentPrice" color="green" @click="changePrice($event, 'student')">mdi-account-plus-outline</v-icon>
							</v-flex>
						</v-layout>
	

						<v-layout row wrap class="pt-3 flex text-right" justify-space-between>
							<v-flex xs6 class="text-left">
								<h4>Vuxen({{ adultPrice }}kr/st):</h4>
							</v-flex>
							<v-flex xs6 class="" justify="space-between">
								<v-icon ref="adult" class="mr-3" :value="-adultPrice" color="red" @click="changePrice($event, 'adult')">mdi-account-minus-outline</v-icon>
								<span class="ml-3 mr-3">{{ tickets.adult.amount }}</span>
								<v-icon ref="adult" class="ml-3" :value="+adultPrice" color="green" @click="changePrice($event, 'adult')">mdi-account-plus-outline</v-icon>
							</v-flex>
						</v-layout>

						<v-layout row wrap class="pt-3 flex text-right" justify-space-between>
							<v-flex xs6 class="text-left">
								<h4>Pensionär({{ seniorPrice }}kr/st):</h4>
							</v-flex>
							<v-flex xs6 class="" justify="space-between">
								<v-icon ref="senior" class="mr-3" :value="-seniorPrice" color="red" @click="changePrice($event, 'senior')">mdi-account-minus-outline</v-icon>
								<span class="ml-3 mr-3">{{ tickets.senior.amount }}</span>
								<v-icon ref="senior" class="ml-3" :value="+seniorPrice" color="green" @click="changePrice($event, 'senior')">mdi-account-plus-outline</v-icon>  
							</v-flex>
						</v-layout>

						<v-layout row wrap class="pt-5">
							<h4 style="color: red;">{{ errorCode }}</h4>
						</v-layout>
	
						<v-layout row wrap class="pt-3 pb-3">
							<h2 class="flex text-left">Pris: {{ price }}kr</h2>	 
							<v-btn align-content="right" class="mr-1" color="primary" @click="nextView">Nästa</v-btn>
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
		seniorPrice: 0,
		studentPrice: 0,
		adultPrice: 0,
		trainIdArr: [],
		errorCode: '',
		trainInformation: {
			trainsArray: [],
			adultPrices: [],
			seniorPrices: [],
			studentPrices: []
		},
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
		vue.nextTick(this.fetchTravelExit());
		vue.nextTick(console.log(this.formatDate));
		vue.nextTick(console.log(this.date));
	},

	mounted() {
		this.resetCart();
	},

	methods: {
		...mapActions('ticketStore', ['changeStudentTickets', 'changeAdultTickets', 'changeSeniorTickets', 'changeThePrice', 'changePickedTrain', 'resetCart']),
		returnPage() {
			this.$router.push('/');
		},
		fetchTravelExit() {
			fetch(`/api/trains/${this.travelObj.departure.departureDestination}/${this.travelObj.departure.arrivalDestination}`)
				.then(res => res.json())
				.then(data => Object.keys(data.data).forEach(key => {
					if(data.data[key].date === this.date && data.data[key].departure > this.travelObj.departure.selectedTime) {
						this.trainInformation.trainsArray.push(data.data[key]);
						console.log((data.data[key]));
						this.trainIdArr.push(data.data[key].id);


					}				
				})
				);			
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
				fetch(`/api/prices/getPrices/fetchPrices/${value.item.id}`)
					.then(res => res.json())
					.then(data => Object.keys(data.data).forEach(key => {
						if(data.data[key].train_id === value.item.id) {
							console.log(data.data[key].price_adult);
							this.adultPrice = data.data[key].price_adult;
							this.studentPrice = data.data[key].price_student;
							this.seniorPrice = data.data[key].price_senior;
						}
					}));

				this.$store.commit('travelStore/setTrainId', value.item.id);
				
				if(value.item.service === 'Ja') {
					this.hasBistro = true;
				} else {
					this.hasBistro = false;
				}

				console.log('Bistro: ',this.hasBistro);
				this.$store.commit('travelStore/setHasBistro', this.hasBistro);
			} else {
				fetch(`/api/prices/getPrices/fetchPrices/${value.id}`)
					.then(res => res.json())
					.then(data => Object.keys(data.data).forEach(key => {
						if(data.data[key].train_id === value.id) {
							console.log(data.data[key].price_adult);
							this.adultPrice = data.data[key].price_adult;
							this.studentPrice = data.data[key].price_student;
							this.seniorPrice = data.data[key].price_senior;
						}
					}));

				this.$store.commit('travelStore/setTrainId', value.id);

				if(value.service === 'Ja') {
					this.hasBistro = true;
				} else {
					this.hasBistro = false;
				}

				console.log('Bistro: ',this.hasBistro);
				this.$store.commit('travelStore/setHasBistro', this.hasBistro);

			}
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
/* .row {
    margin: 0;
} */

@media screen and (min-width: 1024px) {
	.container {
		width: 60%;
	}
}
</style>