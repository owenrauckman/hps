<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">What states do you want to be listed in?</h2>

    <div class="filters__section">

      <!-- input to filter states -->
      <div class="filters__section__input-container">
        <div class="filters__section__input-wrapper">
          <input class="filters__section__input" :placeholder="statePlaceholder" v-model="stateName">
        </div>
      </div>

      <p v-show="!stateSelected" class="signup__section__error">Please Select a state</p>

      <!-- list selected states -->
      <div class="signup__section__queries">
        <button class="signup__section__query-button" v-for="state in selectedStates" @click="removeQuery(state)">{{state.name.name}}</button>
      </div>

      <!-- list possible states -->
      <ul class="filters__section__list filters--margin">
        <li v-for="state in filterBy(states, stateName, 'name')" @click="selectState(state)" :class="[{ 'filters__section__list__item--selected':state.active },'filters__section__list__item']">{{state.name.name}}</li>
      </ul>
    </div>

    <!-- link to next page in process -->
    <a @click="validateStates" class="signup__section__button">Continue</a>

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
      selectedStates: this.$store.state.signUpInfo.states,
      stateName: '',
      stateSelected: true,
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
      if (this.stateExists(this.$store.state.signUpInfo.states, item)) {
        /* remove checkmark */
        const index = this.states.findIndex(state => state.name.name === item.name.name);
        this.states[index].active = false;

        /* remove item from store */
        this.selectedStates.splice(this.selectedStates.indexOf(item), 1);
      }

      // Go through and disable items in the list below (checkmarks)
      this.$store.commit('updateStates', this.selectedStates);
      this.makeStatesActive();
    },

    /*
      Checks to see if an object exists in array
      @param {array} - list of states to check against
      @param {object} - the object that is being checked
    */
    stateExists(arr, state) {
      return arr.some(el => el.name === state.name);
    },
    stateExistsDeeper(arr, state) {
      return arr.some(el => el.name.name === state.name.name);
    },

    /*
      Select a state from the listand set the value in the store
      if the selected state is tapped again, clear the values
      @param {object} - selected item
    */
    selectState(item) {
      /* if the item isn't in the list, add it, otherwise remove it */
      if (this.stateExistsDeeper(this.selectedStates, item)) {
        /* eslint-disable */
        item.active = false; // remove reference
        /* eslint-enable */

        this.selectedStates.splice(
          this.selectedStates.findIndex(state => state.name.name === item.name.name),
          1,
        );
      } else if (!this.stateExistsDeeper(this.selectedStates, item)) {
        /* eslint-disable */
        item.active = true; // add reference
        /* eslint-enable */
        this.selectedStates.push({ name: item.name, active: true });
      }

      this.$store.commit('updateStates', this.selectedStates);
    },
    /*
      Selects companies that are already in the store on page load
    */
    makeStatesActive() {
      this.states.forEach((state) => {
        this.selectedStates.forEach((activeState) => {
          if (state.name.name === activeState.name.name) {
            /* eslint-disable*/
            state.active = true;
            /* eslint-enable */
          }
        });
      });
    },
    /*
      Validate and make sure a company is selected before moving on
    */
    validateStates() {
      if (this.selectedStates.length > 0) {
        this.stateSelected = true;
        this.$store.commit('updateStates', this.selectedStates);
        this.$router.push('/signup/cities');
      } else {
        this.stateSelected = false;
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
  &__error{
    padding-left: 2rem;
    font-size: 0.8rem;
    color: $red-orange;
    display: block;
  }
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
