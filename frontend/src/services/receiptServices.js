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
	}

};