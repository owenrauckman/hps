<template>
  <div>
    <!-- results, query and loading state -->
    <div class="results__results__info g__container" id="js__home__results">
      <div class="results__queries">
        <button class="results__queries__query" @click="removeQuery" id="js__query__state" v-if="filterQueries.state.name.length > 0">{{filterQueries.state.name}}</button>
        <button class="results__queries__query" @click="removeQuery" id="js__query__city" v-if="filterQueries.city.name.length > 0">{{filterQueries.city.name}}</button>
        <button class="results__queries__query" @click="removeQuery" id="js__query__company" v-if="filterQueries.company.name.length > 0">{{filterQueries.company.name}}</button>
        <button class="results__queries__query" @click="removeQuery" id="js__query__industry" v-if="filterQueries.industry.name.length > 0">{{filterQueries.industry.name}}</button>
      </div>
      <!-- <p v-if="results.users && isResults" class="results__results__info__text g__container">Showing {{results.users.length}} of {{results.users.length}} results</p> -->
    </div>
    <div :class="[{ 'results__loading--active': loadingResults }, 'results__loading g__container']">
      <div class='results__loading__dot results__loading__dot__1'></div>
      <div class='results__loading__dot results__loading__dot__2'></div>
      <div class='results__loading__dot results__loading__dot__3'></div>
      <div class='results__loading__dot results__loading__dot__4'></div>
    </div>
    <div v-if="isResults && results.users" class="results__card-container g__container" id="js__results__results">
      <Card v-for="card in results.users.premiumStates" :key="card.plan" :options="card"/>
      <Card v-for="card in results.users.premiumCities" :key="card.plan" :options="card"/>
      <Card v-for="card in results.users.basic" :key="card.plan" :options="card" :class="[{ 'results__basic-cards--hidden': hideBasicCards }, 'results__basic-cards']" /></span>
    </div>
    <div v-else class="results__no-results-container g__container">
      <div>
        <p class="results__no-results-container__text">It looks like there are no consultants in this area. Want to secure your spot?</p>
        <router-link to="signup" class="results__no-results-container__link">Sign up today</router-link>
      </div>
    </div>
    <!-- Button for showing non premium users -->
    <div class="results__no-results-container g__container" v-if="results.users && results.users.basic && results.users.basic.length > 0">
      <button @click="showBasic()" class="results__no-results-container__link">
        <span v-if="hideBasicCards">View </span>
        <span v-else>Hide </span>
        Non-Premium Users
      </button>
    </div>
    <!-- end results and loading state -->

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapGetters, mapMutations } from 'vuex';
import Card from './Card';

export default {
  name: 'results',
  components: { Card },
  computed: {
    ...mapGetters(['loadingResults', 'results', 'isResults', 'hideBasicCards', 'filterQueries', 'filterTabs']),
  },
  methods: {
    ...mapMutations([types.UPDATE_SEARCH_RESULTS]),
    /*
      Removes element from query and performs a new search
    */
    removeQuery(e) {
      switch (e.target.id) {
        case 'js__query__state':
          this.filterQueries.state = { name: '', abbr: '', active: false }; break;
        case 'js__query__city':
          this.filterQueries.city = { name: '', active: false }; break;
        case 'js__query__company':
          this.filterQueries.company = { name: '', active: false }; break;
        case 'js__query__industry':
          this.filterQueries.industry = { name: '', active: false }; break;
        default:
          break;
      }
      this.performSearch();
    },

    /*
      On Click this shows the basic cards
    */
    showBasic() {
      this.hideBasicCards = !this.hideBasicCards;
    },

    /*
      Perform Search, passes all possible queries, empty ones won't affect response
    */
    performSearch() {
      /* reset the 'show more' options */
      this.hideBasicCards = true;

      /* empty these on each search so premium info updates in card */
      this.results = [];
      this.loadingResults = true;
      this.isResults = false;
      fetch(
        `${this.$config.default.api}/search` +
        `?state=${encodeURIComponent(this.filterQueries.state.abbr)}` +
        `&city=${encodeURIComponent(this.filterQueries.city.name)}` +
        `&company=${encodeURIComponent(this.filterQueries.company.name)}` +
        `&industry=${encodeURIComponent(this.filterQueries.industry.name)}`,
      )
      .then((data) => {
        data.json().then((users) => {
          /* check if there are users returned */
          if (users.users && (users.users.premiumStates.length > 0 ||
              users.users.premiumCities.length > 0 ||
              users.users.basic.length > 0)) {
            this.isResults = true;
          }
          this.loadingResults = false;
          this.types.UPDATE_SEARCH_RESULTS(users);
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
  &__basic-cards{
    display: flex;
    &--hidden{
      display: none !important;
    }
  }
  &__card-container{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0rem auto 1rem auto;
  }
  &__no-results-container{
    padding: 0 1rem 1rem 1rem;
    display: block;
    margin: 0rem auto 1rem auto;
    width: calc(100% - 2rem);
    text-align: center;
    &__text{
      display: block;
      margin-bottom: 1rem;
    }
    &__link{
      display: inline-block;
      color: $blue;
      width: auto;
      border-radius: $round-radius;
      padding: 0.5rem 1rem;
      border: solid 1px $blue;
      text-decoration: none;
      transition: all 0.25s ease-in-out;
      &:hover{
        background: $blue;
        color: $white;
        cursor: pointer;
      }
    }
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
