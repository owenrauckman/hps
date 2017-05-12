import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    filtersVisible: false,
    results: [],
  },
  mutations: {
    /* eslint-disable */
    toggleFilters(state, filtersVisible) {
      state.filtersVisible = filtersVisible;
    },
    updateResults(state, results){
      state.results = results;
    }
    /* eslint-enable */
  },
});
