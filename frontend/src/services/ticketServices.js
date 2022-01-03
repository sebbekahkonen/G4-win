import axios from 'axios';

export default {

	searchTickets() {

		return axios.get('/api/trains/Göteborg%20C/Stockholm%20Central', {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				console.log('response: ', response);

				console.log(response.data.data);
			});


		// return axios.get(`/api/user/${data}`, {
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// })
		// 	.then((response) => {
		// 		console.log('response: ', response);

		// 		return response.data.data;
		// 	});
	}

};