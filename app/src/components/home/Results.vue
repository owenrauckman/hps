<template>
  <div>
    <!-- results, query and loading state -->
    <div class="results__results__info g__container" id="js__home__results">
      <div class="results__queries">
        <button class="results__queries__query" @click="removeQuery" id="js__query__state" v-if="$store.state.filterQueries.state.name.length > 0">{{$store.state.filterQueries.state.name}}</button>
        <button class="results__queries__query" @click="removeQuery" id="js__query__city" v-if="$store.state.filterQueries.city.name.length > 0">{{$store.state.filterQueries.city.name}}</button>
        <button class="results__queries__query" @click="removeQuery" id="js__query__company" v-if="$store.state.filterQueries.company.name.length > 0">{{$store.state.filterQueries.company.name}}</button>
        <button class="results__queries__query" @click="removeQuery" id="js__query__industry" v-if="$store.state.filterQueries.industry.name.length > 0">{{$store.state.filterQueries.industry.name}}</button>
      </div>
      <p v-if="$store.state.results.users" class="results__results__info__text g__container">Showing {{$store.state.results.users.length}} of {{$store.state.results.users.length}} results</p>
    </div>
    <div :class="[{ 'results__loading--active': $store.state.loadingResults }, 'results__loading g__container']">
      <div class='results__loading__dot results__loading__dot__1'></div>
      <div class='results__loading__dot results__loading__dot__2'></div>
      <div class='results__loading__dot results__loading__dot__3'></div>
      <div class='results__loading__dot results__loading__dot__4'></div>
    </div>
    <div class="results__card-container g__container" id="js__results__results">
      <Card v-for="card in $store.state.results.users" :key="card.plan" :options="card"/>
    </div>
    <!-- end results and loading state -->

  </div>
</template>

<script>
import Card from './Card';

const config = require('../../../config/appConfig.json');

export default {
  name: 'results',
  components: { Card },
  data() {
    return {
      loading: 'Loading...',
    };
  },
  methods: {
    /*
      Removes element from query and performs a new search
    */
    removeQuery(e) {
      switch (e.target.id) {
        case 'js__query__state':
          this.$store.state.filterQueries.state = { name: '', abbr: '', active: false }; break;
        case 'js__query__city':
          this.$store.state.filterQueries.city = { name: '', active: false }; break;
        case 'js__query__company':
          this.$store.state.filterQueries.company = { name: '', active: false }; break;
        case 'js__query__industry':
          this.$store.state.filterQueries.industry = { name: '', active: false }; break;
        default:
          break;
      }
      this.performSearch();
    },

    /*
      Perform Search, passes all possible queries, empty ones won't affect response
    */
    performSearch() {
      /* empty these on each search so premium info updates in card */
      this.$store.state.results = [];
      this.$store.state.loadingResults = true;
      fetch(
        `${config.api}/search` +
        `?state=${encodeURIComponent(this.$store.state.filterQueries.state.abbr)}` +
        `&city=${encodeURIComponent(this.$store.state.filterQueries.city.name)}` +
        `&company=${encodeURIComponent(this.$store.state.filterQueries.company.name)}` +
        `&industry=${encodeURIComponent(this.$store.state.filterQueries.industry.name)}`,
      ).then((data) => {
        data.json().then((users) => {
          this.$store.state.loadingResults = false;
          this.$store.commit('updateResults', users);
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';

.results{
  &__card-container{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0rem auto 1rem auto;
  }
  &__loading{
    display: none;
    margin: 2rem 0;
    height: 50px;
    width: 100%;
    overflow: hidden;
    &--active{
      display: block;
    }
    &__dot{
      width: 10px;
      height: 10px;
      background: $blue;
      border-radius: 5px;
      position: absolute;
      top: 10px;
      left: -10%;
      &__1{ animation: dotslide 2s infinite cubic-bezier(0.2,.8,.8,0.2); }
      &__2{ animation: dotslide 2s .2s infinite cubic-bezier(0.2,.8,.8,0.2); }
      &__3{ animation: dotslide 2s .4s infinite cubic-bezier(0.2,.8,.8,0.2); }
      &__4{ animation: dotslide 2s .6s infinite cubic-bezier(0.2,.8,.8,0.2); }
    }
  }
  &__results__info{
    margin: 4rem auto 1rem auto;
    padding: 0 2rem;
    @include breakpoint(desktop){
      padding: 0 2rem 0 4rem;
    }
    &__text{
      font-weight: 300;
      font-style: italic;
      font-size: 0.9rem;
      color: $gray-medium;
      transition: color 0.5s ease-in-out;
      margin: 1rem 0;
      &--active{
        color: $gray-light;
      }
    }
  }
  &__queries{
    max-width: calc(768px - 4rem);
    margin: 0 auto 2rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    text-align: left;
    &__query{
      border: solid 1px $gray-light;
      padding: 0.5rem 2rem 0.5rem 1rem;
      border-radius: $round-radius;
      color: $gray-medium;
      position: relative;
      transition: all 0.25s ease-in-out;
      margin: 0 0.5rem;
      display: none;
      @include breakpoint(tablet){
        display: block;
        flex: 0 0 auto;
      }
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
}
</style>
