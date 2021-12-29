import { apiKey } from '../../shared/config.json';
import { arrivalsKey } from '../../shared/config.json';
import { departuresKey } from '../../shared/config.json';
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
	},

	getArrivals(data) {
		console.log(data);

		let body =
			`<REQUEST>
			<LOGIN authenticationkey='${arrivalsKey}' />
			<QUERY objecttype='TrainAnnouncement'
			orderby='AdvertisedTimeAtLocation' schemaversion='1'>
			<FILTER>
			<AND>
			<OR>
			<AND>
			<GT name='AdvertisedTimeAtLocation'
			value='$dateadd(00:00:00)' />
			<LT name='AdvertisedTimeAtLocation' 
			value='$dateadd(14:00:00)' />
			</AND>
			<GT name='EstimatedTimeAtLocation' value='$now' />
			</OR>
			<EQ name='LocationSignature' value='${data}' />
			<EQ name='ActivityType' value='Ankomst' />
			</AND>
			</FILTER>
			<INCLUDE>InformationOwner</INCLUDE>
			<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
			<INCLUDE>AdvertisedTrainIdent</INCLUDE>
			<INCLUDE>TrackAtLocation</INCLUDE>
			<INCLUDE>FromLocation</INCLUDE>
			<INCLUDE>ToLocation</INCLUDE>
			</QUERY>
			</REQUEST>`;

		return axios.post('https://api.trafikinfo.trafikverket.se/v2/data.json', body, {
			headers: {
				'Content-Type': 'text/xml'
			}
		})
			.then((response) => {
				console.log('this is the response: ', response);

				return response.data.RESPONSE.RESULT[0].TrainAnnouncement;
			});
	},

	getDepartures(data) {
		console.log(data);

		let body =
			`<REQUEST> 
			<LOGIN authenticationkey='${departuresKey}' />
			<QUERY objecttype='TrainAnnouncement' 
			orderby='AdvertisedTimeAtLocation' schemaversion='1'>
			<FILTER>
			<AND>
			<OR>
			<AND>
			<GT name='AdvertisedTimeAtLocation'
			value='$dateadd(00:00:00)' />
			<LT name='AdvertisedTimeAtLocation'
			value='$dateadd(14:00:00)' />
			</AND>
			<GT name='EstimatedTimeAtLocation' value='$now' />
			</OR>
			<EQ name='LocationSignature' value='${data}' />
			<EQ name='ActivityType' value='Avgang' />
			</AND>
			</FILTER>
			<INCLUDE>InformationOwner</INCLUDE>
			<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
			<INCLUDE>AdvertisedTrainIdent</INCLUDE>
			<INCLUDE>TrackAtLocation</INCLUDE>
			<INCLUDE>FromLocation</INCLUDE>
			<INCLUDE>ToLocation</INCLUDE>
			<INCLUDE>Service</INCLUDE>
			<INCLUDE>Booking</INCLUDE>
			<INCLUDE>TrainComposition</INCLUDE>
			</QUERY>
			</REQUEST>`;

		return axios.post('https://api.trafikinfo.trafikverket.se/v2/data.json', body, {
			headers: {
				'Content-Type': 'text/xml'
			}
		})
			.then((response) => {
				console.log('this is the response: ', response);

				return response.data.RESPONSE.RESULT[0].TrainAnnouncement;
			});
	}
};