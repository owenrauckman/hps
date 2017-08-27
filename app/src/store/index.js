import Vue from 'vue';
import Vuex from 'vuex';
import createPersist from 'vuex-localstorage';

const config = require('../../config/appConfig.json');

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    menuType: 'transparent',
    filtersVisible: false,
    loadingResults: false,
    results: [],
    isResults: true,
    isResultsError: false,
    hideBasicCards: true,
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
      states: [],
      cities: [],
      totalPrice: 0,
      firstName: '',
      lastName: '',
      emailAddress: '',
      username: '',
      password: '',
      phoneNumber: '',
      profilePicture: config.defaultProfileImage,
      basicPlans: 0,
      proPlans: 0,
      premiumPlans: 0,
      company: {
        name: '',
        aboutCompany: '',
        aboutMe: '',
        areasServed: [],
        links: {
          website: '',
          facebook: '',
          twitter: '',
          instagram: '',
          pinterest: '',
          youtube: '',
        },
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
    },
    updateLoadingResults(state, loadingResults){
      state.loadingResults = loadingResults;
    },
    /* -- END HOME PAGE MUTATIONS -- */

    /* -- BASIC INFO SIGN UP -- */
    updateSignUpInfo(state, signUpInfo){
      //does nothing, just updates store
    },

    /* -- STATES SIGN UP -- */
    updateStates(state, selectedStates){
      state.signUpInfo.states = selectedStates;
    },

    /* -- COMPANY SIGN UP -- */
    updateSignUpInfoCompany(state, company){
      state.signUpInfo.company.name = company;
    },

    /* eslint-enable */
  },
  plugins: [createPersist({
    namespace: 'namespace-for-state',
    initialState: {},
    expires: 5 * 60 * 1e3, //5min
  })],
});
