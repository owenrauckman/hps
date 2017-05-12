<template>
  <div class="filters">

    <!-- Filters for Location -->
    <div v-if="options.searchType === 'location'" class="filters__container">
      <div class="filters__description">
        <p class="filters__description__text">{{locationSearch}}</p>
        <button @click="hideFilters" class="filters__description__close">
          <img src="../../../static/svg/close.svg"/>
        </button>
      </div>

      <div class="filters__section">
        <div class="filters__section__input-container">
          <input class="filters__section__input" v-on:blur="scrollTop" :placeholder="stateSearchPlaceholder" v-model="stateQuery">
        </div>
        <ul class="filters__section__list">
          <li class="filters__section__list__item filters__section__list__item--selected">Kansas</li>
          <li class="filters__section__list__item">Missouri</li>
          <li class="filters__section__list__item">Nebraska</li>
        </ul>
      </div>

      <div class="filters__section">
        <div class="filters__section__input-container">
          <input class="filters__section__input" v-on:blur="scrollTop" :placeholder="citySearchPlaceholder" v-model="cityQuery">
        </div>
        <ul class="filters__section__list">
          <li class="filters__section__list__item filters__section__list__item--selected">Kansas</li>
          <li class="filters__section__list__item">Missouri</li>
          <li class="filters__section__list__item">Nebraska</li>
        </ul>
      </div>
      <button @click="performSearch" class="filters__search-button">{{search}}</button>
    </div>


    <!-- Filters for Company/Industry -->
    <div v-if="options.searchType === 'company'" class="filters__container">
      <div class="filters__description">
        <p class="filters__description__text">{{companySearch}}</p>
        <button @click="hideFilters" class="filters__description__close">
          <img src="../../../static/svg/close.svg"/>
        </button>
      </div>

      <div class="filters__section">
        <div class="filters__section__input-container">
          <input class="filters__section__input" :placeholder="companySearchPlaceholder" v-model="companyQuery">
        </div>
        <ul class="filters__section__list">
          <li v-for="company in filterBy(companies, companyQuery, 'name')" @click="selectCompany(company)" :class="[{ 'filters__section__list__item--selected': company.active },'filters__section__list__item']">{{company.name}}</li>
        </ul>
      </div>
      <button @click="performSearch" class="filters__search-button">{{search}}</button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'filters',
  data() {
    return {
      locationSearch: 'Search by state and/or city',
      companySearch: 'Search by company or industry',
      stateSearchPlaceholder: 'Search By State',
      citySearchPlaceholder: 'Search By City',
      companySearchPlaceholder: 'Search By Company/Industry',
      search: 'Search',
      stateQuery: '',
      cityQuery: '',
      companyQuery: '',
      companies: [],
      industries: [],
    };
  },
  mounted() {
    window.onresize = this.onScreenResize();
    this.getCompanies();
  },
  props: ['options'],
  methods: {
    /*
      / Hides the filter popup and removes the no-scroll class on the body
    */
    hideFilters() {
      this.$store.commit('toggleFilters', false);
      document.body.classList = '';
    },
    /*
      / When the window resizes, adjust height of the filters to the window height
      / This fixes issue with Chrome/other mobile browsers overflowing
    */
    onScreenResize() {
      document.querySelector('.filters').style.height = window.innerHeight;
    },
    /*
      / scroll back to the top of the page on input blurs to avoid UI issue
    */
    scrollTop() {
      document.body.scrollTop = 0;
    },
    /*
      / Get list of companies that a user can search by
    */
    getCompanies() {
      fetch('http://localhost:3000/api/search/companies').then((data) => {
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
      / Get list of companies that a user can search by
    */
    selectCompany(item) {
      /* eslint-disable */
      this.companies.forEach((company) => {
        company.active = false;
      });
      item.active = !item.active;
      this.companyQuery = item.name;
      /* eslint-enable */
    },
    /*
      / TODO FILL THIS OUT
    */
    performSearch() {
      this.hideFilters();
      fetch(
        `http://localhost:3000/api/search?company=${encodeURIComponent(this.companyQuery)}&zipCode=
        ${encodeURIComponent(this.stateQuery)}`,
      ).then((data) => {
        data.json().then((users) => {
          this.$store.commit('updateResults', users);
        });
      });
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
  overflow-y: scroll;
  box-sizing:border-box;
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
  &__container{
    margin: 1rem;
    position: relative;
    min-height: 100%;
  }
  &__section{
    min-height: 200px;
    margin-bottom: 4rem;
    position: relative;
    &__input{
      height: 70px;
      width: calc(100% - 5rem);
      padding:0 4rem 0 1rem;
      border-radius: $border-radius;
      box-shadow: $box-shadow;
      font-family: $roboto;
      font-size: 1rem;
      &::placeholder{
        font-family: $roboto;
        font-size: 1rem;
      }
    }
    &__input-container{
      position: relative;
      &:after{
        content: '';
        position: absolute;
        right: 1rem;
        height: 20px;
        width: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: url('../../../static/svg/search.svg');
      }
    }
    &__list{
      list-style: none;
      &__item{
        border: solid 1px $white-50;
        padding: 0.5rem 1rem;
        margin: 0.5rem 0;
        border-radius: $border-radius;
        color: $white;
        letter-spacing: 1px;
        font-weight: 300;
        transition: background 0.2s ease-in;
        position: relative;
        &--selected{
          background: $white-20;
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
    background: orange;
    width: 100%;
    position: fixed;
    padding: 1rem 0;
    left:0;
    bottom: 0;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 300;
    transition: background 0.2s ease-in;
    background: $pink;
    box-shadow: $box-shadow;
    text-decoration: none;
    color: $white;
    margin: 0;
    &:hover{
      cursor: pointer;
      background: lighten($pink, 5%);
      text-decoration: none;
      &:after{
        transform:translateX(5px) rotate(-90deg);
      }
    }
    &:after{
      position: absolute;
      content: '';
      height: 7px;
      width: 7px;
      align-items: center;
      transform: rotate(-90deg) translateX(0%);
      margin: 5px 5px 0 2px;
      background: url('../../../static/svg/arrow-white.svg');
      transition: transform 0.2s ease-in;
    }
  }
  &__description{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 1rem 0;
    &__text{
      font-size: 0.9rem;
      color: $white;
      font-weight: 300;
      font-style: italic;
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
</style>
