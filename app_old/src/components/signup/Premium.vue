<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Choose Which Areas You Want Premium In</h2>
    <div class="signup__section__form__container">
      <div v-for="state, stateIndex in $store.state.temp.signUpInfo.chosenStates" class="signup__section__form__box">
        <b class="signup__section__form__box--state">{{state.name}}</b>
        <div v-if="state.premiumAvailable">
          <input type="checkbox" :id="['toggleState' + stateIndex]" @click="addPremium(state, 'state')" class="signup__section__form__hide-checkbox" :checked="state.premium">
          <label v-bind:for="['toggleState' + stateIndex]" class="signup__section__form__switch-button"></label>
        </div>
        <div v-for="(city, cityIndex) in $store.state.temp.signUpInfo.chosenCities" v-if="city.state === state.name" class="signup__section__form__box">
          <p>{{city.city}}</p>
          <div v-if="city.premiumAvailable">
            <input type="checkbox" :id="['toggleCity' + cityIndex]"  @click="addPremium(city, 'city')" class="signup__section__form__hide-checkbox" :checked="city.premium">
            <label v-bind:for="['toggleCity' + cityIndex]" class="signup__section__form__switch-button"></label>
          </div>
        </div>
      </div>
    </div>

    <!-- link to next page in process -->
    <a v-on:click.prevent="updateAreasServed" class="signup__section__button">
      <span v-if="this.$store.state.temp.signUpInfo.totalPrice > 0">Continue</span>
      <span v-else>Sign Up</span>
    </a>

  </div>
</template>

