import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    menuType: 'transparent',
    filtersVisible: false,
    loadingResults: false,
    results: [],
    isResults: true,
    isResultsError: false,
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
    filterTabs: [
      { name: 'state', active: true },
      { name: 'city', active: false },
      { name: 'company', active: false },
      { name: 'industry', active: false },
    ],
    signUpInfo: {
      company: '',
      states: [],
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
    },
    updateLoadingResults(state, loadingResults){
      state.loadingResults = loadingResults;
    },
    /* -- END HOME PAGE MUTATIONS -- */
    updateSignUpInfoCompany(state, company){
      state.signUpInfo.company = company;
    },

    /* eslint-enable */
  },
});
