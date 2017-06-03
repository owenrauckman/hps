<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">What cities do you want to be listed in?</h2>

    <div class="filters__section">

      <div class="signup__section__queries">
        <button :class="[{ 'signup__section__query-button--active':state.active },'signup__section__query-button']" v-for="state in $store.state.signUpInfo.states" @click="selectState(state)">{{state.name.name}}</button>
      </div>

      <div class="filters__section__input-container">
        <div class="filters__section__input-wrapper">
          <input class="filters__section__input" :placeholder="cityPlaceholder" v-model="cityName">
        </div>
      </div>

      <div class="signup__section__queries">
        <button class="signup__section__query-button signup__section__query-button--remove" v-for="city in $store.state.signUpInfo.cities" @click="removeCity(city)">{{city}}</button>
      </div>

      <ul class="filters__section__list filters--margin">
        <li v-for="city in filterBy(cities, cityName, 'name')" @click="selectCity(city)" :class="[{ 'filters__section__list__item--selected':city.active },'filters__section__list__item']">{{city.name}}</li>
      </ul>
    </div>

    <router-link to="/signup/premium" class="signup__section__button">Continue</router-link>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'companies',
  data() {
    return {
      cityPlaceholder: 'Search By City',
      cities: [],
      cityName: '',
    };
  },
  mounted() {
    this.getCities(this.$store.state.signUpInfo.states[0].name.abbr);
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
      Removes element from query and performs a new search
    */
    selectState(item) {
      this.$store.state.signUpInfo.states.forEach((state) => {
        /* eslint-disable */
        if (state.name.name === item.name.name) {
          state.active = !state.active;
          this.getCities(state.name.abbr);
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
      /* TODO: make this whole component use an object instead

        currently its an array, need {name: partylite, area: etc}
        and still be able to loop through that


      /* if the item isn't in the list, add it, otherwise remove it */
      if (this.$store.state.signUpInfo.cities.includes(item.name)) {
        this.$store.state.signUpInfo.cities.splice(
          this.$store.state.signUpInfo.cities.indexOf(item.name), 1);
      } else {
        this.$store.state.signUpInfo.cities.push(item.name);
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
      if (this.$store.state.signUpInfo.cities.includes(item)) {
        this.$store.state.signUpInfo.cities.splice(
          this.$store.state.signUpInfo.cities.indexOf(item), 1);
      } else {
        this.$store.state.signUpInfo.cities.push(item);
      }

      this.cities.forEach((city) => {
        /* eslint-disable */
        if (city.name === item) {
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
