// import services from '@/services';
import trainServices from '@/services/trainData';



export default {
	namespaced: true,

	state: {
		allStations: []
	},

	mutations: {
		setStations(state, data) {
			console.log('data in set: ', data);
			state.allStations.push(data);
		}
	},

	actions: {
		async getStations({ commit }, data) {
			const trainData = await trainServices.getAllStations(data);

			console.log('This is the traindata: ', trainData);
			commit('setStations', trainData);
		}
	},

	getters: {
		getAllStations(state) {
			return state.allStations;
		}
	}
};