<template>
	<div>
		<v-card class="justify-center  mt-16 ml-2 mr-2 elevation-16">
			<v-layout row wrap class="pt-5">
				<v-flex xs6>
					<h3 class="text-center">Från: {{ from }}</h3>
				</v-flex>
				<v-flex xs6>
					<h3 class="text-center">Till: {{ to }}</h3>
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
			<StripeElementCard />
			<h3 class="pt-10 text-center">Valt datum: {{ date }}</h3>
			<!-- <stripe-checkout
				ref="checkoutRef"
				mode="payment"
				:pk="publishableKey"
				:line-items="lineItems"
				:success-url="successURL"
				:cancel-url="cancelURL"
				@loading="v => loading = v"
			/> -->
		</v-card>
	</div>
</template>
<script>
// import { StripeCheckout } from '@vue-stripe/vue-stripe';
import { StripeElementCard } from '@vue-stripe/vue-stripe';
export default {
	
	components: {
		// StripeCheckout,
		StripeElementCard
	},
	data: () => ({
		from: 'Stockholm',
		to: 'Göteborg',
		date: '2021-12-14',
		departure: '10:00',
		arrival: '13:00',
		loading: false,
		lineItems: [
			{
				price: 'some-price-id', // The id of the one-time price you created in your Stripe dashboard
				quantity: 1
			}
		],
		successURL: 'your-success-url',
		cancelURL: 'your-cancel-url',
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
	})
};
</script>
<style scoped>
	
</style>