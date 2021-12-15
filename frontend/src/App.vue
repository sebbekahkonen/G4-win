<template>
	<v-app>
		<div>
			<v-toolbar
				dark
				prominent
				src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
			>
				<v-app-bar-nav-icon @click="drawer = true" />
				<v-toolbar-title class="flex text-center mb-5"><h1>G4Win</h1></v-toolbar-title>
			</v-toolbar>
			<v-navigation-drawer
				v-model="drawer"
				absolute
				temporary
			>
				<v-list
					nav
					dense
				>
					<v-list-item-group
						v-model="group"
						active-class="deep-purple--text text--accent-4"
					>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-home</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Home</v-list-item-title>
						</v-list-item>

						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-account</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Account</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-navigation-drawer>
		</div>

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
		drawer: false,
		group: null
	})
};
</script>
