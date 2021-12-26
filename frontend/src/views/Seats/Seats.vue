<template>
	<v-container>
		<v-btn depressed small class="mb-4 pl-0 white" @click="nextPage()">
			<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
			Tillbaka
		</v-btn>
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
				<div :id="seats" class="seat-availability" @click="setClicked">
					<span>{{ seats + 1 }}</span>
				</div>
				<!-- <v-icon :id="seats" v-model="specificSeat" :color="isClicked?'red':'green'" @click="setClicked">{{ icon.name }}</v-icon> -->
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
		isClicked: false,
		nrOfTickets: 3,
		chosenSeats: []
		// icon: {
		// 	name: 'mdi-checkbox-blank-circle-outline',
		// 	color: 'green'
		// },
		// colors: {
		// 	green: 'green',
		// 	red: 'red'
		// }
	}),
	created() {
		vue.nextTick(this.fillSeatArr());
	},
	methods: {
		nextPage() {
			this.$router.push('/departures');
		},
		fillSeatArr() {
			for(let i=0; i<40; i++) {
				this.nrOfSeats.push(i);
			}
		},
		setClicked(event) {
			let seatID = event.currentTarget.id;
			let seatToChange = document.getElementById(`${seatID}`);

			// if(!this.isClicked) {
			// 	this.isClicked = true;
			// 	seatToChange.style.backgroundColor = 'red';
			// } else {
			// 	this.isClicked = false;
			// 	seatToChange.style.backgroundColor = 'green';
			// }
			if(this.chosenSeats.indexOf(seatID) === -1) {
				if(this.chosenSeats.length < this.nrOfTickets) {
					seatToChange.style.backgroundColor = 'red';
					this.chosenSeats.push(seatID);
				} else {
					confirm(`Du kan bara välja ${this.nrOfTickets}`);
				} 
			} else {
				seatToChange.style.backgroundColor = 'green';
				this.chosenSeats.splice(this.chosenSeats.indexOf(seatID), 1);
			}
	
			console.log(this.chosenSeats);
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
	column-gap: 25px;
	row-gap: 25px;
	justify-content: center;
}
.seat-booking {
	width: fit-content;
	height: fit-content;
}
.seats {
	cursor: pointer;
}
.seat-availability {
	display: flex;
	justify-content: center;
	background-color: green;
	min-width: 35px;
	border: 1px solid rgb(107, 107, 107);
	border-bottom-right-radius: 40%;
	border-bottom-left-radius: 40%;
}
.seat-availability > span {
	color: white;
}
</style>