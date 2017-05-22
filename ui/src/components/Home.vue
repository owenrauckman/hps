<template>
  <div class="home g__container">
    <div class="home__container">
      <p class="home__intro"><span class="home__intro__span">Home Party Shows</span> Find and build your direct sales team today.</p>
      <Search/>
      <p :class="[{ 'home__loading--active': $store.state.loadingResults }, 'home__loading']">{{loading}}</p>
    </div>
    <div class="home__card-container">
      <Card v-for="card in $store.state.results.users" :key="card.plan" :options="card"/>
    </div>
  </div>
</template>

<script>
import Card from './home/Card';
import Search from './home/Search';

export default {
  name: 'home',
  components: { Card, Search },
  data() {
    return {
      loading: 'Loading...',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.home{
  &__container{
    margin: 1rem 2rem;
  }
  &__intro{
    margin: 4rem 0 3rem 0;
    text-align: left;
    color: $gray-dark;
    font-size: 1.25rem;
    letter-spacing: 1px;
    font-weight: 300;
    line-height: 2rem;
    max-width: 350px;
    @include breakpoint(tablet){
      font-size: 2rem;
      line-height: 2.5rem;
      max-width: 550px;
    }
    &__span{
      font-weight: 600;
      color: $neon-purple;
      letter-spacing: none;
    }
  }
  &__card-container{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0 1rem;
  }
  &__loading{
    display: none;
    color: $gray-medium;
    &--active{
      display: block;
    }
  }
}
</style>
