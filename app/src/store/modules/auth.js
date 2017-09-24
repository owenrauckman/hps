import * as types from '@/store/mutationTypes';

const state = {
  isLoggedIn: false,
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.SET_LOGGED_IN](state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
  },
};

const getters = {
  isLoggedIn: state => state.isLoggedIn,
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
};
