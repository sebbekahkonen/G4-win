<template>
	<div>
		<v-container>
			<v-btn depressed small class="mb-4 pl-0 white" @click="returnPage">
				<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
				Tillbaka
			</v-btn>
			<v-layout column justify-center>
				<h2 class="text-center">{{ travelObj.departure.departureDestination }} - {{ travelObj.departure.arrivalDestination }}</h2>
				<v-layout row wrap class="pt-5 text-center">
					<v-flex xs6>
						<span class="text-center">Avgång: {{ getPickedTrain[0].departure }}</span>
					</v-flex>
					<v-flex xs6>
						<span class="text-center">Ankomst: {{ getPickedTrain[0].arrival }}</span>
					</v-flex>
				</v-layout>
				<v-layout row wrap class="pt-2 pb-2 text-center">
					<v-flex xs6>
						<span class="text-center">{{ formatDate }}</span>
					</v-flex>
					<v-flex xs6>
						<span class="text-center">Restid: {{ getPickedTrain[0].travelTime }}</span>
					</v-flex>
				</v-layout>
				<h2 class="text-center pt-5 pb-5">Pris: {{ getPrice }}kr</h2>
				<div v-for="seats in bookedSeats" :key="seats" align="center">
					<span class="text-center"> Biljetter: {{ seats }} </span>
				</div>
			</v-layout>
			<v-col class="text-center">
				<stripe-checkout v-if="isTrue"
					ref="checkoutRef"
					mode="payment"
					:pk="publishableKey"
					:line-items="lineItems"
					:success-url="successUrl"
					:cancel-url="cancelUrl"
					@loading="v => loading = v"
				/>
				<v-btn color="primary" @click="redirect">Betala</v-btn>
			</v-col>
		</v-container>
	</div>
</template>
<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';
import { publishableKey } from '@/../shared/config.json';
import { mapGetters, mapState, mapActions } from 'vuex';
export default {
	components: {
		StripeCheckout
	},
	data: () => ({
		departure: '10:00',
		arrival: '13:00',
		isTrue: false,
		successUrl: 'http://localhost:8080/confirmation',
		cancelUrl: 'http://localhost:8080/payment',
		lineItems: [
		],
		publishableKey:  publishableKey
	}),
	computed: {
		...mapState('travelStore', ['travelObj', 'date', 'formatDate', 'bookedSeats', 'trainId']),
		...mapGetters('ticketStore', ['getSeniorTickets', 'getAdultTickets', 'getStudentTickets', 'getPrice', 'getPickedTrain'])
	},

	mounted() {
		this.isTrue = true;
	},
	methods: {
		...mapActions('receiptStore', ['addTrainId']),
		redirect() {
			if(this.getSeniorTickets != 0) {
				//Senior ticket
				this.lineItems.push({price: 'price_1KDAuMAsS2e6kWH4nB12fPda', quantity: this.getSeniorTickets});
			}

			if(this.getAdultTickets != 0) {
				//Adult ticket
				this.lineItems.push({price: 'price_1KDAv0AsS2e6kWH4FZ6qrLXJ', quantity: this.getAdultTickets});
			}

			if(this.getStudentTickets != 0) {
				//Student ticket
				this.lineItems.push({price: 'price_1KDAvTAsS2e6kWH4adHlU5fH', quantity: this.getStudentTickets});
			}

			// this.addTrainId(this.trainId);
			for(let seats of this.bookedSeats) {
				let dataSend = { train_id: this.trainId, seats_booked: seats, date: this.date  };

				fetch('/api/current_trainId', {
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
			this.$refs.checkoutRef.redirectToCheckout();			
			console.log('Train_id:', this.trainId);
			console.log('Biljetter:', this.bookedSeats);
			console.log('date:', this.date);


			for(let seats of this.bookedSeats) {
				let dataSend = { train_id: this.trainId, seats_booked: seats, date: this.date  };

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

			
		},
		returnPage() {
			this.$router.push('/seats');
		}
	}

};
</script>
<style scoped>
	
</style>