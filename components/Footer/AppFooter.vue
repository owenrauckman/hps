<template>
  <div class="f">
    <div class="f__links">
      <HeaderLogo class="f__logo"/>
      <ul class="f__links__menu">
        <router-link to="/contact" class="f__links__menu__link"><li class="f__links__menu__item">Support</li></router-link>
        <a class="f__links__menu__link" href="https://www.facebook.com"><li class="f__links__menu__item"><img class="f__links__menu__item__image" src="../../static/svg/facebook.svg"/></li></a>
        <a class="f__links__menu__link" href="https://www.twitter.com"><li class="f__links__menu__item"><img class="f__links__menu__item__image" src="../../static/svg/twitter.svg"/></li></a>
        <a class="f__links__menu__link" href="https://www.instagram.com"><li class="f__links__menu__item"><img class="f__links__menu__item__image" src="../../static/svg/instagram.svg"/></li></a>
      </ul>
    </div>
  </div>
</template>
<script>
import HeaderLogo from '@/components/Svg/HeaderLogo'

export default{
  components: { HeaderLogo }
}
</script>
<style lang="scss">

.f{
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  &__links{
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include breakpoint('phone'){
      flex-direction: row;
      justify-content: space-between;
    }
    &__menu{
      display: inline-flex;
      padding: 2rem 0;
      justify-content: center;
      @include breakpoint('phone'){
        justify-content: flex-start;
        padding: 0;
      }
      &__item{
        list-style: none;
        margin: 0 0.5rem;
        &__image{
          height: 25px;
          width: auto;
        }
      }
      &__link{
        font-family: $rubik;
        &:link, &:visited, &:active, &:hover{
          color: $medium-dark-grey;
        }
      }
    }
  }
  &__logo{
    height: 30px !important; //overriding the componet
    width: auto;
    g{
      path{
        fill: $medium-dark-grey;
      }
    }
  }
}
</style>
