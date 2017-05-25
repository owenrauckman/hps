<template>
  <div class="filters">

    <!-- Clear and X controls -->
    <div class="filters__container">
      <div class="filters__controls filters--margin">
        <button @click="hideFilters" class="filters__controls__close">
          <img src="../../../static/svg/close.svg"/>
        </button>
        <button class="filters__controls__text" @click="clearFilters">Clear All</button>
      </div>

      <!-- Tabs -->
      <div class="filter-tabs">
        <ul class="filter-tabs__list">
          <li v-for="tab in $store.state.filterTabs" @click="selectFilter(tab)" :class="[{ 'filter-tabs__list__item--active': tab.active },'filter-tabs__list__item']">{{tab.name}}</li>
        </ul>
      </div>

      <!-- Filter Components -->
      <State v-if="$store.state.filterTabs[0].active"/>
      <City v-if="$store.state.filterTabs[1].active"/>
      <Company v-if="$store.state.filterTabs[2].active"/>
      <Industry v-if="$store.state.filterTabs[3].active"/>
    </div>

  </div>
</template>

<script>
import State from './State';
import City from './City';
import Company from './Company';
import Industry from './Industry';

const config = require('../../../config/appConfig.json');

export default {
  name: 'filters',
  components: { State, City, Company, Industry },
  data() {
    return {
      search: 'Search',
    };
  },
  mounted() {
    window.onresize = this.onScreenResize();
  },
  props: ['options'],
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
      Clear Filters for all components and remove selected classes for them
    */
    clearFilters() {
      this.$store.commit('updateStateQuery', { name: '', abbr: '', active: false });
      this.$store.commit('updateCityQuery', { name: '', active: false });
      this.$store.commit('updateCompanyQuery', { name: '', active: false });
      this.$store.commit('updateIndustryQuery', { name: '', active: false });
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
    /*
      Makes selected tab active which mounts the component based on v-if
    */
    selectFilter(tab) {
      /* eslint-disable */
      this.$store.state.filterTabs.forEach((tab) => {
        tab.active = false;
      });
      tab.active = true;
      /* eslint-enable */
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';
//
// .filters{
//   &__container{
//     background: red;
//   }
//   &__controls{
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     &__text{
//       font-size: 0.9rem;
//       letter-spacing: 1px;
//       color: $white;
//       font-weight: 500;
//       &:hover{
//         cursor: pointer;
//       }
//     }
//     &__close{
//       height: 50px;
//       width: 50px;
//       &:hover{
//         cursor: pointer;
//       }
//     }
//   }
// }
//
// /* FILTER TABS */
// .filter-tabs{
//   display: flex;
//   width: 100%;
//   &__list{
//     display: inline-flex;
//     justify-content: space-between;
//     width: calc(100% - 4rem);
//     margin: 2rem;
//     &__item{
//       list-style: none;
//       text-align: center;
//       font-weight: 500;
//       text-transform: uppercase;
//       font-size: 0.7rem;
//       letter-spacing: 1px;
//       color: $white-50;
//       position: relative;
//       &:hover{
//         cursor: pointer;
//       }
//       &--active{
//         color: $white;
//         &:after{
//           content: '';
//           position: absolute;
//           background: $white;
//           width: 100%;
//           max-width: 80px;
//           left: 0;
//           right: 0;
//           margin: 0 auto;
//           left: 0;
//           bottom: -1rem;
//           height: 2px;
//         }
//       }
//     }
//   }
// }
// /* Active Class For Components */
// .filter-tabs-content{
//   display: none;
//   &--active{
//     display: block;
//   }
// }
</style>
