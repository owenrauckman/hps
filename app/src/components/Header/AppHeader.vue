<template>
  <div class="m__header">
    <router-link to="/">
      <HeaderLogo/>
    </router-link>
    <ul :class="[{ 'm__menu--active': menuVisible }, 'm__menu']">
      <router-link v-for="item in menuItems" :key="item.title" :to="item.link" class="m__menu__item">
        <li class="m__menu__item__test">{{item.title}}</li>
      </router-link>
    </ul>
    <div :class="[{ 'm__menu__close--active': menuVisible }, 'm__menu__close']" @click="toggleMenu"></div>
    <div class="m__menu__hamburger-container" @click="toggleMenu"><Hamburger/></div>
  </div>
</template>

<script>
import HeaderLogo from '@/components/Svg/HeaderLogo';
import Hamburger from '@/components/Svg/Hamburger';

export default {
  components: { HeaderLogo, Hamburger },
  data() {
    return {
      menuVisible: false,
      menuItems: [
        { title: 'About', link: '/about' },
        { title: 'Pricing', link: '/pricing' },
        { title: 'Log In', link: '/login' },
        { title: 'Sign Up', link: '/create' },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
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
