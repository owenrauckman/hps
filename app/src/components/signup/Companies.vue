<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">What companies do you work for?</h2>

    <div class="filters__section">

      <!-- input to filter companies -->
      <div class="filters__section__input-container">
        <div class="filters__section__input-wrapper">
          <input class="filters__section__input" :placeholder="companySearchPlaceholder" v-model="companyName">
        </div>
      </div>

      <!-- show list of possible companies -->
      <ul class="filters__section__list filters--margin">
        <li v-for="company in filterBy(companies, companyName, 'name')" @click="selectCompany(company)" :class="[{ 'filters__section__list__item--selected':company.active },'filters__section__list__item']">{{company.name}}</li>
      </ul>
    </div>

    <!-- link to next page in process -->
    <router-link to="/signup/states" class="signup__section__button">Continue</router-link>

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
      companyName: '',
    };
  },
  mounted() {
    this.getCompanies();
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
          this.$store.commit('updateSignUpInfoCompany', company.name);
        } else{
          company.active = false;
        }
        /* eslint-enable */
      });
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
    text-decoration: none;
    cursor: pointer;
    &:hover{
      background: darken($blue, 10%);
    }
  }
  &__queries{
    max-width: calc(768px - 4rem);
    margin: 0 auto 0rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    text-align: left;
  }
  &__query-button{
    border: solid 1px $gray-light;
    padding: 0.5rem 2rem 0.5rem 1rem;
    border-radius: $round-radius;
    color: $gray-medium;
    position: relative;
    transition: all 0.25s ease-in-out;
    margin: 0.5rem;
    display: block;
    flex: 0 0 auto;
    &:after{
      position: absolute;
      content: '';
      height: 15px;
      width: 15px;
      top: 50%;
      right: 0.5rem;
      transform: translateY(-50%);
      background: url('../../../static/svg/close-dark.svg');
      transition: background 0.25s ease-in-out;
    }
    &:hover{
      background: $gray-light;
      color: $white;
      border: solid 1px transparent;
      cursor: pointer;
      &:after{
        background: url('../../../static/svg/close-light.svg');
      }
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
  margin-top: 0;
}
/* these need to be local in each component for some reason */
.filters__section__list__item--selected{
  &:after{
    background: url('../../../static/svg/verified-black.svg');
  }
}
</style>
