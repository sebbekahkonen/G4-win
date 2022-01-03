const axios = require('axios');
const xmlRequests = require('./XMLRequest/xmlRequests');

const url = 'https://api.trafikinfo.trafikverket.se/v2/data.json';


async function sendStationRequest() {

	try {
		const response = await axios({
			method: 'post',
			url: url,
			data: xmlRequests.xmlStations,
			headers: { 'Content-Type': 'text/xml' }
		});
		return response.data.RESPONSE.RESULT[0].TrainStation;

	} catch (err) {
		console.log(err);
	}
}


async function sendDepartureOrArrivalRequest(activity, locationSignature, fromTime, toTime) {
	try {
		const response = await axios({
			method: 'post',
			url: url,
			data: xmlRequests.xmlDepartureOrArrival(activity, locationSignature, fromTime, toTime),
			headers: { 'Content-Type': 'text/xml' }
		});
		return response.data.RESPONSE.RESULT[0].TrainAnnouncement;

	} catch (err) {
		console.log(err);
	}
}


async function sendAllDeparturesRequest() {

	try {
		const response = await axios({
			method: 'post',
			url: url,
			data: xmlRequests.xmlAllDepartures,
			headers: { 'Content-Type': 'text/xml' }
		});
		return response.data.RESPONSE.RESULT[0].TrainAnnouncement;

	} catch (err) {
		console.log(err);
	}
}

module.exports.sendStationRequest = sendStationRequest;
module.exports.sendDepartureOrArrivalRequest = sendDepartureOrArrivalRequest;
module.exports.sendAllDeparturesRequest = sendAllDeparturesRequest;

