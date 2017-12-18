<template>
  <div>
    <div class="m__create">
      <h1 class="m__create__heading">Account Dashboard</h1>
    </div>

    <div class="p__profile">
      <div class="p__info">
        <div>
          <h1 class="p__info__name">{{user.firstName}} {{user.lastName}}</h1>
          <h2 class="p__info__company" v-if="user.company">{{user.company.name}}</h2>
        </div>
        <div class="p__info__image" :style="{ 'background-image': `url('${user.profilePicture}')` }">
          <div class="p__info__image--badge" v-if="ownsPremiumCity || ownsPremiumState">Premium</div>
        </div>
      </div>
    </div>

    <div class="d__options">
      <div class="d__options-container">
        <router-link class="d__options__card" to="/account/info">
          <h2 class="d__options__card__heading">Profile</h2>
          <p class="d__options__card__copy">Edit your basic information such as name, email address, phone number, about, and links</p>
        </router-link>
        <router-link class="d__options__card" to="/account/subscriptions">
          <h2 class="d__options__card__heading">Locations/Subscriptions</h2>
          <p class="d__options__card__copy">Update the cities and states that you are listed in. Add or remove your premium status for listings.</p>
        </router-link>
        <router-link class="d__options__card" to="/account/billing">
          <h2 class="d__options__card__heading">Billing</h2>
          <p class="d__options__card__copy">View your billing history, current payment information, update your payment information, or apply a coupon code.</p>
        </router-link>
        <router-link class="d__options__card" to="/account/password">
          <h2 class="d__options__card__heading">Password</h2>
          <p class="d__options__card__copy">Change your current password</p>
        </router-link>
        <a class="d__options__card" @click.prevent.stop="showDeleteDialog = true">
          <h2 class="d__options__card__heading">Delete Account</h2>
          <p class="d__options__card__copy">We would be sad to see you go! Click here to delete your account. This cannot be undone.</p>
        </a>
      </div>
      <router-view></router-view>

    </div>

    <!-- delete confirm -->
    <v-dialog v-model="showDeleteDialog">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete your account?</v-card-title>
        <v-card-text>This action cannot be undone. You will immediately lose all of your subscriptions and data. Your credit card will stop being billed starting on your next cycle.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat="flat" @click.native="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="pink lighten-1" flat="flat" @click.native="deleteAccount()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      ownsPremiumCity: false,
      ownsPremiumState: false,
      showDeleteDialog: false,
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: 'success'
    }
  },
  beforeMount () {
    this.checkAuth().then((response) => {
      if (response.status) {
        this.checkPremium()
      } else {
        this.$router.push('/login')
      }
    })
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions({ checkAuth: 'checkAuth', deleteUser: 'deleteUser' }),

    /*
      Checks to see if the premium badge should be displayed for a user.
    */
    checkPremium () {
      // check to see if user owns premium city or state
      this.user.company.areasServed.forEach((area) => {
        if (area.ownsPremium === true) {
          this.ownsPremiumState = true
        }
        area.cities.forEach((city) => {
          if (city.ownsPremium === true) {
            this.ownsPremiumCity = true
          }
        })
      })
    },

    /*
      Deletes a user's account
    */
    deleteAccount () {
      this.showDeleteDialog = false
      this.deleteUser().then((response) => {
        if (response.status) {
          this.$router.push('/')
        } else {
          this.showSnackbar = true
          this.snackbarText = response.message
        }
      }).catch((error) => {
        this.showSnackbar = true
        this.snackbarText = error.message
      })
    }

  }
}
</script>

<style scoped lang="scss">

.p{
  &__profile{
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;
    @include breakpoint('phone'){
      padding: 4rem 2rem;
    }
  }
  &__info{
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
    @include breakpoint('phone'){
      justify-content: space-between;
      flex-direction: row;
      text-align: left;
    }
    &__name{
      font-family: $montserrat;
      color: $dark-grey;
      font-weight: bold;
      font-size: 2rem;
      letter-spacing: 0.01rem;
      margin-top: 2rem;
      @include breakpoint('phone'){
        margin-top: 0;
      }
    }
    &__company{
      font-family: $montserrat;
      color: $medium-dark-grey;
      font-weight: bold;
      font-style: italic;
      font-size: 1.25rem;
      letter-spacing: 0.05rem;
      margin-top: 0.5rem;
      @include breakpoint('phone'){
        margin-top: 1rem;
      }
    }
    &__image{
      border-radius: $circle-radius;
      background-size: cover;
      background-position: center;
      height: 100px;
      width: 100px;
      position: relative;
      &--badge{
        border-radius: 50px;
        padding: 0.5rem calc(0.75rem + 20px) 0.5rem 0.75rem;
        background: white;
        border: solid 1px $purple;
        color: $purple;
        font-family: $rubik;
        position: absolute;
        left: -75px;
        font-size: 0.9rem;
        &:after{
          position: absolute;
          content: '';
          background: url('../../static/svg/check.svg'); 
          height: 15px;
          width: 15px;
          margin-left: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}

.d{
  &__options{
    background: $off-white;
    min-height: 200px;
    position: relative;
    padding: 2rem;
    &-container{
      margin: 0 auto;
      max-width: 800px;
      display: flex;
      flex-wrap: wrap;
    }
    &__card{
      display: flex;
      flex-direction: column;
      padding: 2rem;
      margin: 1rem;
      border-radius: $border-radius;
      position: relative;
      background: $white;
      flex: 1 0 calc(100% - 4rem);
      box-shadow: none;
      transform: scale(1);
      text-align: center;
      transition: transform 0.2s ease-in-out;
      @include breakpoint('phone'){
        flex: 1 0 calc((100% / 2) - 2rem);
        max-width: calc((100% / 2) - 2rem);
      }
       &:link, &:active, &:visited{
         text-decoration: none;
       }
       &:hover{
         cursor: pointer;
         transform: scale(0.975);
       }
       &__heading{
         font-family: $montserrat;
         font-size: 1.25rem;
         letter-spacing: 0.05rem;
         margin: 1rem 0;
         color: $purple;
       }
       &__copy{
         font-size: 0.9rem;
         line-height: 1.4rem;
         color: $medium-grey;
       }
    }
  }
}
</style>
