<template>
	<div>
		<v-card class="justify-center  mt-16 ml-2 mr-2 elevation-16">
			<v-layout row wrap class="pt-5">
				<v-flex xs6>
					<h3 class="text-center">Från: {{ from }}</h3>
				</v-flex>
				<v-flex xs6>
					<h3 class="text-center">Till: {{ to }}</h3>
				</v-flex>
			</v-layout>
			<h3 class="pt-10 text-center">Valt datum: {{ date }}</h3>

			<v-data-table
				dark
				:headers="trainHeaders"
				:items="train"
				:expanded.sync="expanded"
				item-key="name"
				show-expand
				class="elevation-10 ma-2"
			>
				<template v-slot:expanded-item="{ headers }">
					<td :colspan="headers.length" width="400">
						<v-col>
							<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
								<h4>Ungdom/Student(100kr/st):</h4>
								<v-icon value="-100" @click="changePrice($event)">mdi-account-minus-outline</v-icon>
								{{ student }}
								<v-icon value="+100" @click="changePrice($event)">mdi-account-plus-outline</v-icon>
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
								<h4 class="mr-16">Vuxen(139kr/st):</h4>
								<v-icon value="-139" @click="changePrice($event)">mdi-account-minus-outline</v-icon>
								{{ adults }}
								<v-icon value="+139" @click="changePrice($event)">mdi-account-plus-outline</v-icon>
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
								<h4 class="mr-12">Pensionär(79kr/st):</h4>
								<v-icon value="-79" @click="changePrice($event)">mdi-account-minus-outline</v-icon>
								{{ seniors }}
								<v-icon value="79" @click="changePrice($event)">mdi-account-plus-outline</v-icon>  
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-5">
								<h5 style="color: red;">{{ errorCode }}</h5>
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-10 pb-3">
								<h2 class="flex text-left">Pris: {{ price }}kr</h2>	 
								<v-btn align-content="right" @click="nextView">Nästa</v-btn>
							</v-layout>
						</v-col>
					</td>
				</template>
			</v-data-table>


			<!-- 
			<v-simple-table dark class="ma-2" :expanded.sync="expanded">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="" text-align="center">
								Namn
							</th>
							<th class="" text-align="center">
								Avgång
							</th>
							<th class="" text-align="center" />
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="train in train"
							:key="train.name"
						>
							<td>{{ train.name }}</td>
							<td>{{ train.departure }}</td>
							

							<td>
								<v-col class="text-right">
									<v-btn align-content="right" @click="chosen = !chosen">Välj</v-btn>
								</v-col>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table> -->
		</v-card>
	</div>
</template>

<script>
export default {
	data: () => ({
		from: 'Stockholm',
		to: 'Göteborg',
		date: '2021-12-14',
		chosen: false,
		expanded: [],
		student: 0,
		adults: 0,
		seniors: 0,
		price: 0,
		errorCode: '',
		trainHeaders: [
			{
				text: 'Namn',
				value: 'name'
			},
			{
				text: 'Avgång',
				value: 'departure'
			}
		],
		train: [
			{
				name: 'Tåg 1',
				departure: '08:00'
			},
			{
				name: 'Tåg 2',
				departure: '09:00'
			},
			{
				name: 'Tåg 3',
				departure: '10:00'
			},
			{
				name: 'Tåg 4',
				departure: '11:00'
			}
		]
	}),
	computed: {
		chosenClicked() {
			return !this.chosen;
		}
	},
	methods: {
		nextView() {
			if(this.price >= 100) {
				this.errorCode = '';
				this.$router.push('/nextModule');
			} else{
				this.errorCode = 'Var vänlig välj minst 1 biljett';
			}
		},
		changePrice(e) {
			let value = parseInt(e.target.value);

			if(value < 0) {
				let val = Math.abs(value);

				this.price = this.price - val;

				return;
			}

			if(value > 0) {
				this.price = this.price + value;

				return;

			}
		}
	}
};
</script>
<style lang="" scoped>
	
</style>