<template>
  <div class="m__create">
    <h1 class="m__create__heading">Tell us about yourself</h1>
    <p class="m__create__description">Write a little about yourself and your company. Also, put links to your social media accounts and website.</p>

    <v-text-field
       label="About You"
       textarea
       color="indigo darken-2"
       v-model="aboutMe"
     ></v-text-field>

     <v-text-field
        label="About Your Company"
        textarea
        color="indigo darken-2"
        v-model="aboutCompany"
      ></v-text-field>

      <div class="m__create__about">
        <div class="m__create__about--half">
          <v-text-field label="Website" v-model="website" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Facebook" v-model="facebook" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Twitter" v-model="twitter" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Instagram" v-model="instagram" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Pinterest" v-model="pinterest" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Youtube" v-model="youtube" color="indigo darken-2"></v-text-field>
        </div>
      </div>


    <div class="m__create__navigation">
      <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p>
      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('account')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
      <button class="m__create__button" @click="submit()" v-scroll-to="{element: '.m__header', duration: 1000}">Continue</button>
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

    aboutMe: {
      get() { return this.signUpInfo.company.aboutMe; },
      set(aboutMe) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_ABOUT_ME', value: aboutMe }); },
    },
    aboutCompany: {
      get() { return this.signUpInfo.company.aboutCompany; },
      set(aboutCompany) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_ABOUT_COMPANY', value: aboutCompany }); },
    },
    website: {
      get() { return this.signUpInfo.company.website; },
      set(website) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_WEBSITE', value: { url: website } }); },
    },
    facebook: {
      get() { return this.signUpInfo.company.facebook; },
      set(facebook) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_FACEBOOK', value: { url: facebook } }); },
    },
    twitter: {
      get() { return this.signUpInfo.company.twitter; },
      set(twitter) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_TWITTER', value: { url: twitter } }); },
    },
    instagram: {
      get() { return this.signUpInfo.company.instagram; },
      set(instagram) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_INSTAGRAM', value: { url: instagram } }); },
    },
    pinterest: {
      get() { return this.signUpInfo.company.pinterest; },
      set(pinterest) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_PINTEREST', value: { url: pinterest } }); },
    },
    youtube: {
      get() { return this.signUpInfo.company.youtube; },
      set(youtube) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_YOUTUBE', value: { url: youtube } }); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    /*
      Performs validation before continuing
    */
    submit() {
      this.$router.push('/create/premium');
    },
  },
  mounted() {
    this.UPDATE_PROGRESS_BAR(16.667 * 4);
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.m__create__about{
  display: flex;
  flex-wrap: wrap;
  &--half{
    margin: 0 1rem;
    width: calc(100% - 2rem);
    @include breakpoint('tablet'){
      width: calc(50% - 2rem);
    }
  }
  &--full{
    margin: 0 1rem;
    width: calc(100% - 2rem);
  }
}
</style>
