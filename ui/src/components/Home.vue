<template>
  <div>
    <div class="home">
      <div class="home__container g__container">
        <h1 class="home__heading">Home Party Shows</h1>
        <h2 class="home__subheading">Find and build your direct sales team today.</h2>
        <div class="home__cta">
          <button class="home__cta__item home__cta__item--border">Sign Up Now</button>
          <button class="home__cta__item" v-scroll-to="{element: '#js__home__search', duration: 3000}">Start Your Search</button>
        </div>
        <div class="home__search__container">
          <Search class="home__search" id="js__home__search"/>
        </div>
      </div>
    </div>

    <!-- results, query and loading state -->
    <div class="home__results__info g__container">
      <div class="home__queries">
        <button class="home__queries__query" @click="removeQuery" id="js__query__state" v-if="$store.state.filterQueries.state.name.length > 0">{{$store.state.filterQueries.state.name}}</button>
        <button class="home__queries__query" @click="removeQuery" id="js__query__city" v-if="$store.state.filterQueries.city.name.length > 0">{{$store.state.filterQueries.city.name}}</button>
        <button class="home__queries__query" @click="removeQuery" id="js__query__company" v-if="$store.state.filterQueries.company.name.length > 0">{{$store.state.filterQueries.company.name}}</button>
        <button class="home__queries__query" @click="removeQuery" id="js__query__industry" v-if="$store.state.filterQueries.industry.name.length > 0">{{$store.state.filterQueries.industry.name}}</button>
      </div>
      <p v-if="$store.state.results.users" class="home__results__info__text g__container">Showing {{$store.state.results.users.length}} of {{$store.state.results.users.length}} results</p>
    </div>
    <p :class="[{ 'home__loading--active': $store.state.loadingResults }, 'home__loading g__container']">Loading...</p>
    <div class="home__card-container g__container" id="js__home__results">
      <Card v-for="card in $store.state.results.users" :key="card.plan" :options="card"/>
    </div>
    <!-- end results and loading state -->

  </div>
</template>

<script>
import Card from './home/Card';
import Search from './home/Search';

const config = require('../../config/appConfig.json');

export default {
  name: 'home',
  components: { Card, Search },
  data() {
    return {
      loading: 'Loading...',
    };
  },
  mounted() {
    document.body.classList.add('g__body__gray');
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
@import '../sass/main.scss';

.home{
  width: 100%;
  height: auto;
  padding: 4rem 0 1.5rem 0;
  position: relative;
  background-image: url('../../static/img/hero.jpg');
  background-position: center;
  &:before{
    top: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    content: '';
    background: linear-gradient(to bottom right, transparentize($orange, 0.05), transparentize($red-orange, 0.05));
  }
  &__container{
    margin: calc(100px + 2rem) auto 4rem auto;
  }
  &__heading{
    font-family: $rubik;
    font-weight: 500;
    color: $white;
    text-align: center;
    letter-spacing: 1px;
    font-size: 2rem;
  }
  &__subheading{
    font-weight: 300;
    color: $white;
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: 1px;
    margin: 1.5rem auto;
    max-width: 380px;
  }
  &__cta{
    margin: 2rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &__item{
      color: $white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 1rem;
      font-size: 0.8rem;
      &:hover{
        cursor: pointer;
      }
      &--border{
        border: solid 1px $white;
        border-radius: $round-radius;
        padding: 1rem 2rem;
        transition: all 0.25s ease-in-out;
        &:hover{
          background: $white;
          color: $orange;
        }
      }
    }
  }
  &__search{
    position: absolute;
    width: 100%;
    bottom: -7rem;
    display: flex;
    justify-content: center;
    &__container{
      bottom: 0;
      position: relative;
      max-width: calc(768px - 2rem);
      margin: 0 auto;
    }
  }
  &__card-container{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0rem auto 1rem auto;
  }
  &__loading{
    display: none;
    color: $gray-medium;
    padding: 0 2rem 0 4rem;
    &--active{
      display: block;
    }
  }
  &__results__info{
    margin: 4rem auto 1rem auto;
    padding: 0 2rem 0 4rem;
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
    margin: 0 auto;
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
      display: none;
      @include breakpoint(phone){
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
        background: url('../../static/svg/close-dark.svg');
        transition: background 0.25s ease-in-out;
      }
      &:hover{
        background: $gray-light;
        color: $white;
        border: solid 1px transparent;
        cursor: pointer;
        &:after{
          background: url('../../static/svg/close-light.svg');
        }
      }
    }
  }
}
</style>
