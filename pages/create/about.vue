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
      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('account')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
      <button class="m__create__button m__create__about__create" @click="submit()" v-scroll-to="{element: '.m__header', duration: 100}">Create Profile</button>
    </div>

    <!-- loading state -->
    <div :class="[{ 'm__create__loading--active': creatingAccount }, 'm__create__loading']">
      <div class='m__create__loading__dot m__create__loading__dot__1'></div>
      <div class='m__create__loading__dot m__create__loading__dot__2'></div>
      <div class='m__create__loading__dot m__create__loading__dot__3'></div>
      <div class='m__create__loading__dot m__create__loading__dot__4'></div>
    </div>

    <!-- snackbar (for failed creates)-->
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
</template>

<script>
import * as types from '@/store/mutationTypes'
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      creatingAccount: false,
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: 'Something went wrong when creating your profile. Please try again.'
    }
  },
  computed: {
    ...mapGetters(['signUpInfo']),

    aboutMe: {
      get () { return this.signUpInfo.company.aboutMe },
      set (aboutMe) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_ABOUT_ME', value: aboutMe }) }
    },
    aboutCompany: {
      get () { return this.signUpInfo.company.aboutCompany },
      set (aboutCompany) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_ABOUT_COMPANY', value: aboutCompany }) }
    },
    website: {
      get () { return this.signUpInfo.company.website },
      set (website) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_WEBSITE', value: website }) }
    },
    facebook: {
      get () { return this.signUpInfo.company.facebook },
      set (facebook) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_FACEBOOK', value: facebook }) }
    },
    twitter: {
      get () { return this.signUpInfo.company.twitter },
      set (twitter) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_TWITTER', value: twitter }) }
    },
    instagram: {
      get () { return this.signUpInfo.company.instagram },
      set (instagram) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_INSTAGRAM', value: instagram }) }
    },
    pinterest: {
      get () { return this.signUpInfo.company.pinterest },
      set (pinterest) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_PINTEREST', value: pinterest }) }
    },
    youtube: {
      get () { return this.signUpInfo.company.youtube },
      set (youtube) { this.UPDATE_SIGN_UP_INFO({ type: 'COMPANY_YOUTUBE', value: youtube }) }
    }
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    ...mapActions(['createProfile']),
    submit () {
      this.creatingAccount = true
      this.createProfile().then((success) => {
        if (success) {
          this.creatingAccount = false
          this.$router.push('/create/success')
        } else {
          this.creatingAccount = false
          this.showSnackbar = true
          this.snackbarSuccess = false
        }
      }).catch(() => {
        this.creatingAccount = false
        this.showSnackbar = true
        this.snackbarSuccess = false
      })
    }
  },
  mounted () {
    this.UPDATE_PROGRESS_BAR(20 * 4)
  }
}
</script>

<style scoped lang="scss">

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
  &__create{
    max-width: 180px;
  }
}


// load, refactor later
.m__create__loading{
 background: rgba(61, 74, 166, 0.9);
 z-index: +5;
 display: none;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 overflow: hidden;
 position: absolute;
 &--active{
   display: block;
 }
 &__dot{
   width: 10px;
   height: 10px;
   background: $pink;
   border-radius: 5px;
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
   left: -10%;
   &__1{ animation: dotslide 2s infinite cubic-bezier(0.2,.8,.8,0.2); }
   &__2{ animation: dotslide 2s .2s infinite cubic-bezier(0.2,.8,.8,0.2); }
   &__3{ animation: dotslide 2s .4s infinite cubic-bezier(0.2,.8,.8,0.2); }
   &__4{ animation: dotslide 2s .6s infinite cubic-bezier(0.2,.8,.8,0.2); }
 }
}
</style>
