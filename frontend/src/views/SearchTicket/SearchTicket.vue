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
			height="50px"
			label="Ordernummer"
			append-icon="mdi-magnify"
			@click:append="search"
			@keydown.enter="search"
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
						<v-layout class="pt-0 text-center">
							<v-col>
								<v-list>
									<v-subheader class="payment-header">Dina valda biljetter</v-subheader>
									<v-divider />
									<v-list-item
										v-for="(seats, i) in wagonAndSeat"
										:key="i"
										one-line
										class="grey--text text--darken-1 pa-0"
									>
										<v-row class="pl-0 grey--text text--darken-1">
											Tågnummer: {{ tickets[0].train_id }}
										</v-row>
					
										<v-list-item-content>
											<v-list-item-title>
												{{ seats }}
											</v-list-item-title>
										</v-list-item-content>
										<v-list-item-icon>
											<v-icon class="payment-checkbox">
												mdi-checkbox-marked-circle
											</v-icon>
										</v-list-item-icon>
									</v-list-item>
									<v-divider />
									<v-layout row wrap class="pt-5 text-center">
										<v-flex xs5>
											<span class="text-center">Namn: {{ tickets[0].name }}</span>
										</v-flex>
										<v-flex xs6>
											<span class="text-center">Email: {{ tickets[0].email }}</span>
										</v-flex>
									</v-layout>
								</v-list>
							</v-col>
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
		wagonAndSeat: [],
		ticketHeaders: [
			{
				text: 'Från',
				value: 'departureDestination'
			},
			{
				text: 'Till',
				value: 'arrivalDestination'
			},
			{
				text: 'Avgång',
				value: 'departure'
			},
			{
				text: 'Ankomst',
				value: 'arrival'
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
			this.wagonAndSeat = this.tickets[0].seatAndWagon.split(',');
			console.log(this.wagonAndSeat[0]);
			console.log(this.wagonAndSeat);
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
	.testClass{
		text-align: center;
		list-style-type: none;
	}
	.ulDiv{
		margin-left: 25%;
	}
</style>