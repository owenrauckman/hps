import * as types from '@/store/mutationTypes';
import config from '@/config/';

const state = {
  filtersVisible: false,
  loadingResults: false,
  results: [],
  isResults: true,
  hideBasicCards: true, // todo turn to toggle
  filterQueries: config.defaultFilterQueries,
  filterTabs: config.defaultFilterTabs,
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_SEARCH_RESULTS](state, results) {
    state.results = results;
  },
  [types.TOGGLE_SEARCH_FILTERS](state, filtersVisible) {
    state.filtersVisible = filtersVisible;
  },
  [types.SET_SEARCH_QUERY](state, { type, newQuery }) {
    if (type in ['state', 'city', 'company', 'industry']) {
      state.filterQueries[type] = newQuery;
    }
  },
  [types.SET_FILTER_TAB](state, selectedTab) {
    state.filterTabs.forEach((tab) => {
      tab.active = false;
    });
    // todo: double check that this works, probably need to compare whole object
    state[selectedTab].active = true;
  },
  [types.ACTIVATE_CHOSEN_FILTER](state, chosenFilter) {
    state.filterTabs.forEach((tab) => {
      tab.active = false;
    });
    switch (chosenFilter) {
      case 'js__search-tab__state':
        state.filterTabs[0].active = true; break;
      case 'js__search-tab__city':
        state.filterTabs[1].active = true; break;
      case 'js__search-tab__company':
        state.filterTabs[2].active = true; break;
      case 'js__search-tab__industry':
        state.filterTabs[3].active = true; break;
      default:
        state.filterTabs[0].active = true;
    }
  },
  [types.SET_LOADING_STATE](state, loadingResults) {
    state.loadingResults = loadingResults;
  },
  [types.SET_RESULTS_STATUS](state, isResults) {
    state.isResults = isResults;
  },
  [types.HIDE_BASIC_CARDS](state, hideBasicCards) {
    state.hideBasicCards = hideBasicCards;
  },
};

const getters = {
  filtersVisible: state => state.filtersVisible,
  loadingResults: state => state.loadingResults,
  results: state => state.results,
  isResults: state => state.isResults,
  hideBasicCards: state => state.hideBasicCards,
  filterQueries: state => state.filterQueries,
  filterTabs: state => state.filterTabs,
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
};
