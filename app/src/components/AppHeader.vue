<template>
  <div :class="[{ 'header--signup': $store.state.menuType === 'signup' },'header header--fixed']">
    <div class="header__company">
      <router-link to="/">
        <svg class="header__company__logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421"><path d="M92.42033332 83.72434262l-41.91684596 7.62124472L7.32703668 99.1958511l19.3075774-89.63232678 22.86055334-4.15733174L73.1095751 1.1152664l19.31075822 82.60907622zM50.63390098 11.66604634L31.95930676 15.0631621 15.54945638 91.23425864 49.3647538 85.0889144 84.703664 78.663658 68.2906328 8.45659896l-17.65673182 3.20944738z" fill="#fff"/><path d="M75.78464472 27.20753286L25.36228608 36.3746561l-1.13873356-6.25985376 50.42553946-9.16712324 1.13555274 6.25985376z" fill="#fff"/></svg>
      </router-link>
      <button @click="toggleMenu" :class="[{ 'header__content__hamburger--active': menuActive },'header__content__hamburger']">
        <svg class="header__content__hamburger__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M92.7480535 28.6260075l-42.74805 42.74805-42.74805-42.74805" fill="none" stroke="#fff" stroke-width="12.824414999999998"/></svg>
      </button>
    </div>
    <ul :class="[{ 'header__content--active': menuActive },'header__content']">
      <router-link to="about" class="header__content__item"><li @click="toggleMenu">About</li></router-link>
      <router-link to="pricing" class="header__content__item"><li @click="toggleMenu">Pricing</li></router-link>
      <!-- login or out -->
      <router-link v-if="$store.state.isLoggedIn" to="login" class="header__content__item"><li @click="toggleMenu('logout')">Log Out</li></router-link>
      <router-link v-else to="login" class="header__content__item"><li @click="toggleMenu">Log In</li></router-link>
      <!-- end login or out -->
      <router-link v-if="$store.state.isLoggedIn" to="account" class="header__content__item"><li @click="toggleMenu">Account</li></router-link>
      <router-link v-else to="signup" class="header__content__item"><li @click="toggleMenu">Sign Up</li></router-link>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

const config = require('../../config/appConfig.json');

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
          href: '/login',
        },
        {
          name: 'Sign Up',
          href: 'signup',
        },
      ],
      menuActive: false,
      signUpActive: false,
    };
  },
  methods: {
    /*
      Toggles the menu on mobile devices
      @param {string} - Option to logout on click
    */
    toggleMenu(action) {
      if (action === 'logout') {
        this.logout();
      }
      if (window.outerWidth < 1024) {
        this.menuActive = !this.menuActive;
      }
    },

    logout() {
      // logout API
      axios.get(`${config.api}/users/logout`, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            this.$store.state.isLoggedIn = false;
            this.$router.push('/login');
          } else {
            alert('something went wrong when logging out. Please try again.');
          }
        })
        .catch((error) => {
          if (error) {
            alert('something went wrong when logging out. Please try again.');
          }
        });
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
  &--signup{
    background: transparent;
    .header__company__logo{
      path{
        fill: $red-orange;
      }
    }
    .header__content__hamburger__svg{
      path{
        stroke: $red-orange;
      }
    }
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
