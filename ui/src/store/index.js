import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    filtersVisible: false,
    results: [],
    filterQueries: {
      state: {
        name: '',
        abbr: '',
        active: false,
      },
      city: {
        name: '',
        active: false,
      },
      company: {
        name: '',
        active: false,
      },
      industry: {
        name: '',
        active: false,
      },
    },
  },
  mutations: {
    /* eslint-disable */

    /* -- HOME PAGE MUTATIONS -- */
    toggleFilters(state, filtersVisible) {
      state.filtersVisible = filtersVisible;
    },
    updateResults(state, results){
      state.results = results;
    },
    updateStateQuery(state, stateQuery){
      state.filterQueries.state = stateQuery;
    },
    updateCityQuery(state, cityQuery){
      state.filterQueries.city = cityQuery;
    },
    updateCompanyQuery(state, companyQuery){
      state.filterQueries.company = companyQuery;
    },
    updateIndustryQuery(state, industryQuery){
      state.filterQueries.industry = industryQuery;
    }
    /* -- END HOME PAGE MUTATIONS -- */

    /* eslint-enable */
  },
});
