import * as types from '@/store/mutationTypes'
import config from '@/config'
import axios from 'axios'

export const state = {
  authStatus: false,
  editProgressBar: 0,
  possibleEditStates: [],
  possibleEditCities: [],
  editInfo: {
    states: [],
    cities: [],
    selectedState: '',
    subscriptionDetails: {
      basic: 0,
      pro: 0,
      premium: 0
    }
  },
  user: {}
}

/* eslint-disable no-shadow, no-param-reassign */
export const mutations = {
  [types.UPDATE_EDIT_INFO] (state, info) {
    switch (info.type) {
      case 'STATES':
        state.editInfo.states = info.value; break
      case 'CITIES':
        state.editInfo.cities = info.value; break
      case 'SELECTED_STATE':
        state.editInfo.selectedState = info.value; break
      case 'SUBSCRIPTION_DETAILS':
        state.editInfo.subscriptionDetails = {
          basic: info.value.basic,
          pro: info.value.pro,
          premium: info.value.premium
        }
        break
      default:
        break
    }
  },
  [types.UPDATE_AUTH_STATUS] (state, authStatus) {
    state.authStatus = authStatus
  },
  [types.SET_USER_DATA] (state, user) {
    state.user = user
  },
  [types.UPDATE_EDIT_STATES] (state, states) {
    state.possibleEditStates = states
  },

  // UPDATE PROFILE INFORMATION
  [types.UPDATE_USER_DATA] (state, data) {
    state.user = data
  },
  [types.UPDATE_USER_AREAS] (state, data) {
    state.user.company.areasServed = data
  },

  // PROGRESS BAR
  [types.UPDATE_EDIT_PROGRESS_BAR] (state, data) {
    state.editProgressBar = data
  }
}

