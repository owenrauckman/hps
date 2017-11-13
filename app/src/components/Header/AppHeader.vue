<template>
  <div>
    <div class="m__header">
      <router-link to="/">
        <HeaderLogo/>
      </router-link>
      <ul :class="[{ 'm__menu--active': menuVisible }, 'm__menu']">
        <a class="m__menu__item" @click="routeTo('about')">
          <li class="m__menu__item__test">About</li>
        </a>
        <a class="m__menu__item" to="/pricing" @click="routeTo('pricing')">
          <li class="m__menu__item__test">Pricing</li>
        </a>
        <a class="m__menu__item" @click="logout" v-if="authStatus">
          <li class="m__menu__item__test">Log Out</li>
        </a>
        <router-link class="m__menu__item" :to="{name: 'account'}" v-if="authStatus">
          <li class="m__menu__item__test">Dashboard</li>
        </router-link>
        <router-link class="m__menu__item" :to="{name: 'login'}" v-if="!authStatus">
          <li class="m__menu__item__test">Log In</li>
        </router-link>
        <a class="m__menu__item" to="/create" v-if="!authStatus" @click="routeTo('create')">
          <li class="m__menu__item__test">Sign Up</li>
        </a>
      </ul>
      <div :class="[{ 'm__menu__close--active': menuVisible }, 'm__menu__close']" @click="toggleMenu"></div>
      <div class="m__menu__hamburger-container" @click="toggleMenu"><Hamburger/></div>
    </div>
    <!-- logout error state -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="headline">Whoops</v-card-title>
          <v-card-text>{{logoutError}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat="flat" @click.native="dialog = false">Okay</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import config from '@/config';
import { mapActions, mapGetters } from 'vuex';
import HeaderLogo from '@/components/Svg/HeaderLogo';
import Hamburger from '@/components/Svg/Hamburger';

export default {
  components: { HeaderLogo, Hamburger },
  data() {
    return {
      menuVisible: false,
      dialog: false,
      logoutError: config.genericLogoutErrorMessage,
      menuItems: [
        { title: 'About', link: '/about', displayIfAuth: true },
        { title: 'Pricing', link: '/pricing', displayIfAuth: true },
        { title: 'Log In', link: '/login', displayIfAuth: true },
        { title: 'Dashboard', link: '/account/dashboard', displayIfAuth: true },
        { title: 'Sign Up', link: '/create', displayIfAuth: true },
      ],
    };
  },
  methods: {
    ...mapActions({ logoutUser: 'logoutUser' }),
    /*
      Toggles the mobile menu
    */
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },

    /*
      Pushes to new route and toggles the menu (for mobile)
    */
    routeTo(route) {
      this.menuVisible = false;
      this.$router.push(route);
    },
    /*
      Logs a user out and routes them to the home page or displays error dialog
    */
    logout() {
      this.menuVisible = false;
      this.logoutUser().then((response) => {
        if (response) {
          this.$router.push('/login');
        } else {
          this.dialog = true;
        }
      });
    },
  },
  computed: {
    ...mapGetters({ authStatus: 'authStatus' }),
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.m{
  &__header{
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
  }
  &__menu{
    display: inline-flex;
    align-items: center;
    display: none;
    position: relative;
    @include breakpoint('tablet'){
      display: flex;
    }
    &__hamburger-container{
      display: flex;
      @include breakpoint('tablet'){
        display: none;
      }
    }
    &__close{
      position: absolute;
      z-index: +2;
      top: 20px;
      right: 20px;
      height: 35px;
      width: 35px;
      content: '';
      background: url('../../../static/svg/close-dark.svg');
      display: none;
      &:hover{
        cursor: pointer;
      }
      &--active{
        display: block !important;
      }
    }
    &--active{
      display: flex !important;
      flex-direction: column;
      background: $white;
      height: 100vh;
      width: 100%;
      position: fixed;
      z-index: +1;
      left:0;
      top: 0;
      .m__menu__item{
        margin: 1rem 0;
        &:first-child{
          margin-top: 4rem;
        }
      }
    }
    &__item{
      margin: 0 1rem;
      font-family: $montserrat;
      color: $medium-grey;
      list-style: none;
      text-decoration: none;
      background: transparent;
      &:hover{
        cursor: pointer;
      }
      &:last-child{
        border: solid 1px $medium-grey;
        border-radius: $border-radius;
        margin: 0 0 0 1rem;
        padding: 0.5rem 1rem;
        &:hover{
          border: solid 1px lighten($purple, 25%);
          color: $purple;
          transition: all 0.25s ease-in-out;
        }
      }
      &__text{
        font-family: $montserrat;
      }
    }
  }
}
</style>
