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
		<v-card align="center">
			<v-icon left large @click="decreaseWagons">{{ 'mdi-chevron-left' }}</v-icon>
			<v-btn id="custom-disabled" text disabled>{{ 'Vagn ' + noOfWagons }}</v-btn>
			<v-icon right large @click="increaseWagons">{{ 'mdi-chevron-right' }}</v-icon>
		</v-card>
	</v-container>
</template>
<script>
export default {
	data: () =>  ({
		noOfWagons: 1
	}),
	methods: {
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
</style>