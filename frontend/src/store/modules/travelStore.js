export default {
	namespaced: true,

	state: {
		travelObj: {},
		date: '',
		returnDate: '',
		formatDate: new Date,
		returnFormatDate: new Date,
		bookedSeats: [],
		trainId: '',
		wagon: 1,
		hasBistro: false,
		arrivalTrip: false
	},

	mutations: {
		setTravelObj(state, payload) {
			state.travelObj = payload;
		},
		setDate(state, payload) { 
			state.date = payload;
		},
		setReturnDate(state, payload) { 
			state.returnDate = payload;
		},
		setFormatDate(state, payload) { 
			state.formatDate = payload;
		},
		setReturnFormatDate(state, payload) { 
			state.returnFormatDate = payload;
		},
		setBookedSeats(state, payload) { 
			state.bookedSeats = payload;
		},
		setTrainId(state, payload) { 
			state.trainId = payload;
		},
		setBookedWagon(state, payload) { 
			state.wagon = payload;
		},
		setHasBistro(state, payload) {
			state.hasBistro = payload;
		},
		setArrivalTrip(state, payload) { 
			state.arrivalTrip = payload;
		}
	},
	actions: {
		changeFormatDate({ commit }, data) { 
			commit('setFormatDate', data);
		},
		changeReturnFormatDate({ commit }, data) { 
			commit('setReturnFormatDate', data);
		}
	}
};