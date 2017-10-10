import Vue from 'vue';
import Vuex from 'vuex';
import createPersist from 'vuex-localstorage';

/* import modules */
import temp from '@/store/modules/temp'; // todo remove this after refactor
import common from '@/store/modules/common';
import searchStore from '@/store/modules/search';
import authStore from '@/store/modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    temp,
    common,
    searchStore,
    authStore,
  },
  plugins: [createPersist({
    namespace: 'namespace-for-state',
    initialState: {},
    expires: 5 * 60 * 1e3, // 5min
  })],
});