<script>
export default {
  name: 'premium',
  data() {
    return {
      chosenStates: this.$store.state.temp.signUpInfo.chosenStates,
      chosenCities: this.$store.state.temp.signUpInfo.chosenCities,
      basicPlans: 0,
      proPlans: 0,
      premiumPlans: 0,
    };
  },
  beforeMount() {
    /* Reset these before each mount to keep from doubling on reMount */

    this.$store.state.temp.signUpInfo.states.forEach((state) => {
      this.checkPremium(
      this.$store.state.temp.signUpInfo.company.name,
      state.name.abbr,
    ).then((stateResponse) => {
      const stateObject = {
        abbr: state.name.abbr,
        name: state.name.name,
        premiumAvailable: stateResponse.premiumAvailable,
        premium: false,
      };
      /* make sure it doesn't already exist before pushing */
      if (!this.stateExists(this.chosenStates, stateObject)) {
        this.chosenStates.push(stateObject);
      }

      this.$store.state.temp.signUpInfo.cities.forEach((city) => {
        if (city.state === state.name.name) {
          this.checkPremium(
            this.$store.state.temp.signUpInfo.company.name,
            state.name.abbr,
            city.city,
          ).then((cityResponse) => {
            const cityObject = {
              state: state.name.name,
              city: city.city,
              premiumAvailable: cityResponse.premiumAvailable,
              premium: false,
            };

            /* make sure it doesn't already exist before pushing */
            if (!this.cityExists(this.chosenCities, cityObject)) {
              this.chosenCities.push(cityObject);
            }
          });
        }
      });
    });
    });
  },
  methods: {

    /*
      Checks to see if an object exists in array
      @param {array} - list of cities to check against
      @param {object} - the object that is being checked
    */
    cityExists(arr, city) {
      return arr.some(el => el.city === city.city && el.state === city.state);
    },

    stateExists(arr, state) {
      return arr.some(el => el.name === state.name);
    },

    /*
      Checks to see if city or state has premium
    */
    checkPremium(company, state, city) {
      /* Build the URL based on state or city */
      let url;
      if (city) {
        url = `${this.$config.default.api}/search/checkPremium?` +
        `company=${encodeURI(company)}&state=${state}&city=${encodeURI(city)}`;
      } else {
        url = `${this.$config.default.api}/search/checkPremium?` +
        `company=${encodeURI(company)}&state=${encodeURI(state)}`;
      }

      /* perform the request */
      return new Promise((resolve, reject) => {
        fetch(url).then((data, err) => {
          if (err) {
            reject('Something went wrong fetching cities');
          }
          data.json().then((json) => {
            resolve(json);
          });
        });
      });
    },
    /*
      Adds a premium city or state to the user's cart
      @param {object} - the object that the user clicked
      @param {string} - the type of object that is being clicked
    */
    addPremium(item, type) {
      let priceToChange = 0;
      if (type === 'city') {
        priceToChange = this.$config.default.cityPrice;
      } else if (type === 'state') {
        priceToChange = this.$config.default.statePrice;
      }
      /* eslint-disable */
      if(item.premium === true){
        item.premium = false;
        this.$store.state.temp.signUpInfo.totalPrice -= priceToChange;
      } else{
        item.premium = true;
        this.$store.state.temp.signUpInfo.totalPrice += priceToChange;
      }

      /* Notify the store */
      this.$store.commit('updatePremiumCities', this.chosenCities);
      this.$store.commit('updatePremiumStates', this.chosenStates);
      /* eslint-enable */
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
        this.$store.state.temp.signUpInfo.company.areasServed = areasServed;
        resolve(areasServed);
      });

      setCompanies.then(() => {
        if (this.proPlans > 0 || this.premiumPlans > 0) {
          /* before redirecting to payment, add new info to store */
          this.$store.state.temp.signUpInfo.basicPlans = this.basicPlans;
          this.$store.state.temp.signUpInfo.proPlans = this.proPlans;
          this.$store.state.temp.signUpInfo.premiumPlans = this.premiumPlans;

          /* redirect to payment */
          this.$router.push('/signup/pay');
          /* otherwise go ahead and sign them up */
        } else {
          /* after the object is created redirect to /signup/pay */
          /* todo: also, add a reset on this page for back buton state */
          const storeData = this.$store.state.temp.signUpInfo;
          const signUpInfo = {
            firstName: storeData.firstName,
            lastName: storeData.lastName,
            username: storeData.username,
            password: storeData.password,
            emailAddress: storeData.emailAddress,
            phoneNumber: storeData.phoneNumber,
            profilePicture: storeData.profilePicture,
            company: storeData.company,
            basicPlans: this.basicPlans,
            proPlans: this.proPlans,
            premiumPlans: this.premiumPlans,
          };
          this.axios.post(`${this.$config.default.api}/users/register`, signUpInfo)
            .then((response) => {
              if (response.data.success === true) {
                this.resetState();
                this.$router.push('/signup/success');
              }
            })
            .catch((error) => {
              /* eslint-disable */
              console.log(error);
              /* eslint-enable */
            });
        }
      });
    },
  },

  /*
    Resets any sign up data back to normal after successful sign up
  */
  resetState() {
    this.$store.state.temp.signUpInfo.states = [];
    this.$store.state.temp.signUpInfo.cities = [];
    this.$store.state.temp.signUpInfo.totalPrice = 0;
    this.$store.state.temp.signUpInfo.firstName = '';
    this.$store.state.temp.signUpInfo.lastName = '';
    this.$store.state.temp.signUpInfo.emailAddress = '';
    this.$store.state.temp.signUpInfo.username = '';
    this.$store.state.temp.signUpInfo.password = '';
    this.$store.state.temp.signUpInfo.phoneNumber = '';
    this.$store.state.temp.signUpInfo.profilePicture = this.$config.default.defaultProfileImage;
    this.$store.state.temp.signUpInfo.basicPlans = 0;
    this.$store.state.temp.signUpInfo.proPlans = 0;
    this.$store.state.temp.signUpInfo.premiumPlans = 0;
    this.$store.state.temp.signUpInfo.company.name = '';
    this.$store.state.temp.signUpInfo.company.aboutCompany = '';
    this.$store.state.temp.signUpInfo.company.aboutMe = '';
    this.$store.state.temp.signUpInfo.company.areasServed = [];
    this.$store.state.temp.signUpInfo.company.links.website = '';
    this.$store.state.temp.signUpInfo.company.links.facebook = '';
    this.$store.state.temp.signUpInfo.company.links.twitter = '';
    this.$store.state.temp.signUpInfo.company.links.instagram = '';
    this.$store.state.temp.signUpInfo.company.links.pinterest = '';
    this.$store.state.temp.signUpInfo.company.links.youtube = '';
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';


.signup__section{
  display: flex;
  flex-direction: column;
  margin: 0;
  @include breakpoint(desktop){
    margin: 0 2rem;
  }
  &__heading{
    font-size: 1.25rem;
    color: $gray-dark;
  }
  &__form{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    &__container{
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      margin: 2rem 0 0 0;
    }
    &__box{
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      margin: 1rem 0 1rem 1rem;
      &--state{
        margin: 0 0 2rem 0;
      }
    }

    /* button toggles */
    &__switch-button {
      position: relative;
      display: block;
      width: 60px;
      height: 30px;
      border-radius: 30px;
      background: linear-gradient(to bottom right, lighten($gray-light, 5%), lighten($gray-light, 5%));
      transition: all .25s ease-in;
    }

    &__switch-button:before {
      content: "";
      position: absolute;
      left: 5px;
      right: 5px;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform .25s ease-in-out;
    }
    &__hide-checkbox {
      position: absolute;
      left: -9999px;
      opacity: 0;
    }
    /* toggle the checked styles here */
    &__hide-checkbox:checked + .signup__section__form__switch-button {
      background: linear-gradient(to bottom right, transparentize($orange, 0.05), transparentize($red-orange, 0.05));
    }
    &__hide-checkbox:checked + .signup__section__form__switch-button:before {
      transform: translate3d(calc(100% + 10px),0,0);
    }
    /* end button toggles */

    &__input{
      color: $gray-dark;
      box-sizing: border-box;
      border: solid 1px $gray-border;
      border-radius: $border-radius;
      height: 60px;
      margin: 1rem 0;
      padding: 1rem;
      width: 100%;
    }
    &--half{
      width: 100%;
      @include breakpoint(phone){
        width: calc(50% - 1rem);
      }
    }
    &--full{
      width: 100%;
    }
  }
  &__button{
    margin-top: 1rem;
    align-self: flex-end;
    color: $white;
    font-size: 0.9rem;
    padding: 1rem 2rem;
    border-radius: $round-radius;
    box-shadow: $box-shadow;
    background: $blue;
    transition: all 0.25s ease-in-out;
    text-decoration: none;
    cursor: pointer;
    &:hover{
      background: darken($blue, 10%);
    }
  }
}

</style>
