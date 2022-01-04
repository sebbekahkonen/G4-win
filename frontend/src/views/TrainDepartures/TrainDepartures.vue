<template>
	<div>
		<v-card class="justify-center  mt-16 ml-2 mr-2 elevation-16">
			<v-btn depressed small class="mb-4 pl-0 white" @click="returnPage">
				<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
				Tillbaka
			</v-btn>
			<v-layout row wrap class="pt-5">
				<v-flex xs6>
					<h3 class="text-center">Från: {{ travelObj.departure.departureDestination }}</h3>
				</v-flex>
				<v-flex xs6>
					<h3 class="text-center">Till: {{ travelObj.departure.arrivalDestination }}</h3>
				</v-flex>
			</v-layout>
			<h3 class="pt-10 text-center">Valt datum: {{ date }}</h3>
			<v-data-table
				:headers="trainHeaders"
				:items="train"
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
							<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
								<h4>Ungdom/Student(100kr/st):</h4>
								<v-icon ref="student" value="-100" @click="changePrice($event, 'student')">mdi-account-minus-outline</v-icon>
								{{ tickets.student.value }}
								<v-icon ref="student" value="+100" @click="changePrice($event, 'student')">mdi-account-plus-outline</v-icon>
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
								<h4 class="mr-16">Vuxen(139kr/st):</h4>
								<v-icon ref="adult" value="-139" @click="changePrice($event, 'adult')">mdi-account-minus-outline</v-icon>
								{{ tickets.adult.value }}
								<v-icon ref="adult" value="+139" @click="changePrice($event, 'adult')">mdi-account-plus-outline</v-icon>
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-5 flex text-right" justify-space-between>
								<h4 class="mr-12">Pensionär(79kr/st):</h4>
								<v-icon ref="senior" value="-79" @click="changePrice($event, 'senior')">mdi-account-minus-outline</v-icon>
								{{ tickets.senior.value }}
								<v-icon ref="senior" value="79" @click="changePrice($event, 'senior')">mdi-account-plus-outline</v-icon>  
							</v-layout>
						</v-col>
						<v-col>
							<v-layout row wrap class="pt-5">
								<h4 style="color: red;">{{ errorCode }}</h4>
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
		</v-card>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
	data: () => ({
		chosen: false,
		expanded: [],
		singleExpand: true,
		tickets: {
			student: {price: 0, value: 0},
			adult: {price: 0, value: 0},
			senior: {price: 0, value: 0}
		},
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
		...mapState('travelStore', ['travelObj', 'date'])
	},
	mounted() {
		this.changeStudentTickets(0);
		this.changeAdultTickets(0);
		this.changeSeniorTickets(0);
	},

	methods: {
		...mapActions('ticketStore', ['changeStudentTickets', 'changeAdultTickets', 'changeSeniorTickets']),
		returnPage() {
			this.$router.push('/');
		},

		onExpand() {
			Object.keys(this.tickets).forEach(key => {
				Object.keys(this.tickets[key]).forEach(val => {
					this.tickets[key][val] = 0;
				});
			});
			this.price = 0;
		},
		expandRow(e) {
			this.onExpand();
			this.expanded = [e];
		},
		nextView() {
			if(this.price >= 79) {
				this.errorCode = '';
				this.changeStudentTickets(this.tickets.student.value);
				this.changeAdultTickets(this.tickets.adult.value);
				this.changeSeniorTickets(this.tickets.senior.value);
				this.$router.push('/seats');
			} else{
				this.errorCode = 'Var vänlig välj minst 1 biljett';
			}
		},

		changePrice(e, type) {
			let value = parseInt(e.target.value);


			if(type.includes('student')) {

				if(value < 0 && this.tickets.student.value > 0) {
					let val = Math.abs(value);

					this.tickets.student.price = this.tickets.student.price - val;
					this.tickets.student.value--;
					
				}
 
				if(value > 0) {
					this.tickets.student.price = this.tickets.student.price + value;
					this.tickets.student.value++;

				}



				this.price = this.tickets.student.price + this.tickets.adult.price + this.tickets.senior.price;

				return;
			}

			if(type.includes('adult')) {
				if(value < 0 && this.tickets.adult.value > 0) {
					let val = Math.abs(value);

					this.tickets.adult.price = this.tickets.adult.price - val;
					this.tickets.adult.value--;

				}
 
				if(value > 0) {
					this.tickets.adult.price = this.tickets.adult.price + value;
					this.tickets.adult.value++;

				}


				this.price = this.tickets.student.price + this.tickets.adult.price + this.tickets.senior.price;

				return;
			}

			if(type.includes('senior')) {
				if(value < 0 && this.tickets.senior.value > 0) {
					let val = Math.abs(value);

					this.tickets.senior.price = this.tickets.senior.price - val;
					this.tickets.senior.value--;

				}
 
				if(value > 0) {
					this.tickets.senior.price = this.tickets.senior.price + value;
					this.tickets.senior.value++;
			
				}


				this.price = this.tickets.student.price + this.tickets.adult.price + this.tickets.senior.price;

				return;
			}
			
			
		
		}
	}
};
</script>
<style lang="" scoped>
	
</style>