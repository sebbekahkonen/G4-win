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
						active-class="blue--text text--accent-4"
					>
						<v-list-item @click="homePage">
							<v-list-item-icon>
								<v-icon>mdi-home</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Home</v-list-item-title>
						</v-list-item>

						<v-list-item @click="searchTicket">
							<v-list-item-icon>
								<v-icon>mdi-ticket-confirmation-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Tickets</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-navigation-drawer>
		</div>

		<v-main>
			<router-view />
		</v-main>
		<v-footer padless class="mt-4">
			<v-card
				flat
				tile
				class="blue darken-3 white--text text-center"
				min-width="100%"
			>
				<v-card-text>
					<v-btn
						v-for="icon in icons"
						:key="icon"
						class="mx-4 white--text"
						icon
					>
						<v-icon size="24px">
							{{ icon }}
						</v-icon>
					</v-btn>
				</v-card-text>

				<v-card-text class="grey--text text--lighten-1 pt-0">
					Följ oss på våra sociala medier
				</v-card-text>

				<v-divider class="blue-grey lighten-1" />

				<v-card-text class="white--text">
					&copy;<strong>G4Win</strong> - {{ new Date().getFullYear() }}
				</v-card-text>
			</v-card>
		</v-footer>
	</v-app>
</template>

<script>

export default {
	name: 'App',

	components: {
	},

	data: () => ({
		drawer: false,
		group: null,
		icons: [
			'mdi-facebook',
			'mdi-twitter',
			'mdi-linkedin',
			'mdi-instagram'
		]
	}),
	methods: {
		homePage() {
			this.$router.push('/');
		},
		searchTicket() {
			this.$router.push('ticket');
		}
	}
};
</script>
<style>
.theme--dark.v-footer {
	background-color: rgb(19, 37, 201);
}
</style>
