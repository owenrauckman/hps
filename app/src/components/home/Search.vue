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
      <button class="search__wrapper__button" id="js__search__wrapper__button" v-scroll-to="{element: '#js__home__results', duration: 1000}" >
        <img class="search__wrapper__button__image" src="../../../static/svg/search-white.svg" id="js__search__wrapper__button__image" />
      </button>
    </div>
    <Filters :class="[{ 'filter--show': filtersVisible },'filter']"/>
  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapMutations, mapGetters } from 'vuex';
import Filters from './Filters';

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
  computed: {
    ...mapGetters(['isLoggedIn', 'filtersVisible', 'loadingResults', 'results', 'isResults', 'hideBasicCards', 'filterQueries', 'filterTabs']),
  },
  methods: {
    ...mapMutations([
      types.UPDATE_SEARCH_RESULTS,
      types.TOGGLE_SEARCH_FILTERS,
      types.SET_LOADING_STATE,
      types.SET_RESULTS_STATUS, types.HIDE_BASIC_CARDS, types.ACTIVATE_CHOSEN_FILTER]),
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
        this.types.TOGGLE_SEARCH_FILTERS(true);
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
      this.ACTIVATE_CHOSEN_FILTER(e.target.id);
    },

    /*
      Perform Search, passes all possible queries, empty ones won't affect response
    */
    performSearch() {
      /* reset the 'show more' options */
      this.HIDE_BASIC_CARDS(true);

      /* empty these on each search so premium info updates in card */
      this.UPDATE_SEARCH_RESULTS([]);
      this.SET_LOADING_STATE(true);
      this.SET_RESULTS_STATUS(false);
      fetch(
        `${this.$config.default.api}/search` +
        `?state=${encodeURIComponent(this.filterQueries.state.abbr)}` +
        `&city=${encodeURIComponent(this.filterQueries.city.name)}` +
        `&company=${encodeURIComponent(this.filterQueries.company.name)}` +
        `&industry=${encodeURIComponent(this.filterQueries.industry.name)}`,
      ).then((data) => {
        data.json().then((users) => {
          /* check if there are users returned */
          if (users.users && (users.users.premiumStates.length > 0 ||
              users.users.premiumCities.length > 0 ||
              users.users.basic.length > 0)) {
            this.SET_RESULTS_STATUS(true);
          }

          this.SET_LOADING_STATE(false);
          this.UPDATE_SEARCH_RESULTS(users);
        });
      });
    },

    /*
    Checks to see if a user object exists in array
    @param {array} - list of users to check against
    @param {object} - the object that is being checked
  */
    userExists(arr, user) {
      /* eslint-disable */
      return arr.some(el => el._id === user._id);
      /* eslint-enable */
    },

    /*
      Perform Initial Search - Gets Random Premium Users
    */
    performPremiumSearch() {
      let url = `${this.$config.default.api}/search/premium`;
      /* normally premium is searched, unless query already exists, we go back */
      if (this.filterQueries.state.name !== '') {
        url = `${this.$config.default.api}/search` +
        `?state=${encodeURIComponent(this.filterQueries.state.abbr)}` +
        `&city=${encodeURIComponent(this.filterQueries.city.name)}` +
        `&company=${encodeURIComponent(this.filterQueries.company.name)}` +
        `&industry=${encodeURIComponent(this.filterQueries.industry.name)}`;
      }
      /* empty these on each search so premium info updates in card */
      this.UPDATE_SEARCH_RESULTS([]);
      this.SET_LOADING_STATE(true);
      fetch(
        url,
      ).then((data) => {
        data.json().then((users) => {
          this.SET_LOADING_STATE(false);
          this.UPDATE_SEARCH_RESULTS(users);
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
