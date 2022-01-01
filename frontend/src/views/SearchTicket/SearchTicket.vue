<template>
	<v-container class="justify-center">
		<v-col class="flex text-center pa-3">
			<h3>Sök efter din biljett</h3>
			{{ getAllTickets }}
		</v-col>
		<v-text-field 
			v-model="ticketInput"
			solo
			dense
			color="blue"
			label="Sök biljett"
			append-icon="mdi-magnify"
			@click:append="search"
		/>
		<v-card>			
			<v-select 
				:items="sortArray"
				label="Sort by"
				clearable
				class="pl-2 pr-2"
			/>			
			
			<v-data-table
				:headers="ticketHeaders"
				:items="tickets"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				item-key="name"	
				mobile-breakpoint="0"		
				show-expand
				@click:row="expandRow"
				@item-expanded="onExpand"		
				@row-clicked="onExpand"		
			>
				<template v-slot:expanded-item="{ headers }">
					<td :colspan="headers.length" width="400">
						<v-row justify="space-between">
							<v-col class="pa-0 pt-4">
								<h3>Namn: {{ firstAndLast }}</h3>
							</v-col>
							<v-col class="pa-0 pt-4">
								<h3 class="text-right">Platser: {{ seatsBooked }}</h3>
							</v-col>
						</v-row>																
						<v-col class="mt-4">
							<v-layout>
								<h3 v-if="btnClicked" class="flex text-center red--text">Är du säker på att du vill avboka?</h3>
							</v-layout>
							<v-layout row wrap class="pa-3">
								<v-btn v-if="btnClicked === false" class="flex text-left" color="blue darken-1 white--text" @click="cancelBooking">Avboka</v-btn>
								<v-btn v-if="btnClicked" class="flex text-right mr-5" color="success">Ja</v-btn>
								<v-btn v-if="btnClicked" class="flex text-right" color="error" @click="btnClicked = false">Nej</v-btn>
							</v-layout>
						</v-col>
					</td>
				</template>
			</v-data-table>
		</v-card>
	</v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	data: () => ({
		firstAndLast: 'John Doe',
		seatsBooked: '4, 8, 2',
		ticketInput: '',
		btnClicked: false,
		expanded: [],
		singleExpand: true,
		ticketHeaders: [
			{ 
				text: 'Name',
				value: 'name'
			},
			{
				text: 'Price',
				value: 'price'
			},
			{ 
				text: '',
				value: 'data-table-expand'
			}
		],
		tickets: [
			{
				name: 'Biljett 1',
				price: '450kr'
			},
			{
				name: 'Biljett 2',
				price: '1500kr'
			},
			{
				name: 'Biljett 3',
				price: '200kr'
			}
		],
		sortArray: [
			'Name',
			'Price',
			'Date'
		]
	}),
	computed: {
		...mapGetters('ticketStore', ['getAllTickets'])
	},

	methods: {
		...mapActions('ticketStore', ['getTickets']),
		search() {
			this.getTickets(this.ticketInput);
		},

		onExpand() {
			
		},
		expandRow(e) {
			this.onExpand();
			this.expanded = [e];
		},
		cancelBooking() {
			this.btnClicked = true;
		}
	}
};
</script>
<style scoped>
	
</style>