export const actions = {
  /*
    Check if the user is authenticated before displaying the data (checks on server)
  */
  checkAuth ({ commit }) {
    return new Promise((resolve) => {
      axios.get(`${config.api}/users/dashboard`, { withCredentials: true })
        .then((response) => {
          if (response.data.status) {
            commit(types.UPDATE_AUTH_STATUS, true)
            commit(types.SET_USER_DATA, response.data.user)
            resolve({ status: true, data: response.data.user })
          } else {
            commit(types.UPDATE_AUTH_STATUS, false)
            resolve({ status: false, data: null })
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error)
          }
        })
    })
  },

  /*
    Login a user and update their auth status
    @param { credentials } an object containing the username and passowrd
  */
  loginUser ({ commit }, credentials) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/login`, credentials, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            commit(types.UPDATE_AUTH_STATUS, true)
            resolve({ status: true, showError: false, errorMessage: '' })
          } else {
            commit(types.UPDATE_AUTH_STATUS, false)
            resolve({ status: false, showError: true, errorMessage: response.data.message })
          }
        })
        .catch((error) => {
          if (error) {
            commit(types.UPDATE_AUTH_STATUS, false)
            throw new Error(error)
          }
        })
    })
  },

  /*
    Logs out a user and returns whether it was successful or not
  */
  logoutUser ({ commit }) {
    return new Promise((resolve) => {
      axios.get(`${config.api}/users/logout`, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            commit(types.UPDATE_AUTH_STATUS, false)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error)
          }
        })
    })
  },

  /*
    Sends a reset password link to a given email
  */
  sendResetPasswordLink ({ state }, emailAddress) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/forgotPassword`, { emailAddress }, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            resolve({ showError: false, showCheckEmailMessage: true })
          } else {
            resolve({ showError: true, showCheckEmailMessage: false })
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error)
          }
        })
    })
  },

  /*
    Resets a users password if they have a token
    @param { credentials } - Contains the token from the emailed link and the new password
  */
  resetPassword ({ state }, credentials) {
    return new Promise((resolve) => {
      axios.post(`${config.api}/users/resetPassword`, credentials, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            resolve({ status: true, showError: false })
          } else {
            resolve({ status: false, showError: true })
          }
        })
        .catch((error) => {
          if (error) {
            throw new Error(error)
          }
        })
    })
  },

  /*
    Replaces the global user object and hits the API to update a users profile information
    @param { user } - A new user object to replace the current one
  */
  updateUser ({ state, commit }, user) {
    return new Promise((resolve, reject) => {
      axios.put(`${config.api}/users/edit/${user.username}`, user, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            commit(types.UPDATE_USER_DATA, user)
            resolve({ status: true, message: 'Profile Saved Successfully' })
          } else {
            throw new Error({ status: false, message: response.data.message })
          }
        }).catch((error) => {
          throw new Error(error)
        })
    })
  },

  /*
    Hits the delete route for a user
  */
  deleteUser () {
    return new Promise((resolve, reject) => {
      axios.delete(`${config.api}/users/delete`, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            resolve({ status: true, message: 'Your account has been deleted.' })
          } else {
            throw new Error({ status: false, message: response.data.message })
          }
        }).catch((error) => {
          throw new Error(error)
        })
    })
  },

  /*
    Fetches a list of states for the sign up process
  */
  fetchEditStates ({ commit }) {
    axios.get(`${config.api}/search/states`).then((response) => {
      commit(types.UPDATE_EDIT_STATES, response.data)
    }).catch((err) => {
      throw new Error(`${err}: Something went wrong, add flash message`)
    })
  },

  /*
    Generates the two lists of locations based on the user's data
  */
  generateLocations ({ state }) {
    /* only generate from the user object if this doesn't exist locally */
    if (state.editInfo.states.length === 0) {
      state.user.company.areasServed.forEach((area) => {
        state.editInfo.states.push(area.state)
      })
    }
  },
  /*
    Generates a list of cities for a user's chosen states
  */
  // todo go through and create COMMITS for any of the direct stte mutations
  generateAccountCities ({ state, commit }) {
    const cityPromises = []
    state.editInfo.states.forEach((stateToSearch) => {
      const cityPromise = new Promise((resolve) => {
        axios.get(`${config.api}/search/cities?state=${stateToSearch}`).then((response) => {
          // before resolving, add the associated state with the city
          const cities = []
          response.data.forEach((city) => {
            cities.push({
              state: stateToSearch,
              city
            })
          })
          resolve({
            abbr: stateToSearch,
            cities
          })
        })
      })
      cityPromises.push(cityPromise)
    })

    // Once all of the cities have been updated proceed
    // TODO: once this is fixed add CATCH and err handling...
    Promise.all(cityPromises).then((data) => {
      // set the possible state
      state.possibleEditCities = data

      // set the first state as default selected
      commit(types.UPDATE_EDIT_INFO, { type: 'SELECTED_STATE', value: state.possibleEditCities[0].abbr })

      // and also set the current selected states for a user based on their obj...
      // TODO: think about associating premium for state AND city like before you get to prem page
      const selectedCities = []
      state.user.company.areasServed.forEach((area) => {
        area.cities.forEach((city) => {
          // selectedCities.push(city.city);
          selectedCities.push({
            state: area.state,
            city: city.city
          })
        })
      })
      state.editInfo.cities = selectedCities
    })
  },

  /*
    PUT to update a user's subscriptons/areas served
  */

  // TODO: so i'm here... I need to post to server (includ approp subscription items)
  // and route appropriateley based on them. Add flash messages, etc..
  // add express method in models, and a route to handle this before actually executing.
  // @param subs cription details -- fill this in later
  updateSubscriptions ({ state }) {
    return new Promise((resolve) => {
      axios.put(`${config.api}/users/updateSubscriptions`,
        { areasServed: state.user.company.areasServed,
          subscriptionDetails: state.editInfo.subscriptionDetails })
        .then((response) => {
          if (response.data.success === true) {
            // set in the local state too...
            state.user.subscriptionItems = response.data.data
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          throw new Error(`${err}: Something went wrong, add flash message`)
        })
    })
  }

}

export const getters = {
  authStatus: state => state.authStatus,
  user: state => state.user,
  editInfo: state => state.editInfo,
  editProgressBar: state => state.editProgressBar,
  possibleEditStates: state => state.possibleEditStates,
  possibleEditCities: state => state.possibleEditCities,
  userCurrentFee: (state) => {
    let total = 0
    if (state.user.subscriptionItems) {
      state.user.subscriptionItems.forEach((subItem) => {
        if (subItem.plan.id === 'pro') {
          total += (config.cityPrice * subItem.quantity)
        }
        if (subItem.plan.id === 'premium') {
          total += (config.statePrice * subItem.quantity)
        }
      })
    }
    return total
  }

}
/* eslint-enable */
