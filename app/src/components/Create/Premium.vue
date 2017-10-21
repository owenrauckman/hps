<template>
  <div class="m__create">
    <h1 class="m__create__heading">Get Noticed with Premium</h1>
    <p class="m__create__description">Show up in more searches when you select cities/states to be a premium user in.</p>

    PREMIUM PAGE



    <div class="m__create__navigation">
      <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p>
      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('about')}">Back</button>
      <button class="m__create__button" @click="submit()">Continue</button>
    </div>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['currentFee', 'signUpInfo']),
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    /*
      Performs validation before continuing
    */
    submit() {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$router.push('/create/pay');
    },

  },
  mounted() {
    this.UPDATE_PROGRESS_BAR(16.667 * 5);
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
