<template>
  <div class="company">
      <div class="filters__section">
        <div class="filters__section__input-container">
          <input class="filters__section__input" :placeholder="companySearchPlaceholder" v-model="$store.state.filterQueries.company">
        </div>
        <ul class="filters__section__list filters--margin">
          <li v-for="company in filterBy(companies, $store.state.filterQueries.company, 'name')" @click="selectCompany(company)" :class="[{ 'filters__section__list__item--selected':company.active },'filters__section__list__item']">{{company.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'company',
  data() {
    return {
      companySearchPlaceholder: 'Search By Company',
      companies: [],
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
      fetch(`${config.api}/search/companies`).then((data) => {
        data.json().then((companies) => {
          const newCompanies = [];
          /* eslint-disable */
          companies.forEach((company) => {
            newCompanies.push({name: company, active: false});
          });
          /* eslint-enable */
          this.companies = newCompanies;
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
          item.active = !item.active;
        } else {
          company.active = false;
        }
        /* eslint-enable */
      });

      if (item.active) {
        this.$store.commit('updateCompanyQuery', item.name);
      } else {
        this.$store.commit('updateCompanyQuery', '');
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.filters{
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
      overflow-y: auto;
      max-height: 100vh;
      &::-webkit-scrollbar {
        display: none;
      }
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
}
</style>
