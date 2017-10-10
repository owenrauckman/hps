<template>
  <div>
    <div class="h__search-container">
      <!-- todo add hint that this must be selected -->
      <v-select
        v-bind:items="states"
        v-model="searchQueryState"
        label="State"
        autocomplete
        class="h__search__item"
      ></v-select>

      <v-select
        v-bind:items="cities"
        v-model="searchQueryCity"
        label="City"
        autocomplete
        class="h__search__item"
      ></v-select>

      <v-select
        v-bind:items="companiesIndustries"
        v-model="searchQuery.CompanyIndustry"
        label="Company/Industry"
        autocomplete
        class="h__search__item"
      ></v-select>
      <button class="h__search__item h__search__button" @click="performSearch()">Search</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedCompanyIndustry: null,
      companiesIndustries: ['Silpada', 'Advocare'],
    };
  },
  computed: {
    ...mapGetters({
      searchQuery: 'searchQuery',
      states: 'states',
      cities: 'cities',
    }),
    searchQueryState: {
      get() { return this.searchQuery.state; },
      set(state) {
        this.searchQuery.state = state;
        this.fetchCities();
      },
    },
    searchQueryCity: {
      get() { return this.searchQuery.city; },
      set(city) { this.searchQuery.city = city; },
    },
  },
  methods: {
    ...mapActions({
      fetchStates: 'fetchStates',
      fetchCities: 'fetchCities',
      performSearch: 'performSearch',
    }),
  },
  mounted() {
    this.fetchStates();
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
      margin: 1rem;
      flex: 1;
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
