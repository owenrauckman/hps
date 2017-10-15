<template>
  <ul class="m__menu">
    <router-link v-for="item in menuItems" :key="item.title" :to="item.link" class="m__menu__item">
      <li class="m__menu__item__test">{{item.title}}</li>
    </router-link>
  </ul>
</template>

<script>

export default {
  data() {
    return {
      menuItems: [
        { title: 'About', link: '/about' },
        { title: 'Pricing', link: '/pricing' },
        { title: 'Log In', link: '/login' },
        { title: 'Sign Up', link: '/create' },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

.m{
  &__menu{
    display: inline-flex;
    align-items: center;
    display: none;
    @include breakpoint('tablet'){
      display: flex;
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
