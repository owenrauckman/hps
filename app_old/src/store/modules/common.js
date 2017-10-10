import * as types from '@/store/mutationTypes';

const state = {
  transparentMenu: true,
};

/* eslint-disable no-shadow, no-param-reassign */
const mutations = {
  [types.TOGGLE_MENU_TYPE](state, toggle) {
    state.transparentMenu = toggle;
  },
};

const getters = {
  transparentMenu: state => state.transparentMenu,
};
/* eslint-enable */

export default {
  state,
  mutations,
  getters,
};
