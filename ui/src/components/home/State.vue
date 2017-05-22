<template>
  <div class="state">
      <div class="filters__section">
        <div class="filters__section__input-container">
          <div class="filters__section__input-wrapper">
            <input class="filters__section__input" :keyup="checkForEmptyInput()" :placeholder="stateSearchPlaceholder" v-model="$store.state.filterQueries.state.name">
            <SearchButton/>
          </div>
        </div>
        <ul class="filters__section__list filters--margin">
          <li v-for="state in filterBy(states, $store.state.filterQueries.state.name, 'name')" @click="selectState(state)" :class="[{ 'filters__section__list__item--selected': state.active },'filters__section__list__item']">{{state.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import SearchButton from './SearchButton';

const config = require('../../../config/appConfig.json');

export default {
  name: 'state',
  data() {
    return {
      stateSearchPlaceholder: 'Search By State',
      states: [],
    };
  },
  components: { SearchButton },
  mounted() {
    this.getStates().then(() => {
      this.selectState(this.$store.state.filterQueries.state);
    });
  },
  methods: {
    /*
      Get list of state that a user can search by
    */
    getStates() {
      return new Promise((resolve, reject) => {
        fetch(`${config.api}/search/states`).then((data, err) => {
          if (err) {
            reject('Something went wrong fetching states');
          }
          data.json().then((states) => {
            const newStates = [];
            /* eslint-disable */
            states.forEach((state) => {
              newStates.push({name: state.name, abbr: state.abbr, active: false});
            });
            /* eslint-enable */
            this.states = newStates;
            resolve(this.states);
          });
        });
      });
    },
    /*
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectState(item) {
      this.states.forEach((state) => {
        /* eslint-disable */
        if (state.name === item.name) {
          state.active = !state.active;
        } else {
          state.active = false;
        }
        /* eslint-enable */
        if (item.active) {
          this.$store.commit('updateStateQuery', { name: item.name, abbr: item.abbr, active: true });
        } else {
          this.$store.commit('updateStateQuery', { name: '', abbr: '', active: false });
        }
      });
    },
    /*
      Checks if input is empty, if so, sets all states to inactive class (removes check)
    */
    checkForEmptyInput() {
      if (this.$store.state.filterQueries.state.name.length === 0) {
        this.states.forEach((state) => {
          /* eslint-disable */
          state.active = false;
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
.filters__section__input-container{
  &:after{
    background: url('../../../static/svg/search-white.svg');
  }
}
.filters__section__list__item--selected{
  &:after{
    background: url('../../../static/svg/check.svg');
  }
}

</style>
