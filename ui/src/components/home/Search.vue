<template>
  <div class="search">
    <div class="search__wrapper" @click="toggleFilters">
      <div class="search__wrapper__content">
        <p class="search__wrapper__heading">
          <span class="search__wrapper__heading__mobile">{{startSearch}}</span>
          <div class="search__wrapper__heading__desktop">
            <div class="search__wrapper__heading__desktop__item" id="js__search-tab__state">{{searchType.state}}</div>
            <div class="search__wrapper__heading__desktop__item" id="js__search-tab__city">{{searchType.city}}</div>
            <div class="search__wrapper__heading__desktop__item" id="js__search-tab__company">{{searchType.company}}</div>
            <div class="search__wrapper__heading__desktop__item" id="js__search-tab__industry">{{searchType.industry}}</div>
          </div>
        </p>
      </div>
      <button class="search__wrapper__button" id="js__search__wrapper__button" v-scroll-to="{element: '#js__home__results', duration: 3000}" >
        <img class="search__wrapper__button__image" src="../../../static/svg/search-white.svg" id="js__search__wrapper__button__image" />
      </button>
    </div>
    <Filters :class="[{ 'filter--show': $store.state.filtersVisible },'filter']"/>
  </div>
</template>

<script>
import Filters from './Filters';

const config = require('../../../config/appConfig.json');

export default {
  name: 'search',
  components: { Filters },
  data() {
    return {
      startSearch: 'Start Your Search',
      startSearchDescription: 'Location, Company, or Industry',
      searchType: {
        state: 'State',
        city: 'City',
        company: 'Company',
        industry: 'Industry',
      },
    };
  },
  mounted() {
    this.performPremiumSearch();
  },
  methods: {
    /*
      Toggles the filters overlay
      @param {e} - the event object
    */
    toggleFilters(e) {
      /* ignore this if user clicks the search button */
      if (e.target.id === 'js__search__wrapper__button' ||
          e.target.id === 'js__search__wrapper__button__image') {
        this.performSearch();
      } else {
        /* set the active filter based on click */
        this.activateChosenFilter(e);
        this.$store.commit('toggleFilters', true);
        this.showFiltersLocation = !this.showFiltersLocation;
        document.body.classList.add('no-overflow');
        document.documentElement.scrollTop = 0; /* firefox */
        document.body.scrollTop = 0;
      }
    },

    /*
      Activates a specific filter (and disables othres) based on event
      @param {e} - the event object
    */
    activateChosenFilter(e) {
      /* eslint-disable */
      this.$store.state.filterTabs.forEach((tab)=>{
        tab.active = false;
      })
      /* eslint-enable */
      switch (e.target.id) {
        case 'js__search-tab__state':
          this.$store.state.filterTabs[0].active = true; break;
        case 'js__search-tab__city':
          this.$store.state.filterTabs[1].active = true; break;
        case 'js__search-tab__company':
          this.$store.state.filterTabs[2].active = true; break;
        case 'js__search-tab__industry':
          this.$store.state.filterTabs[3].active = true; break;
        default:
          this.$store.state.filterTabs[0].active = true;
      }
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

    /*
      Perform Initial Search - Gets Random Premium Users
    */
    performPremiumSearch() {
      /* empty these on each search so premium info updates in card */
      this.$store.state.results = [];
      this.$store.state.loadingResults = true;
      fetch(
        `${config.api}/search/premium`,
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

<style scoped lang="scss">
@import '../../sass/main.scss';

.search{
  &__wrapper{
    background: $white;
    border-radius: $round-radius;
    box-shadow: $box-shadow;
    margin: 0 0 1rem 0;
    padding: 1rem 0;
    position: relative;
    display: flex;
    align-items: center;
    width: calc(100% - 2rem);
    align-self: flex-start;
    &:hover{
      cursor: pointer;
    }
    &__button{
      background: $blue;
      height: 50px;
      width: 50px;
      margin-right: 1rem;
      border-radius: $circle-radius;
      display: flex;
      justify-content: center;
      transition: background 0.25s ease-in-out;
      &:hover{
        cursor: pointer;
        background: darken($blue, 10%);
      }
      &__image{
        width: 20px;
        height: 20px;
        display: block;
        flex: 1;
      }
    }
    &__content{
      width: calc(100% - 20px - 1rem); // see above
    }
    &__heading{
      font-size: 0.9rem;
      color: $gray-dark;
      letter-spacing: 1px;
      margin-bottom: 0rem;
      &__mobile{
        display: block;
        margin-left: 2rem;
        @include breakpoint(tablet){
          display: none;
        }
      }
      &__desktop{
        display: none;
        @include breakpoint(tablet){
          display: flex;
          width: 100%;
        }
        &__item{
          flex: 1;
          text-align: center;
          border-left: solid 1px $gray-light;
          &:first-child{
            border-left: none;
          }
        }
      }
    }
  }
}

</style>
