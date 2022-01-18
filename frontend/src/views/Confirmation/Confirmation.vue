<template>
	<div>
		<v-container>
			<v-layout column justify-center class="">
				<v-layout row wrap class="pt-5 mr-1 text-left">
					<v-flex>
						<h2>Ditt kvitto för {{ getCurrentOrderNumber }}</h2>
					</v-flex>
				</v-layout>
				<v-layout row wrap class="mt-16 mb-5 ml-0 text-left">
					<v-flex xs6>
						<v-row>
							<h4>Order status:</h4>
							<span>&nbsp;Genomförd</span>
						</v-row>
						<v-row>
							<h4>Ordernummer:</h4>
							<span>&nbsp;{{ getCurrentOrderNumber }}</span>
						</v-row>
						<v-row>
							<h4>Order datum:</h4>
							<span>&nbsp;{{ todaysDate }}</span>
						</v-row>
						<v-row>
							<h4>Betalningsmetod:</h4>
							<span>&nbsp;Kortbetalning</span>
						</v-row>
						<v-row>
							<h4>Från:</h4>
							<span>&nbsp;{{ travelObj.departure.departureDestination }}</span>	
						</v-row>
						<v-row>
							<h4>Till:</h4>
							<span>&nbsp;{{ travelObj.departure.arrivalDestination }}</span>
						</v-row>
						<v-row>
							<h4>Avgång:</h4>
							<span>&nbsp;{{ getPickedTrain[0].departure }}</span>
						</v-row>
						<v-row>
							<h4>Ankomst:</h4>
							<span>&nbsp;{{ getPickedTrain[0].arrival }}</span>
						</v-row>
					</v-flex>
					<v-flex xs6>
						<v-img width="160px" height="118px" src="@/assets/G4Win-logo.png" />
					</v-flex>
				</v-layout>
			</v-layout>
		</v-container>
		<v-divider />
		<v-container class="pl-10 pr-10 pb-10">
			<v-layout column justify-center>
				<v-layout row wrap class="mt-2 text-left">
					<v-flex />
				</v-layout>
				<v-layout row wrap class="mt-10 text-left">
					<v-flex>
						<h2>Summering:</h2>
					</v-flex>
				</v-layout>
				<v-layout row wrap class="mt-10 text-left">
					<v-flex xs3>
						<h4>Antal</h4>
					</v-flex>
					<v-flex xs5>
						<h4>Typ</h4>
					</v-flex>
					<v-flex xs3>
						<h4>Summa</h4>
					</v-flex>
				</v-layout>
				<v-layout v-for="ticket in getCartItems" :key="ticket.title" row wrap class="mt-5 text-left">
					<v-flex xs3>
						<span>{{ ticket.amount }}</span>
					</v-flex>
					<v-flex xs5>
						<span>{{ ticket.title }}</span>
					</v-flex>
					<v-flex xs3>
						<span>{{ ticket.price }}kr</span>
					</v-flex>
				</v-layout>
			</v-layout>
		</v-container>
		<v-divider />
		<v-container class="pl-10 pr-10 pb-10">
			<v-layout row wrap class="mt-0 text-left">
				<v-flex xs3>
					<h4>Summa totalt:</h4>
				</v-flex>
				<v-flex xs5 />
				<v-flex xs3>
					<span>{{ getPrice }}</span>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
		dataSend: {},
		receiptData: {},
		orderNumber: '',
		ticketsStudent: '',
		ticketsAdult: '',
		ticketsSenior: '',
		todaysDate: new Date().toLocaleDateString()
	}),
	computed: {
		...mapGetters('ticketStore', ['getPrice', 'getPickedTrain', 'getCartItems', 'getPrice']),
		...mapGetters('receiptStore', ['getTheReceipt', 'getCurrentOrderNumber']),
		...mapState('travelStore', ['travelObj', 'date', 'formatDate', 'bookedSeats', 'trainId', 'wagon'])
	},
	created() {
		vue.nextTick(this.resetReceipt);
		vue.nextTick(this.setSeats);
		vue.nextTick(this.postData);
		vue.nextTick(this.getCustomerInformation);
	},
	methods: {
		...mapActions('receiptStore', ['getReceipt', 'changeReceipt', 'resetReceipt', 'currentOrderNumber']),
		setSeats() {
			for(let seats of this.bookedSeats) {
				this.dataSend = { train_id: this.trainId, seats_booked: seats.seat, wagon: seats.wagon, date: this.date  };
				fetch('/api/seats', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(this.dataSend)
				})
					.then(res => res.json())
					.then(data => {
						console.log('Success:', data);
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			}
		},
	
		async postData() {
			fetch('/api/current_user', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(data => console.log(data));
			this.receiptData = {name: '', email: '', order_number: null, train_id: null, seats: '', seatAndWagon: '', departure: null, arrival: null, departureDestination: '', arrivalDestination: '', ticketsStudent: '', ticketsAdult: '', ticketsSenior: ''};
			let seatsBooked = '';
			let seatAndWagon = '';

			this.ticketsStudent = '';
			this.ticketsAdult = '';
			this.ticketsSenior = '';	

			Object.keys(this.bookedSeats).forEach((key)=> {
				seatAndWagon = seatAndWagon.concat('Vagn: ' + this.bookedSeats[key].wagon.toString() + ' ' + 'Säte: ' + this.bookedSeats[key].seat + ',');
				seatsBooked = seatsBooked.concat(this.bookedSeats[key].seat.toString() + ',');	
			});
			Object.keys(this.getCartItems).forEach((key)=> {
				Object.keys(this.getCartItems[key]).forEach((val) => {
					if(this.getCartItems[key]['id'] === 1) {
						if(val === 'price' || val === 'amount' || val === 'title') {
							if(val === 'price') {
								this.ticketsStudent += this.getCartItems[key][val] + 'kr,';
							}else{
								this.ticketsStudent += this.getCartItems[key][val] + ',';
							}
						}
					}

					if(this.getCartItems[key]['id'] === 2) {
						if(val === 'price' || val === 'amount' || val === 'title') {
							if(val === 'price') {
								this.ticketsAdult += this.getCartItems[key][val] + 'kr,';
							}else{
								this.ticketsAdult += this.getCartItems[key][val] + ',';
							}
						}
					}

					if(this.getCartItems[key]['id'] === 3) {
						if(val === 'price' || val === 'amount' || val === 'title') {
							if(val === 'price') {
								this.ticketsSenior += this.getCartItems[key][val] + 'kr,';
							}else{
								this.ticketsSenior += this.getCartItems[key][val] + ',';
							}
						}
					}

				});
			});
			this.ticketsStudent = this.ticketsStudent.replace(/,\s*$/, '');
			this.ticketsAdult = this.ticketsAdult.replace(/,\s*$/, '');
			this.ticketsSenior = this.ticketsSenior.replace(/,\s*$/, '');
			seatsBooked = seatsBooked.replace(/,\s*$/, '');
			seatAndWagon = seatAndWagon.replace(/,\s*$/, '');
			
			this.receiptData.order_number = this.getCurrentOrderNumber;
			this.receiptData.train_id = this.dataSend.train_id;
			this.receiptData.seats = seatsBooked;
			this.receiptData.seatAndWagon = seatAndWagon;
			this.receiptData.departure = this.getPickedTrain[0].departure;
			this.receiptData.arrival = this.getPickedTrain[0].arrival;
			this.receiptData.departureDestination = this.travelObj.departure.departureDestination;
			this.receiptData.arrivalDestination = this.travelObj.departure.arrivalDestination;
			this.receiptData.ticketsStudent = this.ticketsStudent;
			this.receiptData.ticketsAdult = this.ticketsAdult;
			this.receiptData.ticketsSenior = this.ticketsSenior;
			
			fetch('/api/current_user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.receiptData)
			})
				.then(res => res.json())
				.then(data => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});

			await fetch('/api/confirmation')
				.then(res => res.json())
				.then(data => this.changeReceipt(data.data));
			
			this.receiptData.name = this.getTheReceipt.name;
			this.receiptData.email = this.getTheReceipt.email;
			
			fetch('/api/receipts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.receiptData)
			})
				.then(res => res.json())
				.then(data => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}

	}
};
</script>

<style scoped>
.col-xl, .col-xl-auto, .col-xl-12, .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-lg, .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md, .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-sm, .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col, .col-auto, .col-12, .col-11, .col-10, .col-9, .col-8, .col-7, .col-6, .col-5, .col-4, .col-3, .col-2, .col-1{
	padding: 0px;
}
.logoImg{
	
	object-fit: cover;
}
</style>