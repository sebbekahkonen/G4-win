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
		
			
		<!-- <v-layout column justify-center>
				<v-layout row wrap class="pt-5 text-center">
					<v-flex xs6>
						<h3 class="text-center">Från: <br>{{ travelObj.departure.departureDestination }}</h3>
					</v-flex>
					<v-flex xs6>
						<h3 class="text-center">Till: <br>{{ travelObj.departure.arrivalDestination }}</h3>
					</v-flex>
				</v-layout>
			</v-layout>
			<v-layout column justify-center>
				<v-layout row wrap class="mt-10 text-center">
					<v-flex xs6>
						<h3 class="text-center">Ankomst: {{ getPickedTrain[0].departure }}</h3>
					</v-flex>
					<v-flex xs6>
						<h3 class="text-center">Avgång: {{ getPickedTrain[0].arrival }}</h3>
					</v-flex>
				</v-layout>
			</v-layout>
			
			<v-layout column justify-center>
				<v-layout row wrap class="mt-10">
					<v-flex>
						<h3 class="text-center">Valt datum: {{ formatDate }}</h3>
					</v-flex>
				</v-layout>
			</v-layout>
			<v-layout column justify-center>
				<v-layout row wrap class="mt-10">
					<v-flex>
						<h3 class="text-center">Email-adress: {{ getTheReceipt.email }}</h3>
					</v-flex>
				</v-layout>
			</v-layout>
			<v-layout column justify-center>
				<v-layout row wrap class="mt-10">
					<v-flex>
						<h3 class="text-center">Ordernummmer: {{ getCurrentOrderNumber }}</h3>
					</v-flex>
				</v-layout>
			</v-layout>
			<v-col class="text-center mt-16">
				<h3>Tack för att du valde G4-Win!</h3>
			</v-col>
			<v-col class="text-center">
				<h3>Vi skickar ett kvitto till din email-adress</h3>
			</v-col>
			<v-col class="text-center">
				<h3>Trevlig resa {{ getTheReceipt.name }}!</h3>	
			</v-col> -->
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
		getCustomerInformation() {
			fetch('/api/current_user', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(data => console.log(data));

			fetch('/api/confirmation')
				.then(res => res.json())
				.then(data => this.changeReceipt(data.data));
			setTimeout(this.postData, 2000);
			

		},
		postData() {
			this.receiptData = {name: '', email: '', order_number: null, train_id: null, seats: '', seatAndWagon: '', departure: null, arrival: null, departureDestination: '', arrivalDestination: ''};
			let seatsBooked = '';
			let seatAndWagon = '';
			

			Object.keys(this.bookedSeats).forEach((key)=> {
				console.log('Vagn:',this.bookedSeats[key].wagon.toString(), 'Säte:',this.bookedSeats[key].seat);
				seatAndWagon = seatAndWagon.concat('Vagn: ' + this.bookedSeats[key].wagon.toString() + ' ' + 'Säte: ' + this.bookedSeats[key].seat + ',');
				seatsBooked = seatsBooked.concat(this.bookedSeats[key].seat.toString() + ',');	
			});
			seatsBooked = seatsBooked.replace(/,\s*$/, '');
			seatAndWagon = seatAndWagon.replace(/,\s*$/, '');
			console.log(seatAndWagon);
			this.receiptData.name = this.getTheReceipt.name;
			this.receiptData.email = this.getTheReceipt.email;
			this.receiptData.order_number = this.getCurrentOrderNumber;
			this.receiptData.train_id = this.dataSend.train_id;
			this.receiptData.seats = seatsBooked;
			this.receiptData.seatAndWagon = seatAndWagon;
			this.receiptData.departure = this.getPickedTrain[0].departure;
			this.receiptData.arrival = this.getPickedTrain[0].arrival;
			console.log(this.travelObj.departure.departureDestination);
			console.log(this.travelObj.departure.arrivalDestination);
			this.receiptData.departureDestination = this.travelObj.departure.departureDestination;
			this.receiptData.arrivalDestination = this.travelObj.departure.arrivalDestination;
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