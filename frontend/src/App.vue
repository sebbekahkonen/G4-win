<template>
	<v-app>
		<div>
			<v-toolbar
				light
				prominent
			>
				<v-app-bar-nav-icon class="hamburgerIcon" @click="drawer = true" />
				<v-toolbar-title class="flex text-center mr-16" @click="$router.push('/')"><v-img width="160" height="115" class="mx-auto" src="@/assets/G4Win-logo.png" /></v-toolbar-title>
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
								<v-icon class="navbuttons">mdi-home</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Home</v-list-item-title>
						</v-list-item>

						<v-list-item @click="searchTicket">
							<v-list-item-icon>
								<v-icon class="navbuttons">mdi-ticket-confirmation-outline</v-icon>
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
.theme--light.v-toolbar {
    background-color: #eeeee4 !important;
	box-shadow:0px 2px 4px -1px rgb(0 0 0 / 10%), 0px 4px 5px 0px rgb(0 0 0 / 7%), 0px 1px 10px 0px rgb(0 0 0 / 6%) !important;
}
/* .theme--light.v-icon {
    color: rgb(0 0 0) !important;
} */
.hamburgerIcon{
 color: rgb(0 0 0) !important;
}
.navbuttons{
	color: black !important;
}
</style>
