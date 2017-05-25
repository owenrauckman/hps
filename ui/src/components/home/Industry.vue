<template>
  <div class="industry">
      <div class="filters__section">

        <div class="filters__section__input-container">
          <div class="filters__section__input-wrapper">
            <input class="filters__section__input" :keyup="checkForEmptyInput()" :placeholder="industrySearchPlaceholder" v-model="$store.state.filterQueries.industry.name">
            <SearchButton/>
          </div>
        </div>

        <p v-if="needState" class="filter-required">{{needStateMessage}}</p>
        <ul class="filters__section__list filters--margin">
          <li v-for="industry in filterBy(industries, $store.state.filterQueries.industry.name, 'name')" @click="selectIndustry(industry)" :class="[{ 'filters__section__list__item--selected':industry.active },'filters__section__list__item']">{{industry.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import SearchButton from './SearchButton';

const config = require('../../../config/appConfig.json');

export default {
  name: 'industry',
  data() {
    return {
      industrySearchPlaceholder: 'Search By Industry',
      industries: [],
      needState: false,
      needStateMessage: '*Please Select a State before continuing your search.',
    };
  },
  components: { SearchButton },
  mounted() {
    if (this.$store.state.filterQueries.state.name.length === 0) {
      this.needState = true;
    } else {
      this.getIndustries().then(() => {
        this.selectIndustry(this.$store.state.filterQueries.industry);
      });
    }
  },
  methods: {
    /*
      Get list of state that a user can search by
    */
    getIndustries() {
      return new Promise((resolve, reject) => {
        fetch(`${config.api}/search/industries`).then((data, err) => {
          if (err) {
            reject('Something went wrong fetching industries');
          }
          data.json().then((industries) => {
            const newIndustries = [];
            /* eslint-disable */
            industries.forEach((industry) => {
              newIndustries.push({name: industry, active: false});
            });
            /* eslint-enable */
            this.industries = newIndustries;
            resolve(this.industries);
          });
        });
      });
    },
    /*
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectIndustry(item) {
      this.industries.forEach((industry) => {
        /* eslint-disable */
        if (industry.name === item.name) {
          industry.active = !industry.active;
        } else {
          industry.active = false;
        }
        /* eslint-enable */
      });

      if (item.active) {
        this.$store.commit('updateIndustryQuery', { name: item.name, active: true });
      } else {
        this.$store.commit('updateIndustryQuery', { name: '', active: false });
      }
    },
    /*
      Checks if input is empty, if so, sets all cities to inactive class (removes check)
    */
    checkForEmptyInput() {
      if (this.$store.state.filterQueries.industry.name.length === 0) {
        this.industries.forEach((industry) => {
          /* eslint-disable */
          industry.active = false;
          /* eslint-enable */
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
