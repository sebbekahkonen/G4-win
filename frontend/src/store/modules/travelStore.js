export default {
	namespaced: true,

	state: {
		travelObj: {},
		date: '',
		formatDate: new Date
	},

	mutations: {
		setTravelObj(state, payload) {
			state.travelObj = payload;
		},
		setDate(state, payload) { 
			state.date = payload;
		},
		setFormatDate(state, payload) { 
			state.formatDate = payload;
		}
	},
	actions: {
		changeFormatDate({ commit }, data) { 
			commit('setFormatDate', data);
		}
	}
};