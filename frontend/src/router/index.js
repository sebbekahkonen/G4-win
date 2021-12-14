import Vue from 'vue';
import VueRouter from 'vue-router';
import Booking from '@/views/Booking/routes.js';
import TestAPI from '@/views/TestAPI/routes.js';

Vue.use(VueRouter);

const routes = [
	...Booking, ...TestAPI
];
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes

});

export default router;
