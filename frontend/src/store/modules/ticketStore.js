import ticketServices from '@/services/ticketServices';
// import Vue from 'vue';


export default {
	namespaced: true,

	state: {
		tickets: [],
		studentTickets: null,
		adultTickets: null,
		seniorTickets: null
	},

	mutations: {
		setTickets(state, data) {
			state.tickets.push(data);
		},
		setStudentTickets(state, data) {
			state.studentTickets = data;
		},
		setAdultTickets(state, data) {
			state.adultTickets = data;
		},
		setSeniorTickets(state, data) {
			state.seniorTickets = data;
		}
	},

	actions: {
		async getTickets({ commit }, data) {
			const ticket = await ticketServices.searchTickets(data);

			commit('setTickets', ticket);

			return ticket;
		},
		changeStudentTickets({ commit }, data) {
			commit('setStudentTickets', data);
		},
		changeAdultTickets({ commit }, data) {
			commit('setAdultTickets', data);
		},
		changeSeniorTickets({ commit }, data) {
			commit('setSeniorTickets', data);
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
		}
	}
};