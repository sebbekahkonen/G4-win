<template>
	<div>
		<v-container>
			<v-btn depressed small class="mb-4 pl-0 white" @click="returnPage">
				<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
				Tillbaka
			</v-btn>

			<v-col>
				<v-list>
					<v-subheader class="payment-header">{{ travelObj.departure.departureDestination }} - {{ travelObj.departure.arrivalDestination }}</v-subheader>
					<v-divider />
					<v-list-item class="grey--text text--darken-1 pa-0">
						<v-list-item-content>
							Avgång: {{ getPickedTrain[0].departure }}
						</v-list-item-content>
						<v-list-item-content>
							Ankomst: {{ getPickedTrain[0].arrival }}
						</v-list-item-content>					
					</v-list-item>
					<v-list-item class="grey--text text--darken-1 pa-0">
						<v-list-item-content>
							{{ formatDate }}
						</v-list-item-content>
						<v-list-item-content>
							Restid: {{ getPickedTrain[0].travelTime }}
						</v-list-item-content>					
					</v-list-item>
					<v-divider />
				</v-list>
			</v-col>
				
			<v-col>
				<v-list>
					<v-subheader class="payment-header">Dina valda biljetter</v-subheader>
					<v-divider />
					<v-list-item
						v-for="(seats, i) in bookedSeats"
						:key="i"
						one-line
						class="grey--text text--darken-1 pa-0"
					>
						<v-row class="pl-3 grey--text text--darken-1">
							Tågnummer: {{ trainId }}
						</v-row>
					
						<v-list-item-content>
							<v-list-item-title>
								Vagn: {{ seats.wagon }}
							</v-list-item-title>
						</v-list-item-content>
						<v-list-item-content>
							<v-list-item-title>
								Plats: {{ seats.seat }}
							</v-list-item-title>
						</v-list-item-content>
						<v-list-item-icon>
							<v-icon class="payment-checkbox">
								mdi-checkbox-marked-circle
							</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-divider />
				</v-list>
			</v-col>
		
			<h2 class="text-center pb-5 font-italic">Pris: {{ getPrice }}kr</h2>

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
		publishableKey:  publishableKey,
		dataSend: {}
	}),
	computed: {
		...mapState('travelStore', ['travelObj', 'date', 'formatDate', 'bookedSeats', 'trainId', 'wagon']),
		...mapGetters('ticketStore', ['getSeniorTickets', 'getAdultTickets', 'getStudentTickets', 'getPrice', 'getPickedTrain'])
	},
	created() {
	},
	mounted() {
		this.isTrue = true;
	},
	methods: {
		...mapActions('receiptStore', ['addTrainId']),
		redirect() {
			console.log(this.dataSend);

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

			fetch('/api/current_trainId', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.catch((error) => {
					console.error('Error:', error);
				});

			for(let seats of this.bookedSeats) {
				this.dataSend = { train_id: this.trainId, seats_booked: seats.seat, date: this.date  };

				fetch('/api/current_trainId', {
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
			
			this.$refs.checkoutRef.redirectToCheckout();			

			console.log('Train_id:', this.trainId);
			console.log('Biljetter:', this.bookedSeats);
			console.log('date:', this.date);
			console.log('wagon:', this.wagon);
		},
		returnPage() {
			this.$router.push('/seats');
		}
	}

};
</script>
<style>
.payment-header {
    color: rgb(0, 0, 0) !important;
		font-size: 20px;
		font-style: oblique;
		padding: 0;
}
.payment-checkbox {
	color: green !important;
}

</style>