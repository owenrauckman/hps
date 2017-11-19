<template>
  <div>
    <div class="m__create">
      <h1 class="m__create__heading">Cities</h1>

      <div class="m__create__state-container">
        <v-chip v-for="state in editPossibleCities" @click="toggleState(state)" :class="[{ 'm__create__chip--active': state.abbr === selectedState }, 'm__create__chip']">
          {{state.abbr}}
        </v-chip>
      </div>

      <div v-for="state in editPossibleCities" :key="state.abbr">
        <v-select
          v-bind:items="state.cities"
          v-model="selectedCities"
          v-bind:label="`${state.abbr} Cities`"
          v-bind:autocomplete="true"
          v-bind:clearable="true"
          v-bind:multiple="true"
          v-bind:chips="true"
          color="indigo darken-2"
          return-object
          :class="[{ 'm__create__select--show': state.abbr === selectedState }, 'm__create__select']"
        ></v-select>
      </div>

      <div class="m__create__navigation">
        <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p> <!-- todo update this -->
        <button class="m__create__button" @click="submit()" v-scroll-to="{element: '.m__header', duration: 1000}">Continue</button>
      </div>

    </div>
  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default{
  beforeMount() {
    // update the progress bar
    this.UPDATE_EDIT_PROGRESS_BAR(25 * 2);

    // Grab the user
    this.checkAuth().then((response) => {
      if (response.status) {
        this.generateAccountCities();
      } else {
        this.$router.push('/login');
      }
    });
  },
  computed: {
    ...mapGetters(['currentFee', 'user', 'signUpCities', 'editInfo', 'editPossibleCities']),
    selectedStates() {
      return this.editInfo.states;
    },
    selectedCities: {
      get() { return this.editInfo.cities; },
      set(cities) { this.UPDATE_EDIT_INFO({ type: 'CITIES', value: cities }); },
    },
    selectedState: {
      get() { return this.editInfo.SelectedState; },
      set(newState) { this.UPDATE_EDIT_INFO({ type: 'SELECTED_STATE', value: newState }); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_EDIT_PROGRESS_BAR, types.UPDATE_EDIT_INFO]),
    ...mapActions(['checkAuth', 'fetchCities', 'generateAccountCities']),

    /*
      Toggles the cities for a given state
    */
    toggleState(state) {
      this.selectedState = state.value;
    },

    /*
      Performs validation before continuing
    */
    submit() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$router.push('/account/subscriptions/cities');
        }
      });
    },
  },
};
</script>
<style lang="scss">
@import '../../sass/main.scss';

</style>
