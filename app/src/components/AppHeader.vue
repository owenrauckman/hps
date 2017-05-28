<template>
  <div class="header header--fixed">
    <div class="header__company">
      <router-link to="/">
        <img class="header__company__logo" src="../../static/svg/logo-white.svg"/>
      </router-link>
      <button @click="toggleMenu" :class="[{ 'header__content__hamburger--active': menuActive },'header__content__hamburger']">
        <img class="header__content__hamburger__svg" src="../../static/svg/arrow-white.svg"/>
      </button>
    </div>
    <ul :class="[{ 'header__content--active': menuActive },'header__content']">
      <router-link :to="item.href" v-for="item in menu" :key="item.name" class="header__content__item">
        <li @click="toggleMenu">{{item.name}}</li>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'header',
  data() {
    return {
      title: 'Home Party Shows',
      signUp: 'Sign Up',
      menu: [
        {
          name: 'About',
          href: 'about',
        },
        {
          name: 'Pricing',
          href: 'pricing',
        },
        {
          name: 'Log In',
          href: 'login',
        },
        {
          name: 'Sign Up',
          href: 'signup',
        },
      ],
      menuActive: false,
    };
  },
  methods: {
    /*
      Toggles the menu on mobile devices
    */
    toggleMenu() {
      if (window.outerWidth < 1024) {
        this.menuActive = !this.menuActive;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.header{
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  background: transparentize($dark-blue, 0.9);
  z-index: +1;
  &--fixed{
    position: absolute;
    top:0;
    width: calc(100% - 4rem);
    height: 100px;
  }
  &__company{
    display: flex;
    align-items: center;
    &__logo{
      height: 30px;
      width: 30px;
    }
    &__name{
      font-size: 0.8rem;
      font-weight: 400;
      letter-spacing: 1.5px;
      font-style: italic;
      margin-left: 0.25rem;
      color: $dark-blue;
    }
  }
  &__content{
    display: none;
    &--active{
      display: block;
      align-items: flex-top;
      list-style: none;
      position: absolute;
      height: auto;
      padding: 2rem;
      width: calc(100% - 4rem);
      background: $dark-blue;
      z-index: +999;
      top:82px; // this val is hard coded for now
      left: 0;
      box-shadow: 0 10px 10px transparentize($black, 0.9);
    }
    /* todo mobile styles */
    @include breakpoint(desktop){
      display: flex;
      align-items: center;
      list-style: none;
    }
    &__item{
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      &:last-child{
        border: solid 1px $white;
        padding: 0.5rem 1rem;
        border-radius: $round-radius;
        transition: all 0.25s ease-in-out;
      }
      &:link, &:active, &:visited{
        color: $white;
        text-decoration: none;
        transition: all 0.25s ease-in;
      }
      &:hover{
        color: $white;
        text-decoration: none;
        position: relative;
      }
      margin: 1rem 0;
      text-align: center;
      @include breakpoint(desktop){
        margin: 0 1rem;
      }
    }
    &__hamburger{
      display: block;
      @include breakpoint(desktop){
        display: none;
      }
      background: transparent;
      border: none;
      margin-left: 0.25rem;
      transform: rotate(0deg);
      transition: transform 0.25s ease-in-out;
      transform-origin: center;
      &--active{
        transform: rotate(180deg);
      }
      &:hover{
        cursor: pointer;
      }
      &__svg{
        height: 10px;
        width: 10px;
      }
    }
  }
}

</style>
