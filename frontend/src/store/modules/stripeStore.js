import { loadStripe } from '@stripe/stripe-js';
// import { publishableKey } from '@/../shared/config.json';

export default {
	namespaced: true,
	state: {
		cartItems: [
			{
				id: 1,
				amount: 2,
				price: 120,
				title: 'Shiny thing'
			},
			{
				id: 1,
				amount: 1,
				price: 85,
				title: 'Dull thing'
			}
		]
	},
	mutations: {
	},

	actions: {
		// eslint-disable-next-line
		async checkout({ commit, state }, total) {
			console.log(state.cartItems);
			const stripe = await loadStripe('pk_test_51K9H37AsS2e6kWH4VOfcDVfCMbIa9qlba31LPsUUiIfVrZnFlQuPlfoQZOvpkCSFOeJxh7OKOOo2KjmcNeadWsTP00L4Us85J5');
			//const elements = stripe.elements();
			let response = await fetch('/api/checkout', {
				method: 'post',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(
					{
						items: state.cartItems
					}
				)
			});
			let result = await response.json();

			console.log('Redirecting to stripe checkout..', result);

			return stripe.redirectToCheckout({ sessionId: result.id });
		}

	},

	getters: {
	}
};