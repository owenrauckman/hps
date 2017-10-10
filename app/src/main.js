// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import Vue2Filters from 'vue2-filters';
import VeeValidate from 'vee-validate';
import VueConfig from 'vue-config';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router';
import store from './store';
import config from './config/';

/* allows for use of fetch in IE and Safari todo remove this after switch to axios */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const VueScrollTo = require('vue-scrollto');

/* init config files */
const configs = {
  default: config,
};

Vue.use(Vue2Filters);
Vue.use(VueScrollTo);
Vue.use(VeeValidate);
Vue.use(VueAxios, axios);
Vue.use(VueConfig, configs);
Vue.use(Vuetify);
import('../node_modules/vuetify/dist/vuetify.min.css');


Vue.config.productionTip = false; // todo make this env aware

/* eslint-disable no-new */
new Vue({
  store,
  config,
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
