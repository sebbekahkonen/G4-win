<template>
	<v-container> 
		<v-card class="justify-center mx-auto" width="100%">
			<h1 class="text-center">Boka din resa här!</h1>
			<form>
				<v-text-field v-model="search.stationSearch" class="pa-1" label="Från" outlined clearable />
				<v-text-field label="Till" class="pa-1" outlined clearable />
			</form>
			<v-col align="center">
				<v-btn color="red" @click="testSearch">Sök resa</v-btn>
			</v-col>
			<div v-for="(stationSingle, i) in singleStation" :key="i">
				{{ stationSingle.AdvertisedLocationName }}
			</div>			
		</v-card>
		<v-container v-show="isClicked" fluid style="margin: 0px; padding: 0px;" class="justify-center mx-auto">	
			<v-col class="pa-0 mt-3">
				<v-card>
					<div class="flex-center">
						<p class="mb-0 mt-2 ml-2 font-italic">Utresa</p>
						<v-select :items="timePick" :label="timeFormatted" dense solo />
					</div>
					<v-radio-group row class="ma-0 pa-0">
						<v-radio label="Avgång" value="Avgång" />
						<v-radio label="Ankomst" value="Ankomst" />
					</v-radio-group>
					<vc-date-picker v-model="date" is-expanded @dayclick="testClick" />
				</v-card>
			</v-col>
			<v-col class="pa-0 mt-3">
				<v-card>
					<v-card>
						<div class="flex-center">
							<p class="mb-0 mt-2 ml-2 font-italic">Återresa</p>
							<v-select :items="timePick" :label="timeFormatted" dense solo />
						</div>
						<v-radio-group row class="ma-3">
							<p class="mb-0">Återresa</p>
							<v-radio label="Avgång" value="radio-1" />
							<v-radio label="Ankomst" value="radio-2" />
						</v-radio-group>
						<vc-date-picker v-model="date" class="mt-0" is-expanded @dayclick="testClick" />
					</v-card>
				</v-card>
			</v-col>
		</v-container>
	</v-container>
</template>

<script>
import vue from 'vue';
export default {
	data: () => ({
		search: {
			stationSearch: ''
		},
		singleStation: '',
		date: new Date(),
		isClicked: false,
		timeFormatted: '',
		timePick: []
	}),
	created() {
		vue.nextTick(this.showTimeLabel());
	},
	methods: {
		showTimeLabel() {
			let hours = new Date().getHours();
			let minutes = new Date().getMinutes();

			this.timeFormatted = minutes < 10 ? `${hours}:0${minutes}` : `${hours}:${minutes}`;
			
			for (let i=hours; i<24; i++) {
				this.timePick.push(`${hours++}:00`);
			}

			// if (this.date !== new Date()) {
			// 	for (let i=0; i<24; i++) {
			// 		this.timePick.push(i);
			// 	}
			// }
			
			console.log(this.timeFormatted);
			console.log(this.timePick);

		},
		testClick() {
			console.log(this.date.toLocaleDateString());
			// this.showTimeLabel();
		
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
  display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
}
.time-input {
	align-content: right;
}
.v-radio-group {
	min-width: 100%;
}
.v-input--radio-group__input {
	justify-content: center;
}
</style>