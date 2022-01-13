<template>
	<div>
		<v-container>
			<v-btn depressed small class="mb-4 pl-0 white" @click="returnPage">
				<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
				Tillbaka
			</v-btn>

			<v-col>
				<v-list>
					<v-subheader class="payment-header">{{ travelObj.departure.departureDestination }} - {{ travelObj.departure.arrivalDestination }}</v-subheader>
					<v-divider />
					<v-list-item class="grey--text text--darken-1 pa-0">
						<v-list-item-content>
							Avgång: {{ getPickedTrain[0].departure }}
						</v-list-item-content>
						<v-list-item-content>
							Ankomst: {{ getPickedTrain[0].arrival }}
						</v-list-item-content>					
					</v-list-item>
					<v-list-item class="grey--text text--darken-1 pa-0">
						<v-list-item-content>
							{{ formatDate }}
						</v-list-item-content>
						<v-list-item-content>
							Restid: {{ getPickedTrain[0].travelTime }}
						</v-list-item-content>					
					</v-list-item>
					<v-divider />
				</v-list>
			</v-col>
				
			<v-col>
				<v-list>
					<v-subheader class="payment-header">Dina valda biljetter</v-subheader>
					<v-divider />
					<v-list-item
						v-for="(seats, i) in bookedSeats"
						:key="i"
						one-line
						class="grey--text text--darken-1 pa-0"
					>
						<v-row class="pl-3 grey--text text--darken-1">
							Tågnummer: {{ trainId }}
						</v-row>
					
						<v-list-item-content>
							<v-list-item-title>
								Vagn: {{ seats.wagon }}
							</v-list-item-title>
						</v-list-item-content>
						<v-list-item-content>
							<v-list-item-title>
								Plats: {{ seats.seat }}
							</v-list-item-title>
						</v-list-item-content>
						<v-list-item-icon>
							<v-icon class="payment-checkbox">
								mdi-checkbox-marked-circle
							</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-divider />
				</v-list>
			</v-col>
		
			<h2 class="text-center pb-5 font-italic">Pris: {{ getPrice }}kr</h2>

			<v-col class="text-center">
				<v-btn color="primary" :loading="loading1" @click="redirect">Betala</v-btn>
			</v-col>
		</v-container>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import vue from 'vue';

export default {
	data: () => ({
		loading1: false,
		departure: '10:00',
		arrival: '13:00',
		isTrue: false,
		dataSend: {}
	}),
	computed: {
		...mapState('travelStore', ['travelObj', 'date', 'formatDate', 'bookedSeats', 'trainId', 'wagon']),
		...mapGetters('ticketStore', ['getSeniorTickets', 'getAdultTickets', 'getStudentTickets', 'getPrice', 'getPickedTrain'])
	},
	created() {
		vue.nextTick(this.resetCurrentOrderNumber);
	},
	methods: {
		...mapActions('receiptStore', ['addTrainId', 'currentOrderNumber', 'resetCurrentOrderNumber']),
		...mapActions('ticketStore', ['checkout']),


		redirect() {
			let orderNum = Math.floor(Math.random() * 100000000);

			this.currentOrderNumber(orderNum);
			this.loading1 = true;
			this.checkout(100);
		},
		returnPage() {
			this.$router.push('/seats');
		}
	}

};
</script>
<style>
.payment-header {
    color: rgb(0, 0, 0) !important;
		font-size: 20px;
		font-style: oblique;
		padding: 0;
}
.payment-checkbox {
	color: green !important;
}

</style>