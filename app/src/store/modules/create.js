import * as types from '@/store/mutationTypes';
import config from '@/config';
import axios from 'axios';

const state = {
  progressBar: 25,
  companies: [],
  states: [],
  cities: [],
  selectedState: '',
  signUpInfo: config.signUpInfo,
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_SIGN_UP_INFO](state, info) {
    switch (info.type) {
      case 'COMPANY_NAME':
        state.signUpInfo.company.name = info.value; break;
      case 'STATES':
        state.signUpInfo.states = info.value; break;
      case 'CITIES':
        state.signUpInfo.cities = info.value; break;
      case 'FIRST_NAME':
        state.signUpInfo.firstName = info.value; break;
      case 'LAST_NAME':
        state.signUpInfo.lastName = info.value; break;
      case 'EMAIL_ADDRESS':
        state.signUpInfo.emailAddress = info.value; break;
      case 'USERNAME':
        state.signUpInfo.username = info.value; break;
      case 'PASSWORD':
        state.signUpInfo.password = info.value; break;
      case 'PHONE_NUMBER':
        state.signUpInfo.phoneNumber = info.value; break;
      case 'PROFILE_PICTURE':
        state.signUpInfo.profilePicture = info.value; break;
      case 'COMPANY_ABOUT_ME':
        state.signUpInfo.company.aboutMe = info.value; break;
      case 'COMPANY_ABOUT_COMPANY':
        state.signUpInfo.company.aboutCompany = info.value; break;
      case 'COMPANY_WEBSITE':
        state.signUpInfo.company.links.website = info.value; break;
      case 'COMPANY_FACEBOOK':
        state.signUpInfo.company.links.facebook = info.value; break;
      case 'COMPANY_TWITTER':
        state.signUpInfo.company.links.twitter = info.value; break;
      case 'COMPANY_INSTAGRAM':
        state.signUpInfo.company.links.instagram = info.value; break;
      case 'COMPANY_PINTEREST':
        state.signUpInfo.company.links.pinterest = info.value; break;
      case 'COMPANY_YOUTUBE':
        state.signUpInfo.company.links.youtube = info.value; break;
      case 'CURRENT_FEE':
        state.signUpInfo.currentFee = info.value; break;
      case 'AREAS_SERVED':
        state.signUpInfo.company.areasServed = info.value; break;
      case 'BASIC_PLANS':
        state.signUpInfo.basicPlans = info.value; break;
      case 'PRO_PLANS':
        state.signUpInfo.proPlans = info.value; break;
      case 'PREMIUM_PLANS':
        state.signUpInfo.premiumPlans = info.value; break;
      case 'STRIPE_TOKEN':
        state.signUpInfo.stripeToken = info.value; break;
      case 'RESET':
        state.signUpInfo = info.value; break;
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

  /*
    Checks to make sure a users username aren't already in use
    @param { username } - Username to check
  */
  isUsernameAvailable({ state }, username) {
    return new Promise((resolve) => {
      axios.get(`${config.api}/users/u/u/${encodeURIComponent(username)}`)
        .then((response) => {
          if (response.data.userExists) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
    });
  },

  /*
    Checks to make sure a users email isn't already in use
    @param { emailAddress } - Email to check
  */
  isEmailAvailable({ state }, emailAddress) {
    return new Promise((resolve) => {
      axios.get(`${config.api}/users/u/e/${encodeURIComponent(emailAddress)}`)
        .then((response) => {
          if (response.data.userExists) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
    });
  },

  /*
    POST to create a user's proflie
  */
  createProfile({ commit }) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/register`, state.signUpInfo)
        .then((response) => {
          if (response.data.success === true) {
            // reset the state back to default values
            commit(types.UPDATE_COMPANIES, { type: 'RESET', value: config.signUpInfo });
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          throw new Error(`${err}: Something went wrong, add flash message`);
        });
    });
  },

};

const getters = {
  progressBar: state => state.progressBar,
  currentFee: state => state.signUpInfo.currentFee,
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
