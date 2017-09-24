<template>
  <div>
    <div class="signup__bg"></div>
    <div class="signup">
      <div class="signup__box signup__box__container signup__box--white">
        <router-view></router-view>
      </div>
      <div class="signup__box signup__box__container signup__box--image">
        <div class="signup__info-container">
          <div class="signup__description">
            <h1 class="signup__description__heading">Create an account</h1>
            <p class="signup__description__copy">Use the form to sign up and start getting noticed today!</p>
          </div>
          <div class="signup__cost">
            <p class="signup__cost__copy">Your monthly subscription fee is: </p>
            <p class="signup__cost__price" v-if="this.$store.state.temp.signUpInfo.totalPrice <= 0">Free</p>
            <p class="signup__cost__price" v-else>${{this.$store.state.temp.signUpInfo.totalPrice}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfo from './signup/PersonalInfo';

export default {
  name: 'signup',
  data() {
    return {
    };
  },
  components: { PersonalInfo },
  beforeMount() {
    this.$store.state.temp.menuType = 'signup';
  },
  mounted() {
    /* set the title of the page */
    document.title = 'Home Party Shows | Sign Up Today';

    /* remove gray body */
    document.body.classList.remove('g__body__gray');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.signup{
  display: flex;
  padding-top: 100px;
  justify-content: center;
  flex-direction: column;
  @include breakpoint(desktop){
    flex-direction: row;
  }
  &__bg{
    display: none;
    @include breakpoint(desktop){
      display: block;
    }
    background-image: url('../../static/img/signup-hero.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: fixed;
    height: 100vh;
    width: 50%;
    top: 0;
    right: 0;
    z-index: -1;
    &:before{
      top: 0;
      position: absolute;
      height: 100%;
      width: 100%;
      content: '';
      background: linear-gradient(to bottom right, transparentize($orange, 0.1), transparentize($red-orange, 0.1));
    }
  }
  &__box{
    width: 100%;
    @include breakpoint(desktop){
      width: 50%;
      width: calc(100% - 2rem);
    }
    /* we need to flip these on mobile since its stacked */
    &:first-child{
      order: 1;
      @include breakpoint(desktop){
        order: 0;
      }
      &--image{
        display: flex;
      }
    }
    &__container{
      max-width: 100%;
      margin: 0 auto;
      padding: 0rem;
      @include breakpoint(desktop){
        padding: 1rem;
        max-width: 512px;
      }
    }
    &--white{
      padding: 2rem 1rem;
      width: calc(100% - 2rem);

    }
  }
  /* styles for the sign up description */
  &__info-container{
    @include breakpoint(desktop){
      max-width: 350px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin: 2rem auto 0 auto;
    }
  }
  &__description{
    display: none;
    @include breakpoint(desktop){
      display: block;
      color: $white;
      border-bottom: solid 1px $white;
    }
    &__heading{
      font-family: $rubik;
      font-weight: 500;
      font-size: 2rem;
      letter-spacing: 1px;
    }
    &__copy{
      margin: 2rem 0;
      font-size: 1rem;
      letter-spacing: 1px;
    }
  }
  &__cost{
    background: $blue;
    color: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    @include breakpoint(desktop){
      background: transparent;
      flex-direction: column;
      align-items: flex-start;
    }
    &__copy{
      margin: 1rem 0;
    }
    &__price{
      font-size: 1rem;
      font-family: $rubik;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-left: 0.25rem;
      @include breakpoint(desktop){
        font-size: 2rem;
        margin-left: 0;
      }
    }
  }
}

</style>
