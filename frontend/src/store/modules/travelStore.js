export default {
	namespaced: true,

	state: {
		travelObj: {},
		date: ''
	},

	mutations: {
		setTravelObj(state, payload) {
			state.travelObj = payload;
		},
		setDate(state, payload) { 
			state.date = payload;
		}
	}	
};