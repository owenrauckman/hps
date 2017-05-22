<template>
  <div class="search">
    <div class="search__wrapper" @click="toggleFilters">
      <img class="search__wrapper__image" src="../../../static/svg/search.svg"/>
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
    </div>
    <p v-if="$store.state.results.users" class="search__results-text">Showing {{$store.state.results.users.length}} of {{$store.state.results.users.length}} results</p>

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
      /* set the active filter based on click */
      this.activateChosenFilter(e);
      this.$store.commit('toggleFilters', true);
      this.showFiltersLocation = !this.showFiltersLocation;
      document.body.classList.add('no-overflow');
      document.body.scrollTop = 0; /* scroll to top to avoid cut off issues */
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
    border-radius: $border-radius;
    border: solid 1px $gray-light;
    margin: 0 0 1rem 0;
    padding: 1rem;
    position: relative;
    display: flex;
    align-items: center;
    max-width: 768px;
    align-self: flex-start;
    @include breakpoint(tablet){
      padding: 0;
    }
    &:hover{
      cursor: pointer;
    }
    &__image{
      width: 20px;
      height: 20px;
      margin-right: 1rem;
      @include breakpoint(tablet){
        margin: 0 1rem;
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
          padding: 1rem 0;
          text-align: center;
          border-left: solid 1px $gray-light;
          &:first-child{
            border-left: none;
          }
        }
      }
    }
  }
  &__results-text{
    font-weight: 300;
    font-style: italic;
    font-size: 0.9rem;
    color: $gray-medium;
    transition: color 0.5s ease-in-out;
    margin: 1.5rem 0;
    &--active{
      color: $gray-light;
    }
  }
}

</style>
