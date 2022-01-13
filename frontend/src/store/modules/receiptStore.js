import receiptServices from '@/services/receiptServices';



export default {
	namespaced: true,

	state: {
		receiptInformation: {},
		receiptById: {},
		deletedSeats: {},
		currentOrderNumber: ''
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
		},
		setCurrentOrderNumber(state, data) {
			state.currentOrderNumber = data;
		},
		resetReceipt(state) {
			state.receiptInformation = {};
		},
		resetCurrentOrderNumber(state) {
			state.currentOrderNumber = '';
		}
	},

	actions: {
		resetReceipt({ commit }) {
			commit('resetReceipt');
		},
		async getReceipt({ commit }) {
			const receipt = await receiptServices.getReceipt();

			commit('setReceipt', receipt);

		},
		changeReceipt({ commit }, data) {
			console.log(data);
			commit('setReceipt', data);
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
		},
		async currentOrderNumber({ commit }, data) {
			console.log(data);
			await receiptServices.deleteCurrentOrderNumber();
			await receiptServices.currentOrderNumber(data);
			commit('setCurrentOrderNumber', data);
		},
		resetCurrentOrderNumber({ commit }) {
			commit('resetCurrentOrderNumber');
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
		},
		getCurrentOrderNumber(state) {
			console.log(state.currentOrderNumber);

			return state.currentOrderNumber;
		}
	}
};