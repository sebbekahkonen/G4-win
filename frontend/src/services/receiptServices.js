import axios from 'axios';

export default {

	getReceipt() {
		return axios.get('/api/current_user', {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				console.log('RESPONSE: ', response);

				return response.data.data[0];
			});
	},
	getAllReceipts() {
		return axios.get('/api/receipts', {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				return response.data.data;
			});
	},
	deleteReceipt(data) {
		return axios.delete(`/api/receipts/${data}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				return response;
			});
	}

};