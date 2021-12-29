import axios from 'axios';

export default {
	searchTickets(data) {

		return axios.get(`/api/user/${data}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				console.log('response: ', response);

				return response.data.data;
			});
	}
};