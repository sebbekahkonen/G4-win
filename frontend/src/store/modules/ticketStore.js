import ticketServices from '@/services/ticketServices';
// import Vue from 'vue';


export default {
	namespaced: true,

	state: {
		tickets: []
	},

	mutations: {
		setTickets(state, data) {
			state.tickets.push(data);
		}
	},

	actions: {
		async getTickets({ commit }, data) {
			const ticket = await ticketServices.searchTickets(data);

			commit('setTickets', ticket);

			return ticket;
		}
	},

	getters: {
		getAllTickets(state) {
			return state.tickets;
		}
	}
};