import axios from 'axios';

export default {
	deleteCurrentOrderNumber() {
		return axios.delete('/api/current_orderNumber');
	},
	currentOrderNumber(data) {
		console.log(data);

		return axios.post('/api/current_orderNumber', {
			order_number: `${data}`
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	},
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
	},
	deleteSeats(data) {
		return axios.delete(`/api/seats/deleteSeats/${data.train_id}/${data.seat}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				return response;
			});
	}

};