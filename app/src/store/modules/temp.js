const state = {
  signUpInfo: {
    states: [],
    cities: [],
    chosenStates: [],
    chosenCities: [],
    totalPrice: 0,
    firstName: '',
    lastName: '',
    emailAddress: '',
    username: '',
    password: '',
    phoneNumber: '',
    profilePicture: '',
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
};

const mutations = {
  /* eslint-disable */

  /* -- HOME PAGE MUTATIONS -- */
  // toggleFilters(state, filtersVisible) {
  //   state.filtersVisible = filtersVisible;
  // },
  // updateResults(state, results){
  //   state.results = results;
  // },
  // updateStateQuery(state, stateQuery){
  //   state.filterQueries.state = stateQuery;
  // },
  // updateCityQuery(state, cityQuery){
  //   state.filterQueries.city = cityQuery;
  // },
  // updateCompanyQuery(state, companyQuery){
  //   state.filterQueries.company = companyQuery;
  // },
  // updateIndustryQuery(state, industryQuery){
  //   state.filterQueries.industry = industryQuery;
  // },
  // updateLoadingResults(state, loadingResults){
  //   state.loadingResults = loadingResults;
  // },
  /* -- END HOME PAGE MUTATIONS -- */

  /* -- BASIC INFO SIGN UP -- */
  updateSignUpInfo(state, signUpInfo){
    //does nothing, just updates store
  },

  /* -- STATES SIGN UP -- */
  updateStates(state, selectedStates){
    state.signUpInfo.states = selectedStates;
  },

  /* -- Cities SIGN UP -- */
  updateCities(state, selectedStates){
    //does nothing, just updates store
  },

  /* -- Additional Info SIGN UP -- */
  updateAdditionalInfo(state, info){
    //does nothing, just updates store
  },

  /* -- COMPANY SIGN UP -- */
  updateSignUpInfoCompany(state, company){
    state.signUpInfo.company.name = company;
  },

  /* -- PREMIUM CITIES SIGN UP -- */
  updatePremiumCities(state, cities){
    state.signUpInfo.chosenCities = cities;
  },

  /* -- PREMIUM STATES SIGN UP -- */
  updatePremiumStates(state, states){
    state.signUpInfo.chosenStates = states;
  },

  /* eslint-enable */
};

export default{
  state,
  mutations,
};
