<template>
  <div class="m__results">
    <div v-if="results.data && (results.data.users.basic.length > 0 || results.data.users.premiumStates.length > 0 || results.data.users.premiumCities.length > 0)" class="m__results-container">
      <Card v-for="card in results.data.users.premiumStates" :key="card.plan" :options="card"/>
      <Card v-for="card in results.data.users.premiumCities" :key="card.plan" :options="card"/>
      <Card v-for="card in results.data.users.basic" :key="card.plan" :options="card"/>
    </div>
    <div v-else class="results__no-results-container g__container">
      <div v-if="!loadingResults">
        <p class="results__no-results-container__text">It looks like there are no consultants in this area. Want to secure your spot?</p>
        <router-link to="signup" class="results__no-results-container__link">Sign up today</router-link>
      </div>
    </div>

    <!-- loading state -->
    <div :class="[{ 'm__results__loading--active': loadingResults }, 'm__results__loading']">
      <div class='m__results__loading__dot m__results__loading__dot__1'></div>
      <div class='m__results__loading__dot m__results__loading__dot__2'></div>
      <div class='m__results__loading__dot m__results__loading__dot__3'></div>
      <div class='m__results__loading__dot m__results__loading__dot__4'></div>
    </div>

  </div>
</template>

<script>
import Card from '@/components/Landing/Card';
import { mapGetters } from 'vuex';

export default {
  components: { Card },
  mounted() {

  },
  computed: {
    ...mapGetters({
      results: 'results',
      loadingResults: 'loadingResults',
    }),
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
