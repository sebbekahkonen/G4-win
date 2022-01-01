<template>
	<div>
		<v-card class="justify-center  mt-16 ml-2 mr-2 elevation-16">
			<v-btn depressed small class="mb-4 pl-0 white" @click="returnPage">
				<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
				Tillbaka
			</v-btn>
			<v-layout row wrap class="pt-5">
				<v-flex xs6>
					<h3 class="text-center">Från: {{ travelObj.departure.departureDestination }}</h3>
				</v-flex>
				<v-flex xs6>
					<h3 class="text-center">Till: {{ travelObj.departure.arrivalDestination }}</h3>
				</v-flex>
			</v-layout>
			<v-layout row wrap class="pt-5">
				<v-flex xs6>
					<h3 class="text-center">Avgång: {{ departure }}</h3>
				</v-flex>
				<v-flex xs6>
					<h3 class="text-center">Ankomst: {{ arrival }}</h3>
				</v-flex>
			</v-layout>
			<v-col>
				<h3 class="pt-10 text-center">Valt datum: {{ date }}</h3>
			</v-col>
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
		</v-card>
	</div>
</template>
<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';
import { publishableKey } from '@/../shared/config.json';
import { mapGetters, mapState } from 'vuex';
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
		...mapState('travelStore', ['travelObj', 'date']),
		...mapGetters('ticketStore', ['getSeniorTickets', 'getAdultTickets', 'getStudentTickets'])
	},

	mounted() {
		this.isTrue = true;
	},
	methods: {
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

			this.$refs.checkoutRef.redirectToCheckout();
		},
		returnPage() {
			this.$router.push('/seats');
		}
	}

};
</script>
<style scoped>
	
</style>