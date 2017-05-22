<template>
  <!-- Search Button -->
  <button @click="performSearch" class="filters__search-button">{{search}}</button>
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
    },
    /*
      When the window resizes, adjust height of the filters to the window height
      This fixes issue with Chrome/other mobile browsers overflowing
    */
    onScreenResize() {
      document.querySelector('.filters').style.height = window.innerHeight;
    },
    /*
      scroll back to the top of the page on input blurs to avoid UI issue
    */
    scrollTop() {
      document.body.scrollTop = 0;
    },
    /*
      Perform Search, passes all possible queries, empty ones won't affect response
    */
    performSearch() {
      /* empty these on each search so premium info updates in card */
      this.$store.state.results = [];
      this.$store.state.loadingResults = true;
      this.hideFilters();
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

<style scoped lang="scss">
@import '../../sass/main.scss';

.filters{
  /* Search Button */
  &__search-button{
    width: 100px;
    height: 40px;
    bottom: -20px;
    position: absolute;
    right: 2rem;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 300;
    transition: background 0.2s ease-in;
    background: $pink;
    text-decoration: none;
    color: $white;
    border-radius: $border-radius;
    &:hover{
      cursor: pointer;
      background: lighten($pink, 5%);
      text-decoration: none;
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
