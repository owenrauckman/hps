<template>
  <div>
    <div class="m__create">
      <h1 class="m__create__heading">Premium</h1>


      <div v-for="state, stateIndex in chosenStates">
        <div v-if="state.premiumAvailable" @click="addPremium(state, 'state')"><v-switch v-bind:label="`${state.name}`" v-model="state.premium" color="pink lighten-1"></v-switch></div>
        <div v-else><v-switch v-bind:label="`${state.name} - already taken`" disabled></v-switch></div>
        <div v-for="(city, cityIndex) in chosenCities" v-if="city.state === state.name" class="signup__section__form__box">
          <div v-if="city.premiumAvailable" @click="addPremium(city, 'city')"><v-switch v-bind:label="`${city.city}`" v-model="city.premium" color="pink lighten-1"></v-switch></div>
          <div v-else><v-switch v-bind:label="`${city.city} - already taken`" disabled></v-switch></div>
        </div>
      </div>

      <div class="m__create__navigation">
        <p class="m__create__navigation__rate">
          <span>Your current monthly fee is {{userCurrentFee}}</span></br>
          <span v-if="userCurrentFee !== currentFee">Your new monthly fee will be {{currentFee}}</span>
        </p>
        <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('cities')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
        <button class="m__create__button" @click.prevent="updateAreasServed" v-scroll-to="{element: '.m__header', duration: 1000}">
          <span v-if="userCurrentFee === currentFee || currentFee === 0">Submit</span>
          <span v-else>Continue</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import * as types from '@/store/mutationTypes';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default{
  beforeMount() {
    // get premiums that user already owns and set the local currentFee
    this.getPremiumsUserOwns();
    this.currentFee = this.userCurrentFee;

    // update the progress bar
    this.UPDATE_EDIT_PROGRESS_BAR(25 * 3);

    // Grab the user
    this.checkAuth().then((response) => {
      if (response.status) {
        this.fetchPremiums(); // make specific to edit
      } else {
        this.$router.push('/login');
      }
    });
  },
  data() {
    return {
      chosenStates: [],
      chosenCities: [],
      basicPlans: 0,
      proPlans: 0,
      premiumPlans: 0,
      alreadyOwnedStates: [],
      alreadyOwnedCities: [],
      currentFee: 0,
    };
  },
  computed: {
    ...mapGetters(['user', 'editInfo', 'userCurrentFee']),
  },
  methods: {
    ...mapMutations([
      types.UPDATE_EDIT_PROGRESS_BAR, types.UPDATE_EDIT_INFO, types.UPDATE_USER_AREAS,
    ]),
    ...mapActions(['checkAuth', 'fetchCities', 'generateAccountCities', 'updateSubscriptions']),

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

    getPremiumsUserOwns() {
      // reset so duplicates aren't added
      this.alreadyOwnedStates = [];
      this.alreadyOwnedCities = [];
      this.user.company.areasServed.forEach((area) => {
        if (area.ownsPremium) {
          this.alreadyOwnedStates.push(area.state);
        }
        area.cities.forEach((city) => {
          if (city.ownsPremium) {
            this.alreadyOwnedCities.push({
              state: area.state,
              city: city.city,
            });
          }
        });
      });
    },

    /*
      Checks to see if an object is in an array (for cities)
      @param { object } city - city object we are checking
    */
    findCityInArray(city) {
      for (let ownedCity = 0; ownedCity < this.alreadyOwnedCities.length; ownedCity += 1) {
        if (
          this.alreadyOwnedCities[ownedCity].state === city.state &&
          this.alreadyOwnedCities[ownedCity].city === city.city
        ) {
          return true;
        }
      }
      return false; // default
    },

    /*
      fetches which premium states/cities are available and applies rules
      Again, this is not in store bc of the local data involved.
      Lastly, since we are editing. If the user owns premium here we won't disable it
      so that they can have the ability to edit their subscription.
    */
    fetchPremiums() {
      this.editInfo.states.forEach((state) => {
        this.checkPremium(
       this.user.company.name,
       state,
     ).then((stateResponse) => {
       // if premium is available, make sure that the user doesn't actually own it.
       let statePremiumAvailable = stateResponse.premiumAvailable;
       let stateAlreadyOwned = false;
       if (!statePremiumAvailable) {
         if (this.alreadyOwnedStates.includes(state)) {
           statePremiumAvailable = true;
           stateAlreadyOwned = true;
         }
       }
       this.chosenStates.push({
         abbr: state,
         name: config.states[state],
         premiumAvailable: statePremiumAvailable,
         premium: stateAlreadyOwned,
       });
       this.editInfo.cities.forEach((city) => {
         if (city.state === state) {
           this.checkPremium(
             this.user.company.name,
             state,
             city.city,
           ).then((cityResponse) => {
             // if premium is available, make sure that the user doesn't actually own it.
             let cityPremiumAvailable = cityResponse.premiumAvailable;
             let cityAlreadyOwned = false;
             if (!cityPremiumAvailable) {
               if (this.findCityInArray(city)) {
                 cityPremiumAvailable = true;
                 cityAlreadyOwned = true;
               }
             }
             this.chosenCities.push({
               state: config.states[state],
               city: city.city,
               premiumAvailable: cityPremiumAvailable,
               premium: cityAlreadyOwned,
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
        this.UPDATE_USER_AREAS(areasServed);
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
      console.log('made it 2 submit');
      /* before redirecting to payment, add new info to store */
      // regardless of there being new paid subs or not, we will update all 3
      console.log('yooo');
      console.log(this.basicPlans);
      this.UPDATE_EDIT_INFO({ type: 'SUBSCRIPTION_DETAILS',
        value: { basic: this.basicPlans,
          pro: this.proPlans,
          premium: this.premiumPlans,
        },
      });

      this.updateSubscriptions().then((success) => {
        if (success) {
          console.log('yeah success');
        } else {
          console.log('nawh man, just an error ');
        }
      });

      // ALSO..add logic for if all plans === current num then we don't need to update stripe
      // YO, we need this logic, but for now I am just trying with a little bit
      // if (this.proPlans > 0 || this.premiumPlans > 0) {
      //   /* redirect to payment */
      //   this.$router.push('/create/pay');
      //   /* otherwise go ahead and sign them up */
      // } else {
      //   this.updateSubscriptions().then((success) => {
      //     if (success) {
      //       this.$router.push('/create/success');
      //     } else {
      //       console.log('some error');
      //     }
      //     // todo flash message error
      //   });
      // }
    },
  },
};
</script>
<style lang="scss">
@import '../../sass/main.scss';

</style>
