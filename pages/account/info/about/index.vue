<template>
  <div>
    <v-text-field
       label="About You"
       textarea
       color="indigo darken-2"
       v-model="user.company.aboutMe"
     ></v-text-field>

     <v-text-field
        label="About Your Company"
        textarea
        color="indigo darken-2"
        v-model="user.company.aboutCompany"
      ></v-text-field>

      <div class="m__create__about">
        <div class="m__create__about--half">
          <v-text-field label="Website" v-model="user.company.links.website" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Facebook" v-model="user.company.links.facebook" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Twitter" v-model="user.company.links.twitter" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Instagram" v-model="user.company.links.instagram" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Pinterest" v-model="user.company.links.pinterest" color="indigo darken-2"></v-text-field>
        </div>
        <div class="m__create__about--half">
          <v-text-field label="Youtube" v-model="user.company.links.youtube" color="indigo darken-2"></v-text-field>
        </div>
      </div>

      <!-- save -->
      <div class="m__create__navigation">
        <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('/account')}" v-scroll-to="{element: '.m__header', duration: 1000}">Dashboard</button>
        <button class="m__create__button" @click="submit()" v-scroll-to="{element: '.m__header', duration: 1000}">Save</button>
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
</template>

<script>
import * as types from '@/store/mutationTypes'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default{
  beforeMount () {
    this.checkAuth().then((response) => {
      if (!response.status) {
        this.$router.push('/login')
      }
    })
  },
  data () {
    return {
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: 'success',
      snackbarSuccess: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapMutations([types.UPDATE_USER_DATA]),
    ...mapActions(['checkAuth', 'updateUser']),
    /*
      Performs validation before continuing
    */
    submit () {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          /* check if username and email address are already in use on server */
          this.updateUser(this.user).then((response) => {
            this.showSnackbar = true
            this.snackbarSuccess = response.status
            this.snackbarText = response.message
            this.snackbarColor = 'success'
          }).catch((err) => {
            this.showSnackbar = true
            this.snackbarSuccess = err.status
            this.snackbarText = err.message
            this.snackbarColor = 'pink lighten-1'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">

.m__create__account{
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
  &__error{
    width: 100%;
    color: $pink;
    font-family: $rubik;
    letter-spacing: 0;
    text-align: right;
    margin: 0 0 1rem 0;
  }
}

</style>
