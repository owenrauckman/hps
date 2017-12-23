<template>
  <div>
    <div class="m__create">
      <h1 class="m__create__heading">Cities</h1>
      <div class="m__create__state-container">
        <v-chip v-for="state in possibleEditCities" :key="state" @click="toggleState(state)" :class="[{ 'm__create__chip--active': state.abbr === selectedState }, 'm__create__chip']">
          {{config.states[state.abbr]}}
        </v-chip>
      </div>

      <div v-for="(state, stateIndex) in possibleEditCities" :key="stateIndex">
        <v-select
          v-bind:items="possibleEditCities[stateIndex].cities"
          v-model="selectedCities"
          v-bind:label="`${config.states[state.abbr]} Cities`"
          v-bind:autocomplete="true"
          v-bind:clearable="true"
          v-bind:multiple="true"
          v-bind:chips="true"
          color="indigo darken-2"
          item-text="city"
          return-object
          :class="[{ 'm__create__select--show': state.abbr === selectedState }, 'm__create__select']"
        ></v-select>
      </div>

      <div class="m__create__navigation">
        <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('states')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
        <button class="m__create__button" @click="submit" v-scroll-to="{element: '.m__header', duration: 1000}">Save</button>
      </div>

      <!-- snackbar -->
      <v-snackbar
        :timeout="snackbarTimeout"
        :color="snackbarColor"
        :multi-line="true"
        v-model="showSnackbar"
      >
        {{ snackbarText }}
        <v-btn dark flat @click.native="showSnackbar = false">Close</v-btn>
      </v-snackbar>

    </div>
  </div>
</template>

<script>
import config from '@/config'
import * as types from '@/store/mutationTypes'
import { mapMutations, mapActions, mapGetters } from 'vuex'

export default{
  beforeMount () {
    // update the progress bar
    this.UPDATE_EDIT_PROGRESS_BAR(50 * 2)

    // Grab the user
    this.checkAuth().then((response) => {
      if (response.status) {
        this.generateAccountCities()
      } else {
        this.$router.push('/login')
      }
    })
  },
  data () {
    return {
      config,
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: 'success',
      snackbarSuccess: false
    }
  },
  computed: {
    ...mapGetters(['user', 'signUpCities', 'editInfo', 'possibleEditCities']),
    selectedCities: {
      get () { return this.editInfo.cities },
      set (cities) { this.UPDATE_EDIT_INFO({ type: 'CITIES', value: cities }) }
    },
    selectedState: {
      get () { return this.editInfo.selectedState },
      set (newState) { this.UPDATE_EDIT_INFO({ type: 'SELECTED_STATE', value: newState }) }
    }
  },
  methods: {
    ...mapMutations([types.UPDATE_EDIT_PROGRESS_BAR, types.UPDATE_EDIT_INFO]),
    ...mapActions(['checkAuth', 'fetchCities', 'generateAccountCities', 'updateUser']),

    /*
      Toggles the cities for a given state
    */
    toggleState (state) {
      this.selectedState = state.abbr
    },

    submit () {
      this.updateUser(this.user).then((success) => {
        if (success) {
          this.showSnackbar = true
          this.snackbarSuccess = success.status
          this.snackbarText = success.message
          this.snackbarColor = 'success'
        }
      }).catch((err) => {
        this.showSnackbar = true
        this.snackbarSuccess = err.status
        this.snackbarText = err.message
        this.snackbarColor = 'pink lighten-1'
      })
    }
  }
}
</script>
<style lang="scss">

</style>
