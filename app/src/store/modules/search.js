import * as types from '@/store/mutationTypes';
import config from '@/config';
import axios from 'axios';

const state = {
  loadingResults: false,
  results: {},
  isResults: false,
  hideBasicCards: true,
  searchQuery: {
    state: null,
    city: null,
    companyIndustry: {
      type: null,
      name: null,
    },
  },
  states: [],
  cities: [],
  companyIndustries: [],
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_SEARCH_QUERY](state, query) {
    switch (query.type) {
      case 'STATE':
        state.searchQuery.state = query.value; break;
      case 'CITY':
        state.searchQuery.city = query.value; break;
      case 'COMPANY_INDUSTRY':
        state.searchQuery.companyIndustry = query.value; break;
      default:
        break;
    }
  },
  [types.UPDATE_STATES](state, states) {
    state.states = states;
    state.searchQuery.city = '';
  },
  [types.UPDATE_CITIES](state, cities) {
    state.cities = cities;
  },
  [types.UPDATE_COMPANY_INDUSTRIES](state, companyIndustries) {
    state.companyIndustries = companyIndustries;
  },
  [types.UPDATE_SEARCH_RESULTS](state, results) {
    state.results = results;
  },
};

const actions = {

  /*
    Fetches a list of states from the API. Dispatches fetchCities upon completion.
  */
  fetchStates({ commit, dispatch }) {
    axios.get(`${config.api}/search/states`).then((response) => {
      commit(types.UPDATE_STATES, response.data);
      dispatch('fetchCities');
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`);
    });
  },

  /*
    Given a state, fetches a list of states for that city
  */
  fetchCities({ commit, state }) {
    axios.get(`${config.api}/search/cities?state=${state.searchQuery.state}`).then((response) => {
      commit(types.UPDATE_CITIES, response.data);
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`);
    });
  },

  /*
    Fetches and combines a list of companies and industries from the API
  */
  fetchCompanyIndustry({ commit }) {
    const companyIndustryList = [];
    axios.get(`${config.api}/search/companies`).then((response) => {
      response.data.forEach((company) => {
        companyIndustryList.push({ type: 'COMPANY', name: company });
      });
    }).then(() => {
      axios.get(`${config.api}/search/industries`).then((response) => {
        response.data.forEach((industry) => {
          companyIndustryList.push({ type: 'INDUSTRY', name: industry });
        });
      }).then(() => {
        commit(types.UPDATE_COMPANY_INDUSTRIES, companyIndustryList);
      });
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`);
    });
  },

  /*
    Performs a search based on the parameters from the searchQuery state object.
  */
  performSearch({ commit, state }) {
    state.hideBasicCards = true;
    state.results = [];
    state.loadingResults = true;
    axios.get(`${config.api}/search` +
      `?state=${encodeURIComponent(state.searchQuery.state)}` +
      `&city=${encodeURIComponent(state.searchQuery.city)}` +
      `&company=${encodeURIComponent(state.searchQuery.companyIndustry && state.searchQuery.companyIndustry.type === 'COMPANY' ? state.searchQuery.companyIndustry.name : '')}` +
      `&industry=${encodeURIComponent(state.searchQuery.companyIndustry && state.searchQuery.companyIndustry.type === 'INDUSTRY' ? state.searchQuery.companyIndustry.name : '')}`).then((users) => {
        /* check if there are users returned */
        if (users.data.users === undefined) {
          throw new Error('whoops, no users were returned');
        } else if (users.data.users.premiumStates.length > 0 ||
           users.data.users.premiumCities.length > 0 ||
           users.data.users.basic.length > 0) {
          state.isResults = true;
        }
        state.loadingResults = false;
        commit(types.UPDATE_SEARCH_RESULTS, users);
      }).catch((err) => {
        throw new Error(`${err}: Something went wrong, add flash message`);
      });
  },

  /*
    Default search when a user hits the landing page. A premium serach for 12 random premium users.
  */
  premiumSearch({ commit, state }) {
    state.hideBasicCards = true;
    state.results = [];
    state.loadingResults = true;
    axios.get(`${config.api}/search/premium`).then((users) => {
      /* check if there are users returned */
      if (users.data.users) {
        state.isResults = true;
      }
      state.loadingResults = false;
      commit(types.UPDATE_SEARCH_RESULTS, users);
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`);
    });
  },
};

const getters = {
  loadingResults: state => state.loadingResults,
  results: state => state.results,
  isResults: state => state.isResults,
  hideBasicCards: state => state.hideBasicCards,
  searchQuery: state => state.searchQuery,
  searchQueryState: state => state.searchQuery.state,
  states: state => state.states,
  cities: state => state.cities,
  companyIndustries: state => state.companyIndustries,
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
  actions,
};
