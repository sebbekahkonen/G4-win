import receiptServices from '@/services/receiptServices';



export default {
	namespaced: true,

	state: {
		receiptInformation: {},
		receiptById: {},
		deletedSeats: {}
	},

	mutations: {
		setReceipt(state, data) {
			state.receiptInformation = data;
		},
		setAllReceipts(state, data) {
			state.receiptById = data;
		},
		setAllDeletedSeats(state, data) {
			state.deletedSeats = data;
		}
	},

	actions: {
		async getReceipt({ commit }) {
			const receipt = await receiptServices.getReceipt();

			commit('setReceipt', receipt);

		},
		async getAllReceipts({ commit }) {
			const receipt = await receiptServices.getAllReceipts();

			commit('setAllReceipts', receipt);
		},
		async deleteReceipt({ commit }, data) {
			await receiptServices.deleteReceipt(data);

			const receipt = await receiptServices.getAllReceipts();

			commit('setAllReceipts', receipt);
		},
		async deleteSeats({ commit }, data) {
			await receiptServices.deleteSeats(data);

			commit('setAllDeletedSeats', data);
		}

	},

	getters: {
		getTheReceipt(state) {
			return state.receiptInformation;
		},
		getAllTheReceipts(state) {
			return state.receiptById;
		},
		getDeletedSeats(state) {
			return state.deletedSeats;
		}
	}
};