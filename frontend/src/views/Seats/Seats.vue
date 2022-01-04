<template>
	<v-container>
		<v-btn depressed small class="mb-4 pl-0 white" @click="returnPage">
			<v-icon>{{ 'mdi-chevron-left' }}</v-icon>
			Tillbaka
		</v-btn>
		<v-row>
			<v-col align="center">
				<!-- Från: {{ travelObj.departure.departureDestination }} -->
				Från: Göteborg
			</v-col>
			<v-col align="center">
				<!-- Till: {{ travelObj.departure.arrivalDestination }} -->
				Mellanstation: Jönköping
			</v-col>
			<v-col align="center">
				<!-- Till: {{ travelObj.departure.arrivalDestination }} -->
				Till: Stockholm
			</v-col>
		</v-row>
		<v-col align="center">
			<!-- Valt datum: {{ date }} -->
			Valt datum: 2022-01-01
		</v-col>
		<v-card outlined align="center">
			<v-icon left large @click="decreaseWagons">{{ 'mdi-chevron-left' }}</v-icon>
			<v-btn v-if="noOfWagons === 3" id="custom-disabled" text disabled>{{ 'BISTRO' }}</v-btn>
			<v-btn v-else id="custom-disabled" text disabled>{{ 'Vagn ' + noOfWagons }}</v-btn>
			<v-icon right large @click="increaseWagons">{{ 'mdi-chevron-right' }}</v-icon>
		</v-card>
		<div>
			<div v-if="noOfWagons === 3" class="bistro">
				<div class="bistro-seats" />
				<div class="bistro-seats" />
				<div class="bistro-seats" />
				<div class="bistro-seats" />
				<div class="shop">
					<v-icon align="center" large>{{ 'mdi-silverware-variant' }}</v-icon>
				</div>
				<div />
				<div class="bistro-seats" />
				<div class="bistro-seats" />
				<div class="toilets">
					<div class="wc">
						WC
						<v-icon color="black">{{ 'mdi-wheelchair-accessibility' }}</v-icon>
					</div>
				</div>
				<div class="toilets">
					<div class="wc">
						WC
						<v-icon color="black">{{ 'mdi-wheelchair-accessibility' }}</v-icon>
					</div>
				</div>
			</div>
			<div v-else class="seat-container">
				<div v-for="seats in nrOfSeats" :key="seats" class="seat-booking">	
					<div class="seat-booking">
						<div :id="seats" class="seat-availability" @click="setClicked">
							<span>{{ seats + 1 }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="popup-modal" class="modal">
			<div class="modal-content">
				<p>Du kan bara välja {{ nrOfTickets }} platser.</p>
				<v-btn id="close-modal" depressed class="mb-4" color="primary" @click="testClick">
					Stäng
					<v-icon class="ml-2">{{ 'mdi-close-circle' }}</v-icon>
				</v-btn>
			</div>
		</div>
		<v-btn :disabled="btnDisable" class="blue darken-1 white--text mt-4" small depressed block
			@click="nextPage"
		>
			Fortsätt <v-icon right>{{ 'mdi-chevron-right' }}</v-icon>
		</v-btn>
	</v-container>
</template>
<script>
import vue from 'vue';
import { mapState } from 'vuex';
export default {
	data: () =>  ({
		noOfWagons: 1,
		nrOfSeats: [],
		isClicked: false,
		nrOfTickets: 3,
		chosenSeats: [],
		btnDisable : true
	}),
	computed: {
		...mapState('travelStore', ['travelObj', 'date'])
	},
	created() {
		vue.nextTick(this.fillSeatArr());
	},	
	methods: {
		testClick() {
			document.getElementById('popup-modal').style.display = 'none';
		},
		returnPage() {
			this.$router.push('/departures');
		},
		nextPage() {
			this.$router.push('/payment');
		},
		fillSeatArr() {
			for(let i=0; i<40; i++) {
				this.nrOfSeats.push(i);
			}
		},
		setClicked(event) {
			let seatID = event.currentTarget.id;
			let seatToChange = document.getElementById(`${seatID}`);

			if(this.chosenSeats.indexOf(seatID) === -1) {

				if(this.chosenSeats.length < this.nrOfTickets) {
					seatToChange.style.backgroundColor = 'red';
					this.chosenSeats.push(seatID);
				} else {
					let modal = document.getElementById('popup-modal');

					modal.style.display = 'block';

					window.onclick = (e) => {
						if(e.target == modal) {
							modal.style.display = 'none';
							console.log('Clicked!');
						}
					};
				} 
			} else {
				seatToChange.style.backgroundColor = 'green';
				this.chosenSeats.splice(this.chosenSeats.indexOf(seatID), 1);
			}

			if(this.chosenSeats.length < this.nrOfTickets) {
				this.btnDisable = true;
			} else {
				console.log(this.chosenSeats.length);
				this.btnDisable = false;
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
.bistro {
	margin-top: 20px;
	display: grid;
	grid-template-columns: 30px 30px;
	grid-template-rows: 40px 40px 60px 40px 40px 7px;
	column-gap: 50px;
	row-gap: 50px;
	justify-content: center;
}
.bistro-seats {
	display: flex;
	justify-content: center;
	/* background: repeating-linear-gradient(-45deg, #ffffff 5px, #ffffff 10px, #ffffff 11px, #000000 10px, #000000 15px); */
	background: linear-gradient(-45deg, rgba(30,136,229, 0.1), rgb(30,136,229));
	min-height: 60px;
	border: 1px solid rgb(70, 70, 70);
	border-radius: 10%;
}
.shop {
	display: flex;
	justify-content: center;
	min-height: 80px;
	min-width: 40px;
	background-color: rgba(30,136,229, 0.3);
	border: 1px solid rgb(70,70,70);
}
.toilets {
	display: block;
	justify-content: center;
	background: linear-gradient(-45deg, rgba(30,136,229, 0.1), rgb(30,136,229));
	min-height: 60px;
	border: 1px solid rgb(70, 70, 70);
	border-radius: 10%;
	min-width: 40px;
}
.wc {
	text-align: center;
	font-style: oblique;
	font-weight: bold;

}
.modal {
	display: none;
	position: fixed;
	left: 0;
	top: 50%;
	z-index: 1;
	width: 100%;
	height: 25%;
	overflow: auto;
	background-color: rgba(25,118,210, 0.8);
}
.modal-content {
	text-align: center;
	background-color: rgb(238, 238, 238);
	margin: 8% auto;
	border: 1px solid rgba(25,118,210, 1.0);
	width: 80%;
}
.modal-content > p {
	margin-top: 15px;
	font-size: 18px;
}
</style>