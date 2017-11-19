<template>
  <div>
    <div class="m__create">
      <h1 class="m__create__heading">States</h1>

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
        return-object
        required
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
    this.UPDATE_EDIT_PROGRESS_BAR(25 * 1);

    // Grab the user
    this.checkAuth().then((response) => {
      if (response.status) {
        this.fetchStates();
        this.generateLocations();
      } else {
        this.$router.push('/login');
      }
    });
  },
  computed: {
    ...mapGetters(['currentFee', 'user', 'signUpStates', 'editInfo']),
    selectedStates: {
      get() { return this.editInfo.states; },
      set(states) { this.UPDATE_EDIT_INFO({ type: 'STATES', value: states }); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_EDIT_PROGRESS_BAR, types.UPDATE_EDIT_INFO]),
    ...mapActions(['checkAuth', 'fetchStates', 'generateLocations']),
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
