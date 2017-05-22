<template>
  <div class="header">
    <div class="header__company">
      <img class="header__company__logo" src="../../static/svg/logo.svg"/>
      <button @click="toggleMenu" :class="[{ 'header__content__hamburger--active': menuActive },'header__content__hamburger']">
        <img class="header__content__hamburger__svg" src="../../static/svg/arrow-gray.svg"/>
      </button>
    </div>
    <ul :class="[{ 'header__content--active': menuActive },'header__content']">
      <li class="header__content__item" v-for="item in menu">
        <a href="#">{{item}}</a>
      </li>
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
        'About',
        'Pricing',
        'Log In',
        'Sign Up',
      ],
      menuActive: false,
    };
  },
  methods: {
    /*
      Toggles the menu on mobile devices
    */
    toggleMenu() {
      this.menuActive = !this.menuActive;
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
  padding: 1rem 2rem;
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
      color: $neon-purple;
    }
  }
  &__content{
    display: none;
    &--active{
      display: block;
      align-items: center;
      list-style: none;
      position: absolute;
      height: auto;
      padding: 1rem 2rem 2rem 2rem;
      width: calc(100% - 4rem);
      background: white;
      z-index: +999;
      top:62px; // this val is hard coded for now
      border-top: solid 1px $gray-light;
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
      font-size: 0.9rem;
      &:last-child{
        border: solid 1px $gray-medium;
        padding: 0.5rem 1rem;
        border-radius: $border-radius;
      }
      a{
        &:link, &:active, &:visited{
          color: $gray-medium;
          text-decoration: none;
          transition: all 0.25s ease-in;
        }
        &:hover{
          color: $gray-dark;
          text-decoration: none;
        }
      }
      margin: 1rem 0;
      text-align: center;
      @include breakpoint(desktop){
        margin: 0 1rem;
      }
    }
    &__hamburger{
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
