<template>
  <div class="city">
      <div class="filters__section">
        <div class="filters__section__input-container">
          <input class="filters__section__input" :placeholder="citySearchPlaceholder" v-model="$store.state.filterQueries.city">
        </div>
        <ul class="filters__section__list filters--margin">
          <li v-for="city in filterBy(cities, $store.state.filterQueries.city, 'name')" @click="selectCity(city)" :class="[{ 'filters__section__list__item--selected':city.active },'filters__section__list__item']">{{city.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'city',
  data() {
    return {
      citySearchPlaceholder: 'Search By City',
      cities: [],
    };
  },
  mounted() {
    this.getCities(this.$store.state.filterQueries.state.abbr);
  },
  methods: {
    /*
      Get list of state that a user can search by
    */
    getCities(state) {
      fetch(`${config.api}/search/cities?state=${state}`).then((data) => {
        data.json().then((cities) => {
          const newCities = [];
          /* eslint-disable */
          cities.forEach((city) => {
            newCities.push({name: city, active: false});
          });
          /* eslint-enable */
          this.cities = newCities;
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
          item.active = !item.active;
        } else {
          city.active = false;
        }
        /* eslint-enable */
      });

      if (item.active) {
        this.$store.commit('updateCityQuery', item.name);
      } else {
        this.$store.commit('updateCityQuery', '');
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.filters{
  &--margin{
    margin-right: 1rem;
    margin-left: 1rem;
  }
  &__container{
    margin: 1rem 0;
    position: relative;
    min-height: 100%;
  }
  &__section{
    min-height: 200px;
    position: relative;
    &__input{
      height: 70px;
      width: calc(100% - 5rem);
      padding:0 1rem 0 4rem;
      font-family: $roboto;
      font-size: 1rem;
      background: transparent;
      color: $white;
      border-bottom: solid 1px $white-50;
      &::placeholder{
        color: $white-50;
        font-family: $roboto;
        font-style: italic;
        font-weight: 400;
        letter-spacing: 1px;
        font-size: 1rem;
      }
    }
    &__input-container{
      position: relative;
      width: 100%;
      &:after{
        content: '';
        position: absolute;
        left: 2rem;
        height: 20px;
        width: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: url('../../../static/svg/search-white.svg');
      }
    }
    &__list{
      list-style: none;
      overflow-y: auto;
      max-height: 100vh;
      &::-webkit-scrollbar {
        display: none;
      }
      &__item{
        margin: 0.25rem 0;
        padding: 1rem;
        color: $white;
        letter-spacing: 1px;
        font-weight: 300;
        transition: background 0.2s ease-in;
        position: relative;
        border-radius: $border-radius;
        &--selected{
          // background: $white-20;
          &:after{
            content: '';
            position: absolute;
            right: 1rem;
            height: 15px;
            width: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: url('../../../static/svg/check.svg');
          }
        }
        &:hover{
          cursor: pointer;
          background: $white-20;
        }
      }
    }
  }
}
</style>
