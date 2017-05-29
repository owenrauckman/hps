<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">What companies do you work for?</h2>

    <div class="filters__section">

      <div class="filters__section__input-container">
        <div class="filters__section__input-wrapper">
          <input class="filters__section__input" :keyup="checkForEmptyInput()" :placeholder="companySearchPlaceholder" v-model="$store.state.filterQueries.company.name">
        </div>
      </div>

      <ul class="filters__section__list filters--margin">
        <li v-for="company in filterBy(companies, $store.state.filterQueries.company.name, 'name')" @click="selectCompany(company)" :class="[{ 'filters__section__list__item--selected':company.active },'filters__section__list__item']">{{company.name}}</li>
      </ul>
    </div>

    <button class="signup__section__button">Continue</button>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'companies',
  data() {
    return {
      companySearchPlaceholder: 'Search By Company',
      companies: [],
      needState: false,
    };
  },
  mounted() {
    this.getCompanies().then(() => {
      this.selectCompany(this.$store.state.filterQueries.company);
    });
  },
  methods: {
    /*
      Get list of state that a user can search by
    */
    getCompanies() {
      return new Promise((resolve, reject) => {
        fetch(`${config.api}/search/companies`).then((data, err) => {
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
        this.$store.commit('updateCompanyQuery', { name: item.name, active: true });
      } else {
        this.$store.commit('updateCompanyQuery', { name: '', active: false });
      }
    },
    /*
      Checks if input is empty, if so, sets all cities to inactive class (removes check)
    */
    checkForEmptyInput() {
      if (this.$store.state.filterQueries.company.name.length === 0) {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';

.signup__section{
  display: flex;
  flex-direction: column;
  margin: 0;
  @include breakpoint(desktop){
    margin: 0 2rem;
  }
  &__heading{
    font-size: 1.25rem;
    color: $gray-dark;
  }
  &__button{
    margin-top: 1rem;
    align-self: flex-end;
    color: $white;
    font-size: 0.9rem;
    padding: 1rem 2rem;
    border-radius: $round-radius;
    box-shadow: $box-shadow;
    background: $blue;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
    &:hover{
      background: darken($blue, 10%);
    }
  }
}

/* overrides for the filters from the global file */
.filters__section{
  margin: 2rem 0 0 0;
}
.filters__section__input-wrapper{
  width: 100%;
  padding: 0.5rem 0;
}
.filters__section__list{
  max-height: 250px;
}
</style>
