import { loadStripe } from '@stripe/stripe-js';

export default {
	namespaced: true,

	state: {
		price: null,
		tickets: [],
		cartItems: [
		],
		studentTickets: null,
		adultTickets: null,
		seniorTickets: null,
		pickedTrain: {}
	},

	mutations: {
		setTickets(state, data) {
			state.tickets.push(data);
		},
		setStudentTickets(state, data) {
			state.studentTickets = data.amount;
			state.cartItems.push(data);
		},
		setAdultTickets(state, data) {
			state.adultTickets = data.amount;
			state.cartItems.push(data);
		},
		setSeniorTickets(state, data) {
			state.seniorTickets = data.amount;
			state.cartItems.push(data);
		},
		setPrice(state, data) {
			state.price = data;
		},
		setPickedTrain(state, data) {
			state.pickedTrain = data;
		},
		resetCart(state) {
			state.studentTickets = null;
			state.adultTickets = null;
			state.seniorTickets = null;
			state.cartItems = [];
		}
	},

	actions: {
		resetCart({ commit }) {
			commit('resetCart');
		},
		// eslint-disable-next-line
		async checkout({ commit, state }, total) {
			console.log(state.cartItems);
			const stripe = await loadStripe('pk_test_51K9H37AsS2e6kWH4VOfcDVfCMbIa9qlba31LPsUUiIfVrZnFlQuPlfoQZOvpkCSFOeJxh7OKOOo2KjmcNeadWsTP00L4Us85J5');
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
		},

		changeThePrice({ commit }, data) {
			commit('setPrice', data);
		},
		changeStudentTickets({ commit }, data) {
			commit('setStudentTickets', data);
		},
		changeAdultTickets({ commit }, data) {
			commit('setAdultTickets', data);
		},
		changeSeniorTickets({ commit }, data) {
			commit('setSeniorTickets', data);
		},
		changePickedTrain({ commit }, data) {
			commit('setPickedTrain', data);
		}
	},

	getters: {
		getAllTickets(state) {
			return state.tickets;
		},
		getStudentTickets(state) {
			return state.studentTickets;
		},
		getAdultTickets(state) {
			return state.adultTickets;
		},
		getSeniorTickets(state) {
			return state.seniorTickets;
		},
		getPrice(state) {
			return state.price;
		},
		getPickedTrain(state) {
			return state.pickedTrain;
		},
		getCartItems(state) {
			console.log(state.cartItems);

			return state.cartItems;
		}
	}
};