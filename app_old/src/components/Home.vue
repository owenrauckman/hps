<template>
  <div>
    <div class="home">
      <div class="home__container g__container">
        <h1 class="home__heading">Home Party Shows</h1>
        <h2 class="home__subheading">Find and build your direct sales team today.</h2>
        <div class="home__cta">
          <router-link to="/signup" class="home__cta__item home__cta__item--border">Sign Up Now</router-link>
          <button class="home__cta__item" v-scroll-to="{element: '#js__home__search', duration: 1000}">Start Your Search</button>
        </div>
        <div class="home__search__container">
          <Search class="home__search" id="js__home__search"/>
        </div>
      </div>
    </div>

    <Results/>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapMutations } from 'vuex';

import Search from './home/Search';
import Results from './home/Results';

export default {
  name: 'home',
  components: { Search, Results },
  methods: {
    ...mapMutations([types.TOGGLE_MENU_TYPE]),
  },
  mounted() {
    document.body.classList.add('g__body__gray');

    this.TOGGLE_MENU_TYPE(true);

    /* set the title of the page */
    document.title = 'Home Party Shows | Find and build your direct sales team.';
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.home{
  width: 100%;
  height: auto;
  position: relative;
  background-image: url('../../static/img/hero.jpg');
  background-position: center;
  padding: 1.5rem 0 1.5rem 0;
  @include breakpoint(phone){
    padding: 3rem 0 1.5rem 0;
  }
  &:before{
    top: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    content: '';
    background: linear-gradient(to bottom right, transparentize($orange, 0.05), transparentize($red-orange, 0.05));
  }
  &__container{
    margin: calc(100px + 2rem) auto 4rem auto;
  }
  &__heading{
    font-family: $rubik;
    font-weight: 500;
    color: $white;
    text-align: center;
    letter-spacing: 1px;
    font-size: 2rem;
  }
  &__subheading{
    font-weight: 300;
    color: $white;
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: 1px;
    margin: 1.5rem auto;
    max-width: 380px;
  }
  &__cta{
    margin: 2rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &__item{
      color: $white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 1rem;
      font-size: 0.8rem;
      text-decoration: none;
      &:hover{
        cursor: pointer;
      }
      &--border{
        border: solid 1px $white;
        border-radius: $round-radius;
        padding: 1rem 2rem;
        transition: all 0.25s ease-in-out;
        &:hover{
          background: $white;
          color: $orange;
        }
      }
    }
  }
  &__search{
    position: absolute;
    width: 100%;
    bottom: -7rem;
    display: flex;
    justify-content: center;
    &__container{
      bottom: 0;
      position: relative;
      max-width: calc(768px - 2rem);
      margin: 0 auto;
    }
  }
}
</style>
