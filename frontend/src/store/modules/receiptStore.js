import receiptServices from '@/services/receiptServices';



export default {
	namespaced: true,

	state: {
		receiptInformation: {}
	},

	mutations: {
		setReceipt(state, data) {
			console.log(data);
			state.receiptInformation = data;
		}
	},

	actions: {
		async getReceipt({ commit }) {
			const receipt = await receiptServices.getReceipt();

			console.log(receipt);
			commit('setReceipt', receipt);

		}
	},

	getters: {
		getTheReceipt(state) {
			return state.receiptInformation;
		}
	}
};