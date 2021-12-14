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
			<v-simple-table dark class="ma-2">
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
			</v-simple-table>
			<v-col class="text-right">
				<v-btn :disabled="chosenClicked">Nästa</v-btn>
			</v-col>
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
	}
};
</script>
<style lang="" scoped>
	
</style>