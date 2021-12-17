import { apiKey } from '../../shared/config.json';
import axios from 'axios';



export default {
	getAllStations(data) {
		console.log(data);

		let body =
			`<REQUEST>
	<LOGIN authenticationkey='${apiKey}' />
	<QUERY objecttype='TrainStation' schemaversion='1'>
	<FILTER>
	<AND>
	<EQ name='Advertised' value='true' />
	<IN name='AdvertisedLocationName' value='${data}' />
	</AND>
	</FILTER>
	<INCLUDE>AdvertisedLocationName</INCLUDE>
	</QUERY> 
	</REQUEST> `;

		return axios.post('https://api.trafikinfo.trafikverket.se/v2/data.json', body, {
			headers: {
				'Content-Type': 'text/xml'
			}
		})
			.then((response) => {
				return response.data.RESPONSE.RESULT[0].TrainStation[0].AdvertisedLocationName;
			});
	}
};