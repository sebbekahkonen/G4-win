<template>
	<div>
		<v-form>
			<v-container>
				<v-row>
					<v-col
						cols="12"
						sm="6"
					>
						<v-text-field
							v-model="travelObj.departure.departureDestination"
							label="Från:"
							outlined
							readonly
						/>
					</v-col>

					<v-col
						cols="12"
						sm="6"
					>
						<v-text-field
							v-model="travelObj.departure.arrivalDestination"
							label="Till:"
							outlined
							readonly
						/>
					</v-col>
				</v-row>
			</v-container>
		</v-form>

		<v-container>
			<v-row>
				<v-col cols="4">
					<v-subheader>Totala biljettkostnad</v-subheader>
				</v-col>
				<v-col cols="8">
					<v-text-field
						label="Summan"
						:value="getPrice+'kr'"
						suffix="SEK"
						readonly
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4">
					<v-subheader>Suffix for email domain</v-subheader>
				</v-col>
				<v-col cols="8">
					<v-text-field
						label="Email address"
						:value="getTheReceipt.email"
						
						readonly
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4">
					<v-subheader>Valt Datum</v-subheader>
				</v-col>
				<v-col cols="8">
					<v-text-field
						label="Datum"
						:value="formatDate"
						readonly
					/>
				</v-col>
			</v-row>
		
			
			<v-row>
				<v-col cols="4">
					<v-subheader>Avgång</v-subheader>
				</v-col>
				<v-col cols="8">
					<v-text-field
						label="Avgång"
						value="10:00"
						type="time"
						suffix="CET"
						readonly
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4">
					<v-subheader>Ankomst</v-subheader>
				</v-col>
				<v-col cols="8">
					<v-text-field
						label="Ankomst"
						value="13:00"
						type="time"
						suffix="CET"
						readonly
					/>
				</v-col>
			</v-row>
		</v-container>

		<v-textarea align="center"
			background-color="grey lighten-2"
			color="cyan"
			label="Label"
			value="	Ordernummmer: 1234
			Tack för att du valde G4-Win!
			
			Trevlig resa!"
			readonly
		/>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import vue from 'vue';
export default {
	data: () => ({
	}),
	computed: {
		...mapGetters('ticketStore', ['getPrice']),
		...mapGetters('receiptStore', ['getTheReceipt']),
		...mapState('travelStore', ['travelObj', 'date', 'formatDate'])
	},
	created() {
		vue.nextTick(this.getReceipt);
	},
	methods: {
		...mapActions('receiptStore', ['getReceipt'])
	}
};
</script>