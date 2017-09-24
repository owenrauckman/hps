<template>
  <div class="filters">
    <div class="filters__content">
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
      </div>

    </div>

    <!-- Filter Components -->
    <State v-if="filterTabs[0].active"/>
    <City v-if="filterTabs[1].active"/>
    <Company v-if="filterTabs[2].active"/>
    <Industry v-if="filterTabs[3].active"/>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapGetters, mapMutations } from 'vuex';

import State from './State';
import City from './City';
import Company from './Company';
import Industry from './Industry';

export default {
  components: { State, City, Company, Industry },
  data() {
    return {
      search: 'Search',
    };
  },
  mounted() {
    window.onresize = this.onScreenResize();
  },
  computed: {
    ...mapGetters(['filterTabs']),
  },
  props: ['options'],
  methods: {
    ...mapMutations([types.TOGGLE_SEARCH_FILTERS, types.SET_SEARCH_QUERY, types.SET_FILTER_TAB]),
    /*
      Hides the filter popup and removes the no-scroll class on the body
    */
    hideFilters() {
      this.types.TOGGLE_SEARCH_FILTERS(false);
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
      this.types.SET_SEARCH_QUERY('state', { name: '', abbr: '', active: false });
      this.types.SET_SEARCH_QUERY('city', { name: '', abbr: '', active: false });
      this.types.SET_SEARCH_QUERY('company', { name: '', abbr: '', active: false });
      this.types.SET_SEARCH_QUERY('industry', { name: '', abbr: '', active: false });
    },
    /*
      Makes selected tab active which mounts the component based on v-if
    */
    selectFilter(tab) {
      this.types.SET_FILTER_TAB(tab);
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.filters{
  &__content{
    background: linear-gradient(to bottom right, $orange, $red-orange);
    padding: 2rem 0;
    height: 150px;
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
