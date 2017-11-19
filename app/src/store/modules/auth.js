import * as types from '@/store/mutationTypes';
import config from '@/config';
import axios from 'axios';

const state = {
  authStatus: false,
  editProgressBar: 0,
  possibleCities: [],
  editInfo: {
    states: [],
    cities: [],
    selectedState: '',
  },
  user: {},
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_EDIT_INFO](state, info) {
    switch (info.type) {
      case 'STATES':
        state.editInfo.states = info.value; break;
      case 'CITIES':
        state.editInfo.cities = info.value; break;
      case 'SELECTED_STATE':
        state.editInfo.selectedState = info.value; break;
      default:
        break;
    }
  },
  [types.UPDATE_AUTH_STATUS](state, authStatus) {
    state.authStatus = authStatus;
  },
  [types.SET_USER_DATA](state, user) {
    state.user = user;
  },

  // UPDATE PROFILE INFORMATION
  [types.UPDATE_USER_DATA](state, data) {
    state.user = data;
  },

  // PROGRESS BAR
  [types.UPDATE_EDIT_PROGRESS_BAR](state, data) {
    state.editProgressBar = data;
  },
};

const actions = {
  /*
    Check if the user is authenticated before displaying the data (checks on server)
  */
  checkAuth({ commit }) {
    return new Promise((resolve) => {
      axios.get(`${config.api}/users/dashboard`, { withCredentials: true })
        .then((response) => {
          if (response.data.status) {
            commit(types.UPDATE_AUTH_STATUS, true);
            commit(types.SET_USER_DATA, response.data.user);
            resolve({ status: true, data: response.data.user });
          } else {
            commit(types.UPDATE_AUTH_STATUS, false);
            resolve({ status: false, data: null });
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error);
          }
        });
    });
  },

  /*
    Login a user and update their auth status
    @param { credentials } an object containing the username and passowrd
  */
  loginUser({ commit }, credentials) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/login`, credentials, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            commit(types.UPDATE_AUTH_STATUS, true);
            resolve({ status: true, showError: false, errorMessage: '' });
          } else {
            commit(types.UPDATE_AUTH_STATUS, false);
            resolve({ status: false, showError: true, errorMessage: response.data.message });
          }
        })
        .catch((error) => {
          if (error) {
            commit(types.UPDATE_AUTH_STATUS, false);
            throw new Error(error);
          }
        });
    });
  },

  /*
    Logs out a user and returns whether it was successful or not
  */
  logoutUser({ commit }) {
    return new Promise((resolve) => {
      axios.get(`${config.api}/users/logout`, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            commit(types.UPDATE_AUTH_STATUS, false);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error);
          }
        });
    });
  },

  /*
    Sends a reset password link to a given email
  */
  sendResetPasswordLink({ state }, emailAddress) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/forgotPassword`, { emailAddress }, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            resolve({ showError: false, showCheckEmailMessage: true });
          } else {
            resolve({ showError: true, showCheckEmailMessage: false });
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error);
          }
        });
    });
  },

  /*
    Resets a users password if they have a token
    @param { credentials } - Contains the token from the emailed link and the new password
  */
  resetPassword({ state }, credentials) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/resetPassword`, credentials, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            resolve({ status: true, showError: false });
          } else {
            resolve({ status: false, showError: true });
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error);
          }
        });
    });
  },

  /*
    Replaces the global user object and hits the API to update a users profile information
    @param { user } - A new user object to replace the current one
  */
  updateUser({ state, commit }, user) {
    return new Promise((resolve, reject) => {
      axios.put(`${config.api}/users/edit/${user.username}`, user, { withCredentials: true })
      .then((response) => {
        if (response.data.success === true) {
          commit(types.UPDATE_USER_DATA, user);
          resolve({ status: true, message: 'Profile Saved Successfully' });
        } else {
          reject({ status: false, message: response.data.message });
        }
      }).catch((error) => {
        throw new Error(error);
      });
    });
  },

  /*
    Hits the delete route for a user
  */
  deleteUser() {
    return new Promise((resolve, reject) => {
      axios.delete(`${config.api}/users/delete`, { withCredentials: true })
      .then((response) => {
        if (response.data.success === true) {
          resolve({ status: true, message: 'Your account has been deleted.' });
        } else {
          reject({ status: false, message: response.data.message });
        }
      }).catch((error) => {
        throw new Error(error);
      });
    });
  },

  /*
    Generates the two lists of locations based on the user's data
  */
  generateLocations({ state }) {
    /* only generate from the user object if this doesn't exist locally */
    if (state.editInfo.states.length === 0) {
      state.user.company.areasServed.forEach((area) => {
        state.editInfo.states.push(area.state);
      });
    }
  },
  /*
    Generates a list of cities for a user's chosen states
  */
  generateAccountCities({ state, commit }) {
    // const possibleCities = [];
    // THE SAME AS ABOVE, CHECKING IF THE CITIES EXIST //
    state.user.company.areasServed.forEach((area) => {
      area.cities.forEach((city) => {
        state.editInfo.cities.push(city.city);
      });
    });

    // OTHER STUFF
    const generateCities = new Promise((resolve) => {
      state.editInfo.states.forEach((selectedState) => {
        /* if its an object (aka a new value), grab the state value */
        let stateToSearch;
        if (typeof (selectedState) === 'object') {
          stateToSearch = selectedState.value;
        } else {
          stateToSearch = selectedState;
        }
        axios.get(`${config.api}/search/cities?state=${stateToSearch}`).then((response) => {
          /* add a new city */
          state.possibleCities.push({
            abbr: stateToSearch,
            cities: response.data,
            // name: '', // todo add the pretty name for the city (maybe just a json file)
          });
        });
      });
      resolve();
    });

    generateCities.then(() => {
      // set the default selected state (first one)
      console.log('sdoifjsdfj');
      console.log(state.possibleCities[0]);
      commit(types.UPDATE_EDIT_INFO, { type: 'SELECTED_STATE', value: state.possibleCities[0].abbr });
    });
  },

};

const getters = {
  authStatus: state => state.authStatus,
  user: state => state.user,
  editInfo: state => state.editInfo,
  editProgressBar: state => state.editProgressBar,
  editPossibleCities: state => state.possibleCities,
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
  actions,
};
