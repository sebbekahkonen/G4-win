import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';
import axios from 'axios';
import router from './router';
import VCalendar from 'v-calendar';

Vue.config.productionTip = false;


Vue.use(VCalendar, {
	componentPrefix: 'vc'
});

const httpClient = axios.create({
	withCredentials: false,
	headers: {
		Accept: 'application/xml',
		'Content - Type': 'text / xml'
	}
});

new Vue({
	vuetify,
	router,
	store,
	render: h => h(App)
}).$mount('#app');

Vue.prototype.$http = httpClient;