<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">What cities do you want to be listed in for *each state*?</h2>

    <div class="filters__section">

      <!-- list out possible states, make first active by default -->
      <div class="signup__section__queries">
        <button :class="[{ 'signup__section__query-button--active':state.active || state.name.name === activeState },'signup__section__query-button']" v-for="state in $store.state.signUpInfo.states" @click="selectState(state)">{{state.name.name}}</button>
      </div>

      <!-- filter cities -->
      <div class="filters__section__input-container">
        <div class="filters__section__input-wrapper">
          <input class="filters__section__input" :placeholder="cityPlaceholder" v-model="cityName">
        </div>
      </div>

      <!-- list selected cities, conditionally by which state is active -->
      <div class="signup__section__queries">
        <button class="signup__section__query-button signup__section__query-button--remove" v-for="city in $store.state.signUpInfo.cities" v-if="city.state === activeState" @click="removeCity(city)">{{city.city}}</button>
      </div>

      <!-- list the cities in a state with conditional active checks -->
      <ul class="filters__section__list filters--margin">
        <li v-for="city in filterBy(cities, cityName, 'name')" @click="selectCity(city)" :class="[{ 'filters__section__list__item--selected':city.active },'filters__section__list__item']">{{city.name}}</li>
      </ul>
    </div>

    <!-- link to next page in process -->
    <router-link to="/signup/premium" class="signup__section__button">Continue</router-link>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'cities',
  data() {
    return {
      cityPlaceholder: 'Search By City',
      cities: [],
      cityName: '',
      activeState: '',
    };
  },
  mounted() {
    this.getCities(this.$store.state.signUpInfo.states[0].name.abbr);
    this.activeState = this.$store.state.signUpInfo.states[0].name.name;
  },
  methods: {
    /*
      Get list of state that a user can search by
    */
    getCities(state) {
      return new Promise((resolve, reject) => {
        fetch(`${config.api}/search/cities?state=${state}`).then((data, err) => {
          if (err) {
            reject('Something went wrong fetching cities');
          }
          data.json().then((cities) => {
            const newCities = [];
            /* eslint-disable */
            cities.forEach((city) => {
              newCities.push({name: city, active: false});
            });
            /* eslint-enable */
            this.cities = newCities;
            resolve(this.cities);
          });
        });
      });
    },

    /*
      Checks to see if an object exists in array
      @param {array} - list of cities to check against
      @param {object} - the object that is being checked
    */
    cityExists(arr, city) {
      return arr.some(el => el.city === city.city);
    },

    /*
      Removes element from query and performs a new search
    */
    selectState(item) {
      this.$store.state.signUpInfo.states.forEach((state) => {
        /* eslint-disable */
        if (state.name.name === item.name.name) {
          state.active = !state.active;
          if(state.active === true){
            this.activeState = state.name.name;
          }
          this.getCities(state.name.abbr).then(()=>{
            /* give the appropriate cities in the list the active class*/
            this.makeCitiesActive();
          });
        } else{
          state.active = false;
        }
        /* eslint-enable */
      });
    },

    /*
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectCity(item) {
      /* need to reconstruct an object to have the same keys of {city, state} */
      const objectToCheckAgainst = { city: item.name, state: this.activeState };

      /* if the item isn't in the list, add it, otherwise remove it */
      if (this.cityExists(this.$store.state.signUpInfo.cities, objectToCheckAgainst)) {
        /* need to get the position of an object in an array with map */
        const pos = this.$store.state.signUpInfo.cities.map(e => e.city).indexOf(item.name);
        this.$store.state.signUpInfo.cities.splice(pos, 1);
      } else {
        /* before we push, put it in an object with the state name */
        this.$store.state.signUpInfo.cities.push({
          state: this.activeState,
          city: item.name,
        });
      }

      this.cities.forEach((city) => {
        /* eslint-disable */
        if (city.name === item.name) {
          city.active = !city.active;
        }
        /* eslint-enable */
      });
    },

    /*
      Removes element from query and performs a new search
    */
    removeCity(item) {
      /* need to reconstruct an object to have the same keys of {city, state} */
      const objectToCheckAgainst = { city: item.city, state: this.activeState };

      /* if the item isn't in the list, add it, otherwise remove it */
      if (this.cityExists(this.$store.state.signUpInfo.cities, objectToCheckAgainst)) {
        /* need to get the position of an object in an array with map */
        const pos = this.$store.state.signUpInfo.cities.map(e => e.city).indexOf(item.city);
        this.$store.state.signUpInfo.cities.splice(pos, 1);
      }

      this.cities.forEach((city) => {
        /* eslint-disable */
        if (city.name === item.city) {
          city.active = !city.active;
        }
        /* eslint-enable */
      });
    },

    /*
      Selects cities that are already in the store on load or toggle change
    */
    makeCitiesActive() {
      this.cities.forEach((city) => {
        /* need to reconstruct an object to have the same keys of {city, state} */
        const objectToCheckAgainst = { city: city.name, state: this.activeState };
        /* eslint-disable */
        if (this.cityExists(this.$store.state.signUpInfo.cities, objectToCheckAgainst)) {
          city.active = !city.active;
        }
        /* eslint-enable */
      });
    },
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
  &__queries{
    max-width: calc(768px - 4rem);
    margin: 0 auto 0rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    text-align: left;
  }
  &__query-button{
    border: solid 1px $gray-light;
    padding: 0.5rem 1rem;
    border-radius: $round-radius;
    color: $gray-medium;
    position: relative;
    transition: all 0.25s ease-in-out;
    margin: 0.5rem;
    display: block;
    flex: 0 0 auto;
    &--remove{
      padding: 0.5rem 2rem 0.5rem 1rem;
      &:after{
        position: absolute;
        content: '';
        height: 15px;
        width: 15px;
        top: 50%;
        right: 0.5rem;
        transform: translateY(-50%);
        background: url('../../../static/svg/close-dark.svg');
        transition: background 0.25s ease-in-out;
      }
    }
    &--active{
      border: solid 1px transparent;
      background: $blue;
      color: $white;
    }
    &:hover{
      background: $gray-light;
      color: $white;
      border: solid 1px transparent;
      cursor: pointer;
      &:after{
        background: url('../../../static/svg/close-light.svg');
      }
    }
  }
}

/* overrides for the filters from the global file */
.filters__section{
  margin: 2rem 0 0 0;
}
.filters__section__input-wrapper{
  width: 100%;
  padding: 0.5rem 0;
}
.filters__section__list{
  max-height: 250px;
  margin-top: 0;
}
/* these need to be local in each component for some reason */
.filters__section__list__item--selected{
  &:after{
    background: url('../../../static/svg/verified-black.svg');
  }
}
</style>
