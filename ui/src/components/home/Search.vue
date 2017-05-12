<template>
  <div class="search-wrapper">
    <div class="search">
      <div class="search-container" @click="toggleSearchDetails">
        <p class="search__heading">{{startSearch}}</p>
        <p :class="[{ 'search__description--active': showDetails },'search__description']">{{startSearchDescription}}</p>
        <img :class="[{ 'search__arrow--active': showDetails },'search__arrow']" src="../../../static/svg/arrow.svg"/>
      </div>
      <div :class="[{ 'search__details--active': showDetails },'search__details']">
        <div @click="toggleFilters" class="search__details__section" id="js__search__details__section--location">
          <p class="search__heading">{{selectLocation}}</p>
          <p class="search__description" v-if="selectedLocation==''">{{selectLocationDescription}}</p>
          <img class="search__details__section__arrow" src="../../../static/svg/arrow.svg"/>
        </div>
        <div @click="toggleFilters" class="search__details__section" id="js__search__details__section--company">
          <p class="search__heading">{{selectCompany}}</p>
          <p class="search__description" v-if="selectedCompany==''">{{selectCompanyDescription}}</p>
          <img class="search__details__section__arrow" src="../../../static/svg/arrow.svg"/>
        </div>
      </div>
    </div>
    <p :class="[{ 'search-wrapper__results-text--active': showDetails },'search-wrapper__results-text']">Showing 4 of 7 results</p>

    <Filters :class="[{ 'filter--show': $store.state.filtersVisible },'filter']" :options="{searchType: searchType}"/>

  </div>
</template>

<script>
import Filters from './Filters';

export default {
  name: 'search',
  components: { Filters },
  data() {
    return {
      startSearch: 'Start Your Search',
      startSearchDescription: 'Location, Company, or Industry',
      selectLocation: 'Select a Location',
      selectLocationDescription: 'Search by City, State, or Zip',
      selectCompany: 'Select a Company/Industry',
      selectCompanyDescription: 'Search by Company or Industry',
      selectedLocation: '',
      selectedCompany: '',
      showDetails: false,
      showFiltersLocation: false,
      searchType: 'location',
    };
  },
  methods: {
    /*
      Toggles the search details unless details are clicked on
      @param {e} - the event object
    */
    toggleSearchDetails(e) {
      if (!e.currentTarget.classList.contains('search__details')) {
        this.showDetails = !this.showDetails;
      }
    },
    /*
      Toggles the filters overlay
      @param {e} - the event object
    */
    toggleFilters(e) {
      // todo logic for which filter to show
      if (e.currentTarget.id === 'js__search__details__section--location') {
        this.searchType = 'location';
      } else if (e.currentTarget.id === 'js__search__details__section--company') {
        this.searchType = 'company';
      }
      this.showFiltersLocation = !this.showFiltersLocation;
      this.$store.commit('toggleFilters', true);
      document.body.classList.add('no-overflow');
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.search{
  background: $white;
  box-shadow: $box-shadow;
  border-radius: $border-radius;
  margin: 0 auto 1rem auto;
  padding: 1rem;
  position: relative;
  &:hover{
    cursor: pointer;
  }
  &__heading{
    font-size: 1rem;
    color: $gray-dark;
    letter-spacing: 1px;
    margin-bottom: 0.25rem;
  }
  &__description{
    font-size: 0.6rem;
    color: $gray-medium;
    letter-spacing: 1px;
    text-transform: uppercase;
    &--active{
      padding-bottom: 1rem;
    }
  }
  &__arrow{
    position: absolute;
    top: 1rem;
    right: 1rem;
    height: 10px;
    width: 10px;
    transform: rotate(0deg);
    transition: all 0.25s ease-in-out;
    &--active{
      transform: rotate(180deg);
    }
  }
  /* Search Details */
  &__details{
    visibility: hidden;
    max-height: 0;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0, 1, 0, 1); /* Fix delay for max-height transition */
    &--active{
      visibility: visible;
      transition: all 1s ease-in;
      max-height: 1000px; /* just a large number so the animation works */
      opacity: 1;
      .search__details__section{
        padding: 1rem 0;
        max-height: 1000px;
        opacity: 1;
        &:first-child{
          border-bottom: solid 1px $white-off;
        }
        &:last-child{
          padding-bottom: 0;
        }
      }
    }
    &__section{
      max-height: 0;
      opacity: 0;
      position: relative;
      &:hover{
        .search__details__section__arrow{
          transform: rotate(-90deg) translateY(-2px); /* not sure why this is Y, it should be X */
        }
      }
      &__arrow{
        position: absolute;
        top: 50%;
        right: 0rem;
        height: 10px;
        width: 10px;
        transform: rotate(-90deg) translateY(-50%);
        transition: transform 0.25s ease-in-out;
      }
    }
  }
}
.search-wrapper{
  &__results-text{
    font-weight: 300;
    font-style: italic;
    font-size: 0.8rem;
    color: $white-80;
    transition: color 0.5s ease-in-out;
    &--active{
      color: $gray-light;
    }
  }
}

</style>
