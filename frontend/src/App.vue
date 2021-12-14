<template>
	<v-app>
		<v-app-bar
			app
			color="grey darken-3"
			dark
			class="elevation-15"
		>
			<h1>G4-Win</h1>
			<v-spacer />
		</v-app-bar>

		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>

export default {
	name: 'App',

	components: {
	},

	data: () => ({
		//
	})
};
</script>
