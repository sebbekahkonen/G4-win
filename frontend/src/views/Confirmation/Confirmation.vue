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
							v-model="from"
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
							v-model="to"
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
						value="10.00"
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
						value="example"
						suffix="@gmail.com"
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
						value="2021-12-14"
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
export default {
	data: () => ({
		from: 'Gothenburg',
		to: 'Stockholm'
	})
};
</script>