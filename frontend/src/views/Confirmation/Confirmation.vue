<template>
	<div>
		<v-form>
			<v-container>
				<v-layout column justify-center>
					<v-layout row wrap class="pt-5 text-center">
						<v-flex xs6>
							<h4 class="text-center">Från: {{ travelObj.departure.departureDestination }}</h4>
						</v-flex>
						<v-flex xs6>
							<h4 class="text-center">Till: {{ travelObj.departure.arrivalDestination }}</h4>
						</v-flex>
					</v-layout>
				</v-layout>
			</v-container>
		</v-form>
		<v-container>
			<v-layout row wrap class="pt-5 text-center">
				<v-flex xs6>
					<v-col cols="8" class="ml-10">
						<v-text-field
							label="Avgång"
							:value="getPickedTrain[0].departure"
							type="time"
							suffix="CET"
							readonly
						/>
					</v-col>
				</v-flex>
				<v-flex xs6>
					<v-col cols="8" class="ml-10">
						<v-text-field
							label="Ankomst"
							:value="getPickedTrain[0].arrival"
							type="time"
							suffix="CET"
							readonly
						/>
					</v-col>
				</v-flex>
			</v-layout>
			<v-row>
				<v-col cols="10" class="ml-10">
					<v-text-field
						label="Valt Datum"
						:value="formatDate"
						readonly
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="10" class="ml-10">
					<v-text-field
						label="Summa"
						:value="getPrice"
						suffix="SEK"
						readonly
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="10" class="ml-10">
					<v-text-field
						label="Email-address"
						:value="getTheReceipt.email"
						
						readonly
					/>
				</v-col>
			</v-row>
			<v-row />
			<v-row />
		</v-container>
		<v-col class="text-center">
			<h3>Ordernummmer: {{ getCurrentOrderNumber }} </h3>
		</v-col>
		<v-col class="text-center">
			<h3>Tack för att du valde G4-Win!</h3>
		</v-col>
		<v-col class="text-center">
			<h3>Vi skickar ett kvitto till din email-adress</h3>
		</v-col>
		<v-col class="text-center">
			<h3>Trevlig resa {{ getTheReceipt.name }}!</h3>	
		</v-col>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
		dataSend: {},
		receiptData: {},
		orderNumber: ''
	}),
	computed: {
		...mapGetters('ticketStore', ['getPrice', 'getPickedTrain']),
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
			this.receiptData = {name: '', email: '', order_number: null, train_id: null, seats: ''};
			let seatsBooked = '';

			

			Object.keys(this.bookedSeats).forEach((key)=> {
				seatsBooked = seatsBooked.concat(this.bookedSeats[key].seat.toString() + ',');	
			});
			seatsBooked = seatsBooked.replace(/,\s*$/, '');
			this.receiptData.name = this.getTheReceipt.name;
			this.receiptData.email = this.getTheReceipt.email;
			this.receiptData.order_number = this.getCurrentOrderNumber;
			this.receiptData.train_id = this.dataSend.train_id;
			this.receiptData.seats = seatsBooked;
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
</style>