import Vue from 'vue'
import Vuex from 'vuex'
// import createPersist from 'vuex-localstorage';

/* import modules */
import * as search from '@/store/modules/search'
import * as create from '@/store/modules/create'
import * as auth from '@/store/modules/auth'

Vue.use(Vuex)

const createStore = () => new Vuex.Store({
  modules: {
    search,
    create,
    auth
  }
  // plugins: [createPersist({
  //   namespace: 'namespace-for-state',
  //   initialState: {},
  //   expires: 5 * 60 * 1e3, // 5min
  // })],
})

export default createStore
