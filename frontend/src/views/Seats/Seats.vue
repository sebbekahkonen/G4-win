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
		isClicked: false
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
		fillSeatArr() {
			for(let i=0; i<40; i++) {
				this.nrOfSeats.push(i);
			}
		},
		setClicked(event) {
			let seatID = event.currentTarget.id;
			let seatToChange = document.getElementById(`${seatID}`);

			if(!this.isClicked) {
				this.isClicked = true;
				seatToChange.style.backgroundColor = 'red';
			} else {
				this.isClicked = false;
				seatToChange.style.backgroundColor = 'green';
			}	

			console.log(this.isClicked);
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
	column-gap: 15px;
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
.seat-availability {
	display: flex;
	justify-content: center;
	background-color: green;
	min-width: 25px;
	border: 1px solid rgb(107, 107, 107);
	border-bottom-right-radius: 40%;
	border-bottom-left-radius: 40%;
}
.seat-availability > span {
	color: white;
}
</style>