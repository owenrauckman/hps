import * as types from '@/store/mutationTypes';
import config from '@/config';
import axios from 'axios';

const state = {
  loadingResults: false,
  results: {},
  isResults: true,
  hideBasicCards: true, // todo turn to toggle
  searchQuery: {
    state: '',
    city: '',
    companyIndustry: null,
  },
  states: [],
  cities: [],
  companyIndustries: [],
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_SEARCH_QUERY](state, query) {
    switch (query) {
      case 'STATE':
        state.searchQuery.state = query; break;
      case 'CITY':
        state.searchQuery.city = query; break;
      case 'COMPANY_INDUSTRY':
        state.searchQuery.companyIndustry = query; break;
      default:
        break;
    }
  },
  [types.UPDATE_STATES](state, states) {
    state.states = states;
  },
  [types.UPDATE_CITIES](state, cities) {
    state.cities = cities;
  },
  [types.UPDATE_SEARCH_RESULTS](state, results) {
    state.results = results;
  },
};

const actions = {
  fetchStates({ commit, dispatch }) {
    axios.get(`${config.api}/search/states`).then((response) => {
      commit(types.UPDATE_STATES, response.data);
      dispatch('fetchCities');
    }).catch((err) => {
      console.log(`${err}: Something went wrong, add flash message`);
    });
  },
  fetchCities({ commit, state }) {
    axios.get(`${config.api}/search/cities?state=${state.searchQuery.state}`).then((response) => {
      commit(types.UPDATE_CITIES, response.data);
    }).catch((err) => {
      console.log(`${err}: Something went wrong, add flash message`);
    });
  },
  // todo fetch company and industry

  performSearch({ commit, state }) {
    state.hideBasicCards = true;
    state.results = [];
    state.loadingResults = true;
    state.isResults = false;
    axios.get(`${config.api}/search` +
      `?state=${encodeURIComponent(state.searchQuery.state)}` +
      `&city=${encodeURIComponent(state.searchQuery.city)}` +
      `&company=${encodeURIComponent('')}` +
      `&industry=${encodeURIComponent('')}`).then((users) => {
        /* check if there are users returned */
        if (users.users && (users.users.premiumStates.length > 0 ||
           users.users.premiumCities.length > 0 ||
           users.users.basic.length > 0)) {
          state.isResults = true;
        }
        state.loadingResults = false;
        commit(types.UPDATE_SEARCH_RESULTS, users);
      });
  },

  // premium search todo nice comments
  premiumSearch({ commit, state }) {
    state.hideBasicCards = true;
    state.results = [];
    state.loadingResults = true;
    state.isResults = false;
    axios.get(`${config.api}/search/premium`).then((users) => {
      /* check if there are users returned */
      if (users.users) {
        state.isResults = true;
      }
      state.loadingResults = false;
      commit(types.UPDATE_SEARCH_RESULTS, users);
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
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
  actions,
};
