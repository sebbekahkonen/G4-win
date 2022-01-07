export default {
	namespaced: true,

	state: {
		travelObj: {},
		date: '',
		formatDate: new Date,
		bookedSeats: [],
		trainId: '',
		wagon: 1
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
		},
		setBookedSeats(state, payload) { 
			state.bookedSeats = payload;
		},
		setTrainId(state, payload) { 
			state.trainId = payload;
		},
		setBookedWagon(state, payload) { 
			state.wagon = payload;
		}
	},
	actions: {
		changeFormatDate({ commit }, data) { 
			commit('setFormatDate', data);
		}
	}
};