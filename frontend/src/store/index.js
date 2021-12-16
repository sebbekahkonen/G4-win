import Vue from 'vue';
import Vuex from 'vuex';

import bookingStore from './modules/bookingStore.js';
import departureStore from './modules/departureStore.js';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		bookingStore,
		departureStore
	},
	plugins: [

	]
});