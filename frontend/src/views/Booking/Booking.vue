<template>
	<v-card> 
		<h1>Boka din resa här!</h1>
		<form @submit.prevent="testSearch">
			<div>
				<label for="sök">Sök</label>
				<input v-model="search.stationSearch" name="sök" placeholder="sök">
			</div>
		</form>
		<div>
			{{ singleStation }}
		</div>
		<v-list>
			<v-list-item v-for="(stations, i) in trainStations" :key="i">
				<v-list-item-title>
					{{ stations.AdvertisedLocationName }}
				</v-list-item-title>
			</v-list-item>
		</v-list>
		<v-btn color="blue" @click="testApi">Testa apiet</v-btn>
	</v-card>
</template>

<script>
import vue from 'vue';
export default {
	data: () => ({
		trainStations: [],
		search: {
			stationSearch: ''
		},
		singleStation: ''
	}),
	created() {
		vue.nextTick(this.testApi());
	},
	methods: {
		testApi() {
			let body = 
     '<REQUEST>' +
      '<LOGIN authenticationkey=\'7dcd599fb8f3436382d20e4e54ddf57a\' />' +
      '<QUERY objecttype=\'TrainStation\' schemaversion=\'1\' limit=\'5\'>' +
     '<FILTER>' +
      '<EQ name=\'Advertised\' value=\'true\' />' +
     '</FILTER>' +
     '<INCLUDE>AdvertisedLocationName</INCLUDE>' +
     ' </QUERY>' +
     '</REQUEST>';

			fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'text/xml'
				},
				body: body
			}).then(res => res.json())
				.then(data => this.trainStations = data.RESPONSE.RESULT[0].TrainStation);
			//  console.log('Trainstations ',this.trainStations);
		},
		testSearch() {
			let body =
     '<REQUEST>' +
     '<LOGIN authenticationkey=\'7dcd599fb8f3436382d20e4e54ddf57a\' />' +
     ' <QUERY objecttype=\'TrainStation\' schemaversion=\'1\'>' +
       ' <FILTER>' +
           ' <AND> ' +
               ' <EQ name=\'Advertised\' value=\'true\' />' +
                '<IN name=\'AdvertisedLocationName\' value=\'Alingsås\' />' +
            '</AND> ' +
        '</FILTER>' +
            '<INCLUDE>AdvertisedLocationName</INCLUDE>' +
      '</QUERY> ' +
     '</REQUEST> '; 

			fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'text/xml'
				},
				body: body
			}).then(res => res.json())
				.then(data => this.singleStation = data.RESPONSE.RESULT[0].TrainStation);
		}
	}
};
</script>

<style>
</style>