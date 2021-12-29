// import services from '@/services';
import trainServices from '@/services/trainData';



export default {
	namespaced: true,

	state: {
		allStations: [],
		arrivals: [],
		departures: []
	},

	mutations: {
		setStations(state, data) {
			console.log('data in set: ', data);
			state.allStations.push(data);
		},
		setArrivals(state, data) {
			state.arrivals.push(data);
		},
		setDepartures(state, data) {
			state.departures.push(data);
		}
	},

	actions: {
		async getStations({ commit }, data) {
			const trainData = await trainServices.getAllStations(data);

			console.log('This is the traindata: ', trainData);
			commit('setStations', trainData);
		},

		/* Få ankomster */
		async getArrivals({ commit }, data) {
			const trainData = await trainServices.getArrivals(data);

			console.log('This is the arrivalsData: ', trainData);
			commit('setArrivals', trainData);
		},

		/* Få anvångar */
		async getDepartures({ commit }, data) {
			const trainData = await trainServices.getDepartures(data);

			console.log('This is the departuresData: ', trainData);
			commit('setDepartures', trainData);
		}

	},

	getters: {
		getAllStations(state) {
			return state.allStations;
		}
	}
};