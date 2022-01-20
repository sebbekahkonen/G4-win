import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import departureStore from './modules/departureStore.js';
import ticketStore from './modules/ticketStore.js';
import travelStore from './modules/travelStore.js';
import receiptStore from './modules/receiptStore.js';


Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		departureStore,
		ticketStore,
		travelStore,
		receiptStore
	},
	plugins: [
		createPersistedState({
			paths: ['travelStore', 'ticketStore', 'receiptStore']
		})
	]
});