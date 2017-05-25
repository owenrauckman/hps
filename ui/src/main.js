// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vue2Filters from 'vue2-filters';
import App from './App';
import router from './router';
import store from './store';

const VueScrollTo = require('vue-scrollto');

Vue.use(Vue2Filters);
Vue.use(VueScrollTo);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
