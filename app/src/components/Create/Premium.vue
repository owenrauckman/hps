<template>
  <div class="m__create">
    <h1 class="m__create__heading">Get Noticed with Premium</h1>
    <p class="m__create__description">Show up in more searches when you select cities/states to be a premium user in.</p>

    <div v-for="state, stateIndex in chosenStates">
      <div v-if="state.premiumAvailable" @click="addPremium(state, 'state')"><v-switch v-bind:label="`${state.name}`" v-model="state.premium" color="pink lighten-1"></v-switch></div>
      <div v-else><v-switch v-bind:label="`${state.name} - not already taken`" disabled></v-switch></div>
      <div v-for="(city, cityIndex) in chosenCities" v-if="city.state === state.name" class="signup__section__form__box">
        <div v-if="city.premiumAvailable" @click="addPremium(city, 'city')"><v-switch v-bind:label="`${city.city}`" v-model="city.premium" color="pink lighten-1"></v-switch></div>
        <div v-else><v-switch v-bind:label="`${city.city} - not already taken`" disabled></v-switch></div>
      </div>
    </div>


    <div class="m__create__navigation">
      <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p>
      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('about')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
      <button class="m__create__button" @click.prevent="updateAreasServed" v-scroll-to="{element: '.m__header', duration: 1000}">
        <span v-if="currentFee > 0">Continue</span>
        <span v-else>Sign Up</span>
      </button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import * as types from '@/store/mutationTypes';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      chosenStates: [],
      chosenCities: [],
      basicPlans: 0,
      proPlans: 0,
      premiumPlans: 0,
    };
  },
  computed: {
    ...mapGetters(['signUpInfo']),
    currentFee: {
      get() { return this.signUpInfo.currentFee; },
      set(newFee) { this.UPDATE_SIGN_UP_INFO({ type: 'CURRENT_FEE', value: newFee }); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    ...mapActions({
      createProfile: 'createProfile',
    }),
    /*
      checks to see if premium is available for a city/state
      this method is here instead of the store bc it is only referencing
      data local to this component.
    */
    checkPremium(company, state, city) {
      /* Build the URL based on state or city */
      let url;
      if (city) {
        url = `${config.api}/search/checkPremium?` +
        `company=${encodeURI(company)}&state=${state}&city=${encodeURI(city)}`;
      } else {
        url = `${config.api}/search/checkPremium?` +
        `company=${encodeURI(company)}&state=${encodeURI(state)}`;
      }
      /* perform the request */
      return new Promise((resolve) => {
        axios.get(url).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          throw new Error(`${err}: Something went wrong, add flash message`);
        });
      });
    },
    /*
      Adds a premium city or state to the user's cart
      @param {object} - the object that the user clicked
      @param {string} - the type of object that is being clicked
    */
    addPremium(item, type) {
      /* eslint-disable no-param-reassign */
      item.premium = !item.premium;
      /* eslint-enable */
      let priceToChange = 0;
      if (type === 'city') {
        priceToChange = config.cityPrice;
      } else if (type === 'state') {
        priceToChange = config.statePrice;
      }
      /* eslint-disable */
      if(item.premium === true){
        item.premium = false;
        this.currentFee-= priceToChange;
      } else{
        item.premium = true;
        this.currentFee+= priceToChange;
      }
      /* eslint-enable */
    },

    /*
      fetches which premium states/cities are available and applies rules
      Again, this is not in store bc of the local data involved.
    */
    fetchPremiums() {
      this.signUpInfo.states.forEach((state) => {
        this.checkPremium(
       this.signUpInfo.company.name,
       state.value,
     ).then((stateResponse) => {
       this.chosenStates.push({
         abbr: state.value,
         name: state.text,
         premiumAvailable: stateResponse.premiumAvailable,
         premium: false,
       });
       this.signUpInfo.cities.forEach((city) => {
         if (city.state === state.value) {
           this.checkPremium(
             this.signUpInfo.company.name,
             state.value,
             city.city,
           ).then((cityResponse) => {
             this.chosenCities.push({
               state: state.text,
               city: city.city,
               premiumAvailable: cityResponse.premiumAvailable,
               premium: false,
             });
           });
         }
       });
     });
      });
    },

    /*
      Updates the global store with all of the cities (selected or not)
      and redirects to payment page next
    */
    updateAreasServed() {
      const areasServed = [];
      /*
        perform this inside of a promise to ensure that the
        object populates before redirect
      */
      const setCompanies = new Promise((resolve) => {
        /* reset plan counts each time in case they have been updated */
        this.basicPlans = 0;
        this.proPlans = 0;
        this.premiumPlans = 0;
        this.chosenStates.forEach((state) => {
          /* check if they want premium */
          if (state.premium) {
            this.premiumPlans += 1;
          } else {
            this.basicPlans += 1;
          }
          const cities = [];
          this.chosenCities.forEach((city) => {
            if (city.state === state.name) {
              if (city.premium) {
                this.proPlans += 1;
              } else {
                this.basicPlans += 1;
              }
              cities.push({
                city: city.city,
                ownsPremium: city.premium,
              });
            }
          });
          /* Finally, push each new item to the array */
          areasServed.push({
            state: state.abbr,
            ownsPremium: state.premium,
            cities,
          });
        });
        // commit directly back to store.
        this.UPDATE_SIGN_UP_INFO({ type: 'AREAS_SERVED', value: areasServed });
        resolve(areasServed);
      });

      // Update the store with final info before payment.
      setCompanies.then(() => {
        this.submit();
      });
    },

    /*
      Submits the form or redirects to pay page
    */
    submit() {
      if (this.proPlans > 0 || this.premiumPlans > 0) {
        /* before redirecting to payment, add new info to store */
        this.UPDATE_SIGN_UP_INFO({ type: 'BASIC_PLANS', value: this.basicPlans });
        this.UPDATE_SIGN_UP_INFO({ type: 'PRO_PLANS', value: this.proPlans });
        this.UPDATE_SIGN_UP_INFO({ type: 'PREMIUM_PLANS', value: this.premiumPlans });
        /* redirect to payment */
        this.$router.push('/create/pay');
        /* otherwise go ahead and sign them up */
      } else {
        this.UPDATE_SIGN_UP_INFO({ type: 'BASIC_PLANS', value: this.basicPlans });
        this.createProfile().then((success) => {
          if (success) {
            this.$router.push('/create/success');
          }
          // todo flash message error
        });
      }
    },

  },
  beforeMount() {
    this.currentFee = 0; // always reset this so numbers don't carry over.
    this.fetchPremiums();
  },
  mounted() {
    this.UPDATE_PROGRESS_BAR(16.667 * 5);
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
