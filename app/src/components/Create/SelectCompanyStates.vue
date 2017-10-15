<template>
  <div class="m__create">
    <h1 class="m__create__heading">Select Company and States</h1>
    <p class="m__create__description">Select the company that you work for and the state(s) that you would like to be listed in.</p>

    <v-select
      v-bind:items="companies"
      v-model="selectedCompany"
      label="Company"
      v-bind:autocomplete="true"
      v-bind:clearable="true"
      color="indigo darken-2"
      v-bind:error-messages="errors.collect('selectedCompany')"
      required
    ></v-select>

    <!-- vee-validate doesn't work with select boxes -->
    <v-text-field
      v-model="selectedCompany"
      v-validate="'required'"
      data-vv-name="selectedCompany"
      data-vv-as="Company"
      class="m__create__hidden-input"
    ></v-text-field>

    <v-select
      v-bind:items="signUpStates"
      v-model="selectedStates"
      label="States"
      v-bind:autocomplete="true"
      v-bind:clearable="true"
      v-bind:multiple="true"
      v-bind:chips="true"
      color="indigo darken-2"
      v-bind:error-messages="errors.collect('selectedStates')"
      required
      return-object
    ></v-select>

    <!-- vee-validate doesn't work with select boxes -->
    <v-text-field
      v-model="selectedStates"
      v-validate="'required'"
      data-vv-name="selectedStates"
      data-vv-as="States"
      class="m__create__hidden-input"
    ></v-text-field>

    <div class="m__create__navigation">
      <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p>
      <button class="m__create__button" @click="submit()">Continue</button>
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
    ...mapGetters(['currentFee', 'signUpInfo', 'companies', 'signUpStates']),
    selectedCompany: {
      get() { return this.signUpInfo.company; },
      set(company) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY', value: company }); },
    },
    selectedStates: {
      get() { return this.signUpInfo.states; },
      set(states) { this.UPDATE_SIGN_UP_INFO({ type: 'STATES', value: states }); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    ...mapActions(['fetchCompanies', 'fetchStates']),
    /*
      Performs validation before continuing
    */
    submit() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$router.push('/create/select-cities');
        }
      });
    },
  },
  beforeMount() {
    this.fetchStates();
    this.fetchCompanies();
  },
  mounted() {
    this.UPDATE_PROGRESS_BAR(16.667);
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
