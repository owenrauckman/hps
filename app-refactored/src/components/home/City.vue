<template>
  <div class="city">
      <div class="filters__section">

        <div class="filters__section__input-container">
          <div class="filters__section__input-wrapper">
            <input class="filters__section__input" :keyup="checkForEmptyInput()" :placeholder="citySearchPlaceholder" v-model="$store.state.filterQueries.city.name">
            <SearchButton/>
          </div>
        </div>

        <p v-if="needState" class="filter-required">{{needStateMessage}}</p>
        <ul class="filters__section__list filters--margin">
          <li v-for="city in filterBy(cities, $store.state.filterQueries.city.name, 'name')" @click="selectCity(city)" :class="[{ 'filters__section__list__item--selected':city.active },'filters__section__list__item']">{{city.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import SearchButton from './SearchButton';

const config = require('../../../config/appConfig.json');

export default {
  name: 'city',
  data() {
    return {
      citySearchPlaceholder: 'Search By City',
      cities: [],
      needState: false,
      needStateMessage: '*Please Select a State before continuing your search.',
    };
  },
  components: { SearchButton },
  mounted() {
    if (this.$store.state.filterQueries.state.name.length === 0) {
      this.needState = true;
    } else {
      this.needState = false;
      this.getCities(this.$store.state.filterQueries.state.abbr).then(() => {
        this.selectCity(this.$store.state.filterQueries.city);
      });
    }
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
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectCity(item) {
      this.cities.forEach((city) => {
        /* eslint-disable */
        if (city.name === item.name) {
          city.active = !city.active;
        } else {
          city.active = false;
        }
        /* eslint-enable */
      });

      if (item.active) {
        this.$store.commit('updateCityQuery', { name: item.name, active: true });
      } else {
        this.$store.commit('updateCityQuery', { name: '', active: false });
      }
    },
    /*
      Checks if input is empty, if so, sets all cities to inactive class (removes check)
    */
    checkForEmptyInput() {
      if (this.$store.state.filterQueries.city.name.length === 0) {
        this.cities.forEach((city) => {
          /* eslint-disable */
          city.active = false;
          /* eslint-enable */
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

/* these need to be local in each component for some reason */
.filters__section__list__item--selected{
  &:after{
    background: url('../../../static/svg/verified-black.svg');
  }
}

</style>
