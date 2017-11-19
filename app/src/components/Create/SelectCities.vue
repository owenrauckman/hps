<template>
  <div class="m__create">
    <h1 class="m__create__heading">Select Cities</h1>
    <p class="m__create__description">Select the city/cities would you would like to be listed in for each state that you selected.</p>

    <div class="m__create__state-container">
      <v-chip v-for="state in selectedStates" @click="toggleState(state)" :class="[{ 'm__create__chip--active': state.value === selectedState }, 'm__create__chip']">
        {{state.text}}
      </v-chip>
    </div>

    <div v-for="state in signUpCities" :key="state.name">
      <v-select
        v-bind:items="state.cities"
        v-model="selectedCities"
        v-bind:label="`${state.name} Cities`"
        v-bind:autocomplete="true"
        v-bind:clearable="true"
        v-bind:multiple="true"
        v-bind:chips="true"
        color="indigo darken-2"
        return-object
        item-text="city"
        :class="[{ 'm__create__select--show': state.abbr === selectedState }, 'm__create__select']"
      ></v-select>
    </div>

    <!-- tood active class based on value of selected chip above -->


    <div class="m__create__navigation">
      <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p>
      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('select-company-and-states')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
      <button class="m__create__button" @click="submit()" v-scroll-to="{element: '.m__header', duration: 1000}">Continue</button>
    </div>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['currentFee', 'signUpInfo', 'signUpCities', 'signUpSelectedState']),
    selectedStates() {
      return this.signUpInfo.states;
    },
    selectedCities: {
      get() { return this.signUpInfo.cities; },
      set(cities) { this.UPDATE_SIGN_UP_INFO({ type: 'CITIES', value: cities }); },
    },
    selectedState: {
      get() { return this.signUpSelectedState; },
      set(newState) { this.UPDATE_SIGN_UP_SELECTED_STATE(newState); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR,
      types.UPDATE_SIGN_UP_INFO,
      types.UPDATE_SIGN_UP_SELECTED_STATE]),
    ...mapActions(['fetchCompanies', 'fetchStates', 'generateCities']),

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
      this.$router.push('/create/account');
    },
  },
  beforeMount() {
    this.generateCities();
  },
  mounted() {
    this.UPDATE_PROGRESS_BAR(16.667 * 2);
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
