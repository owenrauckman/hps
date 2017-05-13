<template>
  <div class="search">
    <div class="search__wrapper" @click="toggleFilters">
      <img class="search__wrapper__image" src="../../../static/svg/search.svg"/>
      <div>
        <p class="search__wrapper__heading">{{startSearch}}</p>
        <p class="search__wrapper__description">{{startSearchDescription}}</p>
      </div>
    </div>
    <p class="search__results-text">Showing 4 of 7 results</p>

    <Filters :class="[{ 'filter--show': $store.state.filtersVisible },'filter']"/>
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
    };
  },
  methods: {
    /*
      Toggles the filters overlay
      @param {e} - the event object
    */
    toggleFilters() {
      this.$store.commit('toggleFilters', true);
      this.showFiltersLocation = !this.showFiltersLocation;
      document.body.classList.add('no-overflow');
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.search{
  &__wrapper{
    background: $white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    margin: 0 auto 1rem auto;
    padding: 1rem;
    position: relative;
    display: flex;
    align-items: center;
    &:hover{
      cursor: pointer;
    }
    &__image{
      width: 20px;
      height: 20px;
      margin-right: 1rem;
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
    }
  }
  &__results-text{
    font-weight: 300;
    font-style: italic;
    font-size: 0.9rem;
    color: $white-80;
    transition: color 0.5s ease-in-out;
    &--active{
      color: $gray-light;
    }
  }
}

</style>
