<template>
  <div class="m__results">
    <div v-if="isResults && results.data && ( results.data.users.premiumStates.length > 0 || results.data.users.premiumCities.length > 0 || results.data.users.basic.length > 0)" class="m__results-container">
      <Card v-for="card in results.data.users.premiumStates" :key="card.plan" :options="card"/>
      <Card v-for="card in results.data.users.premiumCities" :key="card.plan" :options="card"/>
      <Card v-for="card in results.data.users.basic" :key="card.plan" :options="card" :class="[{ 'm__results__basic-cards--hidden': hideBasicCards }, 'm__results__basic-cards']"/>
    </div>
    <div v-else class="results__no-results-container g__container">
      <div v-if="!loadingResults">
        <div class="m__results-container m__results-container--no-results">
          <p class="m__results-container__text">It looks like there are no consultants in this area. Want to secure your spot?</p>
          <router-link to="signup" class="m__results-container__button">Sign up today</router-link>
        </div>
      </div>
    </div>

    <!-- loading state -->
    <div :class="[{ 'm__results__loading--active': loadingResults }, 'm__results__loading']">
      <div class='m__results__loading__dot m__results__loading__dot__1'></div>
      <div class='m__results__loading__dot m__results__loading__dot__2'></div>
      <div class='m__results__loading__dot m__results__loading__dot__3'></div>
      <div class='m__results__loading__dot m__results__loading__dot__4'></div>
    </div>

    <!-- button to show non-premium results -->
    <div class="m__results-container m__results-container--toggle-cards" v-if="results.data && results.data.users.basic && results.data.users.basic.length > 0">
      <button @click="showBasic()" class="m__results-container__button">{{showCardsText}}</button>
    </div>

  </div>
</template>

<script>
import Card from '@/components/Landing/Card';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: { Card },
  mounted() {
    // if results already exist, don't serach again. Leave them up for caching/UX purposes
    if (!this.isResults) {
      this.premiumSearch();
    }
  },
  computed: {
    ...mapGetters({
      results: 'results',
      loadingResults: 'loadingResults',
      isResults: 'isResults',
    }),
    hideBasicCards: {
      get() { return this.$store.state.search.hideBasicCards; },
      set() { this.$store.state.search.hideBasicCards = !this.$store.state.search.hideBasicCards; },
    },
    showCardsText() {
      return `${this.hideBasicCards ? 'View' : 'Hide'} Non-Premium Users`;
    },
  },
  methods: {
    ...mapActions({
      premiumSearch: 'premiumSearch',
    }),
    showBasic() {
      this.hideBasicCards = !this.hideBasicCards;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';
.m{
  &__results{
    background: $off-white;
    margin: 4rem 0 0 0;
    min-height: 200px;
    position: relative;
    &-container{
      padding: 2rem;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      &--no-results{
        flex-direction: column;
        max-width: 1200px;
        margin: 0 auto;
        margin: 2rem;
      }
      &--toggle-cards{
        padding: 0 2rem 2rem 0;
      }
      &__text{
        text-align: center;
        font-size: 1.1rem;
        font-family: $rubik;
        margin: 1rem 1rem 2rem 1rem;
      }
      &__button{
        color: $medium-grey;
        border: solid 1px $medium-grey;
        border-radius: $border-radius;
        font-family: $montserrat;
        text-transform: capitalize;
        font-weight: 600;
        padding: 1rem;
        width: 100%;
        font-size: 1rem;
        margin: 0 auto;
        text-decoration: none;
        @include breakpoint('tablet'){
          width: auto;
        }
        &:hover{
          transition: all 0.25s ease-in-out;
          color: $purple;
          border: solid 1px lighten($purple, 20%);
        }
      }
    }
    &__basic-cards{
      display: flex;
      &--hidden{
        display: none !important;
      }
    }
    &__loading{
     display: none;
     margin: 2rem 0;
     height: 50px;
     width: 100%;
     overflow: hidden;
     &--active{
       display: block;
     }
     &__dot{
       width: 10px;
       height: 10px;
       background: $pink;
       border-radius: 5px;
       position: absolute;
       top: 20px;
       left: -10%;
       &__1{ animation: dotslide 2s infinite cubic-bezier(0.2,.8,.8,0.2); }
       &__2{ animation: dotslide 2s .2s infinite cubic-bezier(0.2,.8,.8,0.2); }
       &__3{ animation: dotslide 2s .4s infinite cubic-bezier(0.2,.8,.8,0.2); }
       &__4{ animation: dotslide 2s .6s infinite cubic-bezier(0.2,.8,.8,0.2); }
     }
   }
  }
}

</style>
