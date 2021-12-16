<template>
	<v-card class="justify-center mx-auto mt-6" width="80%">
		<v-card class="justify-center mx-auto" width="60%">
			<h1 class="text-center">Boka din resa här!</h1>
			<form>
				<v-text-field v-model="search.stationSearch" label="Från" outlined clearable />
				<v-text-field label="Till" outlined clearable />
			</form>
			<v-col align="center">
				<v-btn color="red" @click="testSearch">Sök resa</v-btn>
			</v-col>
			<div v-for="(stationSingle, i) in singleStation" :key="i">
				{{ stationSingle.AdvertisedLocationName }}
			</div>
			<v-list>
				<v-list-item v-for="(stations, i) in trainStations" :key="i">
					<v-list-item-title>
						{{ stations.AdvertisedLocationName }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-card>
		<v-container v-show="isClicked" fluid style="margin: 0px; padding: 0px; width: 60%" class="justify-center mx-auto">
			<v-row>
				<v-col>
					<v-card>
						<v-radio-group row>
							<p class="mb-0">Inresa</p>
							<v-radio label="Avgång" value="Avgång" />
							<v-radio label="Ankomst" value="Ankomst" />
						</v-radio-group>
						<vc-date-picker v-model="date" is-expanded @dayclick="testClick" />
					</v-card>
				</v-col>
				<v-col align="center">
					<v-card>
						<v-radio-group row>
							<p class="mb-0">Utresa</p>
							<v-radio label="Avgång" value="radio-1" />
							<v-radio label="Ankomst" value="radio-2" />
						</v-radio-group>
						<vc-date-picker v-model="date" class="mt-0" is-expanded @dayclick="testClick" />
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
export default {
	data: () => ({
		trainStations: [],
		search: {
			stationSearch: ''
		},
		singleStation: '',
		date: new Date('2021-12-14'),
		isClicked: false
	}),
	created() {
	},
	methods: {
		testClick() {
			console.log(this.date.toLocaleDateString());
		},
		testSearch() {
			if (!this.isClicked && this.search.stationSearch.length > 0) {
				this.isClicked = true;
			}

			let body =
     '<REQUEST>' +
     '<LOGIN authenticationkey=\'7dcd599fb8f3436382d20e4e54ddf57a\' />' +
     ' <QUERY objecttype=\'TrainStation\' schemaversion=\'1\'>' +
       ' <FILTER>' +
           ' <AND> ' +
               ' <EQ name=\'Advertised\' value=\'true\' />' +
                `<IN name='AdvertisedLocationName' value='${this.search.stationSearch}' />` +
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
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.v-radio-group {
	min-width: 100%;
}
.v-input--radio-group__input {
	justify-content: center;
}
</style>
