<template>
	<div>
		<v-card height="fit-content" class="justify-center  mt-16 ml-2 mr-2 elevation-16">
			<v-col class="flex text-center pa-3">
				<h3>Sök efter din biljett</h3>
				{{ getAllTickets }}
			</v-col>
			<v-text-field v-model="ticketInput" class="pa-10" label="Search.." append-icon="mdi-magnify" @click:append="search" />
			<v-data-table
				:headers="ticketHeaders"
				:items="tickets"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				item-key="name"
				show-expand
				class="elevation-10 ma-2"
				@click:row="expandRow"
				@item-expanded="onExpand"
				@row-clicked="onExpand"
			>
				<template v-slot:expanded-item="{ headers }">
					<td :colspan="headers.length" width="400">
						<v-col>
							<v-layout>
								<h3>Namn: {{ firstAndLast }}</h3>
							</v-layout>
							<v-layout>
								<h3>Platser: {{ seatsBooked }}</h3>
							</v-layout>
						</v-col>
						<v-col>
							<v-layout>
								<h4 v-if="btnClicked" class="flex text-center red--text">Är du säker på att du vill avboka?</h4>
							</v-layout>
							<v-layout row wrap class="pa-3">
								<v-btn class="flex text-left mr-10" @click="cancelBooking">Avboka</v-btn>
								<v-btn v-if="btnClicked" class="flex text-right mr-5">Ja</v-btn>
								<v-btn v-if="btnClicked" class="flex text-right">Nej</v-btn>
							</v-layout>
						</v-col>
					</td>
				</template>
			</v-data-table>
		</v-card>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	data: () => ({
		firstAndLast: 'John Doe',
		seatsBooked: '4 8 2',
		ticketInput: '',
		btnClicked: false,
		expanded: [],
		singleExpand: true,
		ticketHeaders: [
			{ 
				text: 'Name',
				value: 'name'
			}
		],
		tickets: [
			{
				name: 'Biljett 1'
			},
			{
				name: 'Biljett 2'
			},
			{
				name: 'Biljett 3'
			}
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