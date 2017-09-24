<template>
  <div class="company">
      <div class="filters__section">

        <div class="filters__section__input-container">
          <div class="filters__section__input-wrapper">
            <input class="filters__section__input" :keyup="checkForEmptyInput()" :placeholder="companySearchPlaceholder" v-model="filterQueries.company.name">
            <SearchButton/>
          </div>
        </div>

        <p v-if="needState" class="filter-required">{{needStateMessage}}</p>
        <ul class="filters__section__list filters--margin">
          <li v-for="company in filterBy(companies, filterQueries.company.name, 'name')" @click="selectCompany(company)" :class="[{ 'filters__section__list__item--selected':company.active },'filters__section__list__item']">{{company.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapGetters, mapMutations } from 'vuex';

import SearchButton from './SearchButton';

export default {
  name: 'company',
  data() {
    return {
      companySearchPlaceholder: 'Search By Company',
      companies: [],
      needState: false,
      needStateMessage: '*Please Select a State before continuing your search.',
    };
  },
  components: { SearchButton },
  mounted() {
    if (this.filterQueries.state.name.length === 0) {
      this.needState = true;
    } else {
      this.getCompanies().then(() => {
        this.selectCompany(this.filterQueries.company);
      });
    }
  },
  computed: {
    ...mapGetters(['filterQueries']),
  },
  methods: {
    ...mapMutations([types.SET_SEARCH_QUERY]),
    /*
      Get list of state that a user can search by
    */
    getCompanies() {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.default.api}/search/companies`).then((data, err) => {
          if (err) {
            reject('Something went wrong fetching companies');
          }
          data.json().then((companies) => {
            const newCompanies = [];
            /* eslint-disable */
            companies.forEach((company) => {
              newCompanies.push({name: company, active: false});
            });
            /* eslint-enable */
            this.companies = newCompanies;
            resolve(this.companies);
          });
        });
      });
    },
    /*
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectCompany(item) {
      this.companies.forEach((company) => {
        /* eslint-disable */
        if (company.name === item.name) {
          company.active = !company.active;
        } else {
          company.active = false;
        }
        /* eslint-enable */
      });

      if (item.active) {
        this.types.SET_SEARCH_QUERY('company', { name: item.name, active: true });
      } else {
        this.types.SET_SEARCH_QUERY('company', { name: '', active: false });
      }
    },
    /*
      Checks if input is empty, if so, sets all cities to inactive class (removes check)
    */
    checkForEmptyInput() {
      if (this.filterQueries.company.name.length === 0) {
        this.companies.forEach((company) => {
          /* eslint-disable */
          company.active = false;
          /* eslint-enable */
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

/* these need to be local in each component for some reason */
.filters__section__list__item--selected{
  &:after{
    background: url('../../../static/svg/verified-black.svg');
  }
}

</style>
