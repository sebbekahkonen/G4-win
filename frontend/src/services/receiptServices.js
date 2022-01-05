import axios from 'axios';

export default {

	getReceipt() {
		return axios.get('/api/receipts', {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				console.log('RESPONSE: ', response);

				return response.data.data[0];
			});
	}

};