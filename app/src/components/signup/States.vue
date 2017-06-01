<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">What states do you want to be listed in?</h2>

    <div class="filters__section">

      <div class="filters__section__input-container">
        <div class="filters__section__input-wrapper">
          <input class="filters__section__input" :placeholder="statePlaceholder" v-model="stateName">
        </div>
      </div>

      <div class="signup__section__queries">
        <button class="signup__section__query-button" v-for="state in $store.state.signUpInfo.states" @click="removeQuery(state)">{{state.name}}</button>
      </div>

      <ul class="filters__section__list filters--margin">
        <li v-for="state in filterBy(states, stateName, 'name')" @click="selectState(state)" :class="[{ 'filters__section__list__item--selected':state.active },'filters__section__list__item']">{{state.name.name}}</li>
      </ul>
    </div>

    <router-link to="/signup/cities" class="signup__section__button">Continue</router-link>

  </div>
</template>

<script>
const config = require('../../../config/appConfig.json');

export default {
  name: 'companies',
  data() {
    return {
      statePlaceholder: 'Search By State',
      states: [],
      stateName: '',
    };
  },
  mounted() {
    this.getStates().then(() => {
      this.makeStatesActive();
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
              newStates.push({name: state, active: false});
            });
            /* eslint-enable */
            this.states = newStates;
            resolve(this.states);
          });
        });
      });
    },
    /*
      Removes element from query and performs a new search
    */
    removeQuery(item) {
      if (this.$store.state.signUpInfo.states.includes(item)) {
        this.$store.state.signUpInfo.states.splice(
          this.$store.state.signUpInfo.states.indexOf(item), 1);
      } else {
        this.$store.state.signUpInfo.states.push(item);
      }

      this.states.forEach((state) => {
        /* eslint-disable */
        if (state.name === item) {
          state.active = !state.active;
        }
        /* eslint-enable */
      });
    },
    /*
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectState(item) {
      /* TODO: make this whole component use an object instead

        currently its an array, need {name: partylite, area: etc}
        and still be able to loop through that


      /* if the item isn't in the list, add it, otherwise remove it */
      if (this.$store.state.signUpInfo.states.includes(item.name)) {
        this.$store.state.signUpInfo.states.splice(
          this.$store.state.signUpInfo.states.indexOf(item.name), 1);
      } else {
        this.$store.state.signUpInfo.states.push(item.name);
      }

      this.states.forEach((state) => {
        /* eslint-disable */
        if (state.name === item.name) {
          state.active = !state.active;
        }
        /* eslint-enable */
      });
    },
    /*
      Selects companies that are already in the store on page load
    */
    makeStatesActive() {
      this.states.forEach((state) => {
        /* eslint-disable */
        if (this.$store.state.signUpInfo.states.includes(state.name)) {
          state.active = !state.active;
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
