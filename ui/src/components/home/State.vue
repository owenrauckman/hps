<template>
  <div class="state">
      <div class="filters__section">
        <div class="filters__section__input-container">
          <input class="filters__section__input" :placeholder="stateSearchPlaceholder" v-model="$store.state.filterQueries.state.name">
        </div>
        <ul class="filters__section__list filters--margin">
          <li v-for="state in filterBy(states, $store.state.filterQueries.state.name, 'name')" @click="selectState(state)" :class="[{ 'filters__section__list__item--selected': state.active },'filters__section__list__item']">{{state.name}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'state',
  data() {
    return {
      stateSearchPlaceholder: 'Search By State',
      states: [],
    };
  },
  mounted() {
    this.getStates();
  },
  methods: {
    /*
      Get list of state that a user can search by
    */
    getStates() {
      fetch(`${config.api}/search/states`).then((data) => {
        data.json().then((states) => {
          const newStates = [];
          /* eslint-disable */
          states.forEach((state) => {
            newStates.push({name: state.name, abbr: state.abbr, active: false});
          });
          /* eslint-enable */
          this.states = newStates;
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
          item.active = !item.active;
        } else {
          state.active = false;
        }
        /* eslint-enable */
      });

      if (item.active) {
        this.$store.commit('updateStateQuery', { name: item.name, abbr: item.abbr });
      } else {
        this.$store.commit('updateStateQuery', { name: '', abbr: '' });
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
