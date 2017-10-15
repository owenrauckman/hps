import * as types from '@/store/mutationTypes';
import config from '@/config';
import axios from 'axios';

const state = {
  progressBar: 25,
  currentFee: 'free',
  companies: [],
  states: [],
  cities: [],
  selectedState: '',
  signUpInfo: {
    company: null,
    states: [],
    cities: [],
  },
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_SIGN_UP_INFO](state, info) {
    switch (info.type) {
      case 'COMPANY':
        state.signUpInfo.company = info.value; break;
      case 'STATES':
        state.signUpInfo.states = info.value; break;
      case 'CITIES':
        state.signUpInfo.cities = info.value; break;
      default:
        break;
    }
  },
  [types.UPDATE_PROGRESS_BAR](state, progressBar) {
    state.progressBar = progressBar;
  },
  [types.UPDATE_COMPANIES](state, companies) {
    state.companies = companies;
  },
  [types.UPDATE_SIGN_UP_CITIES](state, possibleCities) {
    state.cities = possibleCities;
  },
  [types.UPDATE_SIGN_UP_STATES](state, states) {
    state.states = states;
  },
  [types.UPDATE_SIGN_UP_SELECTED_STATE](state, selectedState) {
    state.selectedState = selectedState;
  },
};

const actions = {
  /*
    Fetches a list of companies for the sign up process
  */
  fetchCompanies({ commit }) {
    const companyList = [];
    axios.get(`${config.api}/search/companies`).then((response) => {
      response.data.forEach((company) => {
        companyList.push(company);
      });
      commit(types.UPDATE_COMPANIES, companyList);
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`);
    });
  },
  /*
    Fetches a list of states for the sign up process
  */
  fetchStates({ commit }) {
    axios.get(`${config.api}/search/states`).then((response) => {
      commit(types.UPDATE_SIGN_UP_STATES, response.data);
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`);
    });
  },

  /*
    Generates a list of cities for each selected state
  */
  generateCities({ commit, state }) {
    const possibleCities = [];
    state.signUpInfo.states.forEach((state) => {
      axios.get(`${config.api}/search/cities?state=${state.value}`).then((response) => {
        const stateObj = {
          abbr: state.value,
          name: state.text,
          cities: [],
        };
        response.data.forEach((city) => {
          /* eslint-disable no-param-reassign */
          city = { state: state.value, city };
          stateObj.cities.push(city);
          /* eslint-enable */
        });
        possibleCities.push(stateObj);
      }).catch((err) => {
        throw new Error(`${err}: Something went wrong, add flash message`);
      });
    });
    // Set the default state that will be selected as well
    commit(types.UPDATE_SIGN_UP_SELECTED_STATE, state.signUpInfo.states[0] ? state.signUpInfo.states[0].value : '');
    commit(types.UPDATE_SIGN_UP_CITIES, possibleCities);
  },
};

const getters = {
  progressBar: state => state.progressBar,
  currentFee: state => state.currentFee,
  companies: state => state.companies,
  signUpInfo: state => state.signUpInfo,
  signUpStates: state => state.states,
  signUpCities: state => state.cities,
  signUpSelectedState: state => state.selectedState,
};
/* eslint-enable */

export default {
  state,
  mutations,
  actions,
  getters,
};
