<template>
  <!-- Search Button -->
  <button class="filters__button" @click="performSearch" v-scroll-to="{element: '#js__home__results', duration: 1000}">
    <img class="filters__button__image" src="../../../static/svg/search-white.svg" @click="performSearch" />
  </button>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapMutations } from 'vuex';

export default {
  name: 'searchButton',
  data() {
    return {
      search: 'Search',
    };
  },
  methods: {
    ...mapMutations([types.TOGGLE_SEARCH_FILTERS, types.UPDATE_SEARCH_RESULTS]),
    /*
      Hides the filter popup and removes the no-scroll class on the body
    */
    hideFilters() {
      this.TOGGLE_SEARCH_FILTERS(false);
      document.body.classList = '';
      document.body.classList.add('g__body__gray');
    },
    /*
      When the window resizes, adjust height of the filters to the window height
      This fixes issue with Chrome/other mobile browsers overflowing
    */
    onScreenResize() {
      document.querySelector('.filters').style.height = window.innerHeight;
    },
    /*
      Perform Search, passes all possible queries, empty ones won't affect response
    */
    performSearch() {
      /* reset the 'show more' options */
      this.$store.state.search.hideBasicCards = true;

      /* empty these on each search so premium info updates in card */
      this.$store.state.search.results = [];
      this.$store.state.search.loadingResults = true;
      this.$store.state.search.isResults = false;
      this.hideFilters();
      fetch(
        `${this.$config.default.api}/search` +
        `?state=${encodeURIComponent(this.$store.state.search.filterQueries.state.abbr)}` +
        `&city=${encodeURIComponent(this.$store.state.search.filterQueries.city.name)}` +
        `&company=${encodeURIComponent(this.$store.state.search.filterQueries.company.name)}` +
        `&industry=${encodeURIComponent(this.$store.state.search.filterQueries.industry.name)}`,
      ).then((data) => {
        data.json().then((users) => {
          /* check if there are users returned */
          if (users.users && (users.users.premiumStates.length > 0 ||
              users.users.premiumCities.length > 0 ||
              users.users.basic.length > 0)) {
            this.$store.state.search.isResults = true;
          }
          this.$store.state.search.loadingResults = false;
          this.UPDATE_SEARCH_RESULTS(users);
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.filters{
  /* Search Button */
  &__button{
    background: $blue;
    height: 50px;
    width: 50px;
    margin-right: 1rem;
    border-radius: $circle-radius;
    display: flex;
    justify-content: center;
    transition: background 0.25s ease-in-out;
    position: absolute;
    right: 0.5rem;
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
  &__controls{
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__text{
      font-size: 0.9rem;
      letter-spacing: 1px;
      color: $white;
      font-weight: 500;
      &:hover{
        cursor: pointer;
      }
    }
    &__close{
      height: 50px;
      width: 50px;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
</style>
