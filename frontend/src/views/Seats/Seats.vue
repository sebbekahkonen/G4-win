<template>
	<v-container>
		<v-row>
			<v-col align="center">
				Från: Göteborg C
			</v-col>
			<v-col align="center">
				Till: Stockholm C
			</v-col>
		</v-row>
		<v-col align="center">
			Valt datum: 2021-12-20
		</v-col>
		<v-card outlined align="center">
			<v-icon left large @click="decreaseWagons">{{ 'mdi-chevron-left' }}</v-icon>
			<v-btn id="custom-disabled" text disabled>{{ 'Vagn ' + noOfWagons }}</v-btn>
			<v-icon right large @click="increaseWagons">{{ 'mdi-chevron-right' }}</v-icon>
		</v-card>
		<div class="seat-container">
			<div v-for="seats in nrOfSeats" :key="seats" class="seat-booking">
				<v-icon v-model="specificSeat" :color="icon.color" @click="testFunction(seats)">{{ icon.name }}</v-icon>
			</div>
		</div>
	</v-container>
</template>
<script>
import vue from 'vue';
export default {
	data: () =>  ({
		noOfWagons: 1,
		nrOfSeats: [],
		specificSeat: '',
		icon: {
			name: 'mdi-checkbox-blank-circle-outline',
			color: 'green'
		},
		colors: {
			green: 'green',
			red: 'red'
		}
	}),
	created() {
		vue.nextTick(this.fillSeatArr());
	},
	methods: {
		fillSeatArr() {
			for(let i=0; i<40; i++) {
				this.nrOfSeats.push(i);
			}
		},
		testFunction(seats) {
			this.specificSeat = seats;
			// console.log(e.target.value);
			// if(seats) {
			// 	this.specificSeat = seats; 
			// }
			
			// if(this.specificSeat === seats) {
			// 	this.icon.color = this.colors.red;
			// } else if (this.specificSeat !== seats) {
			// 	this.icon.color = this.colors.green;
			// }

			console.log(this.specificSeat);
		},
		bookSeats() {

			if(this.icon.color === this.colors.green) {
				this.icon.color = this.colors.red;
			} else {
				this.icon.color = this.colors.green;
			}
		},
		increaseWagons() {	
			if(this.noOfWagons != 7) 
				this.noOfWagons += 1;		
			
		},
		decreaseWagons() {
			if(this.noOfWagons != 1)	
				this.noOfWagons -= 1;
		}
	}
};
</script>
<style>
#custom-disabled.v-btn--disabled {
  color: black !important;
}
.seat-container {
	margin-top: 20px;
	margin-left: -15px;
	display: grid;
	grid-template-columns: 12px 50px 12px 12px;
	grid-template-rows: 40px 10px 40px 10px 40px 10px 40px 10px;
	column-gap: 10px;
	row-gap: 20px;
	justify-content: center;
}
.seat-booking {
	width: fit-content;
	height: fit-content;
}
.seats {
	cursor: pointer;
}
</style>