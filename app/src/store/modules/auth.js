import * as types from '@/store/mutationTypes';
import config from '@/config';
import axios from 'axios';

const state = {
  authStatus: false,
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.UPDATE_AUTH_STATUS](state, authStatus) {
    state.authStatus = authStatus;
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

};

const getters = {
  authStatus: state => state.authStatus,
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
  actions,
};
