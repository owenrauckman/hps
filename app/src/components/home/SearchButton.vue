<template>
  <!-- Search Button -->
  <button class="filters__button" @click="performSearch" v-scroll-to="{element: '#js__home__results', duration: 3000}">
    <img class="filters__button__image" src="../../../static/svg/search-white.svg" @click="performSearch" />
  </button>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'searchButton',
  data() {
    return {
      search: 'Search',
    };
  },
  methods: {
    /*
      Hides the filter popup and removes the no-scroll class on the body
    */
    hideFilters() {
      this.$store.commit('toggleFilters', false);
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
      /* empty these on each search so premium info updates in card */
      this.$store.state.results = [];
      this.$store.state.loadingResults = true;
      this.$store.state.isResults = false;
      this.hideFilters();
      fetch(
        `${config.api}/search` +
        `?state=${encodeURIComponent(this.$store.state.filterQueries.state.abbr)}` +
        `&city=${encodeURIComponent(this.$store.state.filterQueries.city.name)}` +
        `&company=${encodeURIComponent(this.$store.state.filterQueries.company.name)}` +
        `&industry=${encodeURIComponent(this.$store.state.filterQueries.industry.name)}`,
      ).then((data) => {
        data.json().then((users) => {
          /* check if there are users returned*/
          if (users.users && users.users.length > 0) {
            this.$store.state.isResults = true;
          }
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
