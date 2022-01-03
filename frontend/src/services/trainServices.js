import axios from 'axios';


export default {
	searchTrains(from, to) {
		return axios.get(`/api/trains/${from}/${to}`, {
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