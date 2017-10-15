<template>
  <div>
    <div class="h__search-container">

      <v-select
        v-bind:items="states"
        v-model="searchQueryState"
        label="State"
        v-bind:autocomplete="true"
        class="h__search__item"
        v-bind:clearable="true"
        color="pink lighten-1"
      ></v-select>

      <v-select
        v-bind:items="cities"
        v-model="searchQueryCity"
        label="City"
        v-bind:autocomplete="true"
        class="h__search__item"
        v-bind:disabled="!isStateSelected"
        v-bind:persistent-hint="true"
        v-bind:clearable="true"
        v-bind:hint="!isStateSelected ? 'Please select a state first' : ''"
        color="pink lighten-1"
      ></v-select>

      <v-select
        v-bind:items="companyIndustries"
        v-model="searchQueryCompanyIndustry"
        label="Company/Industry"
        v-bind:autocomplete="true"
        class="h__search__item"
        item-text="name"
        return-object
        v-bind:disabled="!isStateSelected"
        v-bind:persistent-hint="true"
        v-bind:clearable="true"
        v-bind:hint="!isStateSelected ? 'Please select a state first' : ''"
        color="pink lighten-1"
      ></v-select>
      <button class="h__search__item h__search__button" @click="performSearch()">Search</button>
    </div>
  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      searchQuery: 'searchQuery',
      states: 'states',
      cities: 'cities',
      companyIndustries: 'companyIndustries',
    }),
    searchQueryState: {
      get() { return this.searchQuery.state; },
      set(state) {
        this.UPDATE_SEARCH_QUERY({ type: 'STATE', value: state });
        this.fetchCities();
      },
    },
    searchQueryCity: {
      get() { return this.searchQuery.city; },
      set(city) { this.UPDATE_SEARCH_QUERY({ type: 'CITY', value: city }); },
    },
    searchQueryCompanyIndustry: {
      get() { return this.searchQuery.companyIndustry; },
      set(companyIndustry) { this.UPDATE_SEARCH_QUERY({ type: 'COMPANY_INDUSTRY', value: companyIndustry }); },
    },
    isStateSelected() {
      return this.searchQuery.state !== null;
    },
  },
  methods: {
    ...mapActions({
      fetchStates: 'fetchStates',
      fetchCities: 'fetchCities',
      fetchCompanyIndustry: 'fetchCompanyIndustry',
      performSearch: 'performSearch',
    }),
    ...mapMutations([types.UPDATE_SEARCH_QUERY]),
  },
  mounted() {
    this.fetchStates();
    this.fetchCompanyIndustry();
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';
.test{
  background: red;
}
.h{
  &__search{
    &-container{
      display: flex;
      align-items: center;
      margin: 0 auto;
      flex-direction: column;
      @include breakpoint('tablet'){
        flex-direction: row;
      }
    }
    &__item{
      margin: 0 1rem;
      flex: 1;
      // white-space: nowrap;
    }
    &__button{
      background: $purple;
      color: $white;
      border-radius: $border-radius;
      font-family: $montserrat;
      text-transform: uppercase;
      font-weight: 600;
      padding: 1rem;
      width: 100%;
      font-size: 1rem;
      @include breakpoint('tablet'){
        width: auto;
        max-width: 150px;
      }
      &:hover{
        transition: all 0.25s ease-in-out;
        background: darken($purple, 10%);
      }
    }
  }
}

</style>
