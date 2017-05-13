<template>
  <div class="header">
    <div class="header__company">
      <img class="header__company__logo" src="../../static/svg/logo.svg"/>
      <button class="header__content__hamburger">
        <img class="header__content__hamburger__svg" src="../../static/svg/arrow-white.svg"/>
      </button>
    </div>
    <div class="header__content">
      <a class="header__content__sign-up" href="">Sign Up</a>
    </div>
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
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.header{
  display: flex;
  justify-content: space-between;
  padding: 1rem;
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
      color: $white;
    }
  }
  &__content{
    display: flex;
    align-items: center;
    &__menu{

    }
    &__sign-up{
      color: $white;
      text-transform: uppercase;
      font-weight: 400;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
      padding: 0.5rem 0.75rem;
      margin-right: 0.5rem;
      &:link, &:visited, &:active{
        text-decoration: none;
      }
      &:hover{
        text-decoration: none;
      }
    }
    &__hamburger{
      background: transparent;
      border: none;
      margin-left: 0.5rem;
      &:hover{
        cursor: pointer;
      }
      &__svg{
        height: 15px;
        width: 15px;
      }
    }
  }
}

</style>
