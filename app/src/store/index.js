import Vue from 'vue';
import Vuex from 'vuex';
// import createPersist from 'vuex-localstorage';

/* import modules */
import search from '@/store/modules/search';
import create from '@/store/modules/create';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    search,
    create,
  },
  // plugins: [createPersist({
  //   namespace: 'namespace-for-state',
  //   initialState: {},
  //   expires: 5 * 60 * 1e3, // 5min
  // })],
});
