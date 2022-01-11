<template>
	<v-container class="justify-center">
		<v-col class="flex text-center pa-3">
			<h3>Sök efter din biljett med ordernummer</h3>
		</v-col>
		<v-text-field 
			v-model="ticketInput"
			solo
			dense
			color="blue"
			label="Ordernummer"
			append-icon="mdi-magnify"
			@click:append="search"
			@keydown.enter="search"
		/>
					
		<v-select 
			:items="sortArray"
			label="Sort by"
			clearable
			class="pl-2 pr-2"
		/>			
			
		<v-data-table
			v-if="isTrue"
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
				<td :colspan="headers.length">
					<v-layout column justify-center>
						<v-layout row wrap class="pt-5 text-center">
							<v-flex xs6>
								<span class="text-center">Namn: {{ firstAndLast }}</span>
							</v-flex>
							<v-flex xs6>
								<span class="text-center">Platser: {{ seatsBooked }}</span>
							</v-flex>
						</v-layout>
					</v-layout>
					<v-col class="mt-4">
						<v-layout>
							<h3 v-if="btnClicked" class="flex text-center red--text">Är du säker på att du vill avboka?</h3>
						</v-layout>
						<v-layout row wrap class="pa-3">
							<v-btn v-if="btnClicked === false" class="flex text-left" color="blue darken-1 white--text" @click="cancelBooking">Avboka</v-btn>
							<v-btn v-if="btnClicked" class="flex text-right mr-5" color="success" @click="removeTicket">Ja</v-btn>
							<v-btn v-if="btnClicked" class="flex text-right" color="error" @click="btnClicked = false">Nej</v-btn>
						</v-layout>
					</v-col>
				</td>
			</template>
		</v-data-table>
	</v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
		isTrue: false,
		firstAndLast: 'John Doe',
		seatsBooked: '',
		ticketInput: '',
		btnClicked: false,
		expanded: [],
		singleExpand: true,
		seatsToRemove: [],
		ticketHeaders: [
		
			{
				text: 'Email',
				value: 'email'
			},
			
			{
				text: 'Ordernummer',
				value: 'order_number'
			},
			{ 
				text: 'Säten',
				value: 'seats'
			}
		],
		tickets: [
		
		],
		sortArray: [
			'Name',
			'Price',
			'Date'
		]
	}),
	computed: {
		...mapGetters('ticketStore', ['getAllTickets']),
		...mapGetters('receiptStore', ['getAllTheReceipts'])
	},
	created() {
		vue.nextTick(this.getAllReceipts);
	},

	methods: {
		...mapActions('ticketStore', ['getTickets']),
		...mapActions('receiptStore', ['getAllReceipts', 'deleteReceipt', 'deleteSeats']),
		search() {
			this.tickets = [];
			this.seatsToRemove = [];
			Object.keys(this.getAllTheReceipts).forEach(key => {
				if (this.getAllTheReceipts[key].order_number == (this.ticketInput)) {
					this.tickets.push(this.getAllTheReceipts[key]);
				}
			});
			this.seatsBooked = this.tickets[0].seats;
			this.seatsToRemove = this.seatsBooked.split(',');
			Object.keys(this.seatsToRemove).forEach(key => {
				this.seatsToRemove[key] = parseInt(this.seatsToRemove[key]);
			});
			this.isTrue = true;
		},

		removeTicket() {
			this.deleteReceipt(this.tickets[0].id);
			Object.keys(this.seatsToRemove).forEach(key => {
				let seatAndTrainId = {train_id: this.tickets[0].train_id, seat: this.seatsToRemove[key]};

				this.deleteSeats(seatAndTrainId);
			});
			this.ticketInput = '';
			this.isTrue = false;
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
<style>
	.v-data-table-header{
		font-style: oblique;
	}
	.text-start{
		color: rgb(0, 0, 0);
	}
	.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
		background-color: white;
		box-shadow:none;
		color: rgb(114, 114, 114);
	}
	tr:nth-child(even) {
		background-color: rgb(236, 236, 236);
	}
</style>