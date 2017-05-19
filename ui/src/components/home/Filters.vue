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
          <li v-for="tab in filterTabs" @click="selectFilter(tab)" :class="[{ 'filter-tabs__list__item--active': tab.active },'filter-tabs__list__item']">{{tab.name}}</li>
        </ul>
      </div>

      <!-- Filter Components -->
      <State v-if="filterTabs[0].active"/>
      <City v-if="filterTabs[1].active"/>
      <Company v-if="filterTabs[2].active"/>
      <Industry v-if="filterTabs[3].active"/>

      <!-- Search Button -->
      <button @click="performSearch" class="filters__search-button">{{search}}</button>
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
      filterTabs: [
        { name: 'state', active: true },
        { name: 'city', active: false },
        { name: 'company', active: false },
        { name: 'industry', active: false },
      ],
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
      this.filterTabs.forEach((tab) => {
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

.filters{
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: +1;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom right, $blue-grad-top-left, $blue-grad-bottom-right);
  // overflow-y: scroll;
  box-sizing:border-box;
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
  &--margin{
    margin-right: 1rem;
    margin-left: 1rem;
  }
  &__container{
    margin: 1rem 0;
    position: relative;
    min-height: 100%;
  }
  &__section{
    min-height: 200px;
    position: relative;
    &__input{
      height: 70px;
      width: calc(100% - 5rem);
      padding:0 1rem 0 4rem;
      font-family: $roboto;
      font-size: 1rem;
      background: transparent;
      color: $white;
      border-bottom: solid 1px $white-50;
      &::placeholder{
        color: $white-50;
        font-family: $roboto;
        font-style: italic;
        font-weight: 400;
        letter-spacing: 1px;
        font-size: 1rem;
      }
    }
    &__input-container{
      position: relative;
      width: 100%;
      &:after{
        content: '';
        position: absolute;
        left: 2rem;
        height: 20px;
        width: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: url('../../../static/svg/search-white.svg');
      }
    }
    &__list{
      list-style: none;
      &__item{
        margin: 0.25rem 0;
        padding: 1rem;
        color: $white;
        letter-spacing: 1px;
        font-weight: 300;
        transition: background 0.2s ease-in;
        position: relative;
        border-radius: $border-radius;
        &--selected{
          // background: $white-20;
          &:after{
            content: '';
            position: absolute;
            right: 1rem;
            height: 15px;
            width: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: url('../../../static/svg/check.svg');
          }
        }
        &:hover{
          cursor: pointer;
          background: $white-20;
        }
      }
    }
  }

  /* Search Button */
  &__search-button{
    width: 200px;
    position: fixed;
    padding: 1rem 0;
    right:0;
    bottom: 0px;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 300;
    transition: background 0.2s ease-in;
    background: $pink;
    text-decoration: none;
    color: $white;
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

/* FILTER TABS */
.filter-tabs{
  display: flex;
  width: 100%;
  &__list{
    display: inline-flex;
    justify-content: space-between;
    width: calc(100% - 4rem);
    margin: 2rem;
    &__item{
      list-style: none;
      text-align: center;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 1px;
      color: $white-50;
      position: relative;
      &:hover{
        cursor: pointer;
      }
      &--active{
        color: $white;
        &:after{
          content: '';
          position: absolute;
          background: $white;
          width: 100%;
          max-width: 80px;
          left: 0;
          right: 0;
          margin: 0 auto;
          left: 0;
          bottom: -1rem;
          height: 2px;
        }
      }
    }
  }
}
/* Active Class For Components */
.filter-tabs-content{
  display: none;
  &--active{
    display: block;
  }
}
</style>
