<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Success!</h2>
    <div class="signup__section__form__container">
      <p class="signup__section__copy">Thanks for signing up! Login any time to update your account!</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'success',
  data() {
    return {
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';


.signup__section{
  display: flex;
  flex-direction: column;
  margin: 0;
  @include breakpoint(desktop){
    margin: 0 2rem;
  }
  &__heading{
    font-size: 1.25rem;
    color: $gray-dark;
  }
  &__label{
    display: block;
    margin: 1rem 0;
    color: $gray-dark;
  }
  &__copy{
    font-size: 0.9rem;
    margin: 1rem 0;
    color: $gray-light;
    &--disclaimer{
      font-style: italic;
      text-align: right;
    }
    a:link, a:visited, a:active, a:hover{
      color: $blue;
    }
  }
  &__form{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    &__container{
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      margin: 2rem 0 0 0;
    }
    &__box{
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      margin: 1rem 0 1rem 1rem;
      &--state{
        margin: 0 0 2rem 0;
      }
    }

    /* button toggles */
    &__switch-button {
      position: relative;
      display: block;
      width: 60px;
      height: 30px;
      border-radius: 30px;
      background: linear-gradient(to bottom right, lighten($gray-light, 5%), lighten($gray-light, 5%));
      transition: all .25s ease-in;
    }

    &__switch-button:before {
      content: "";
      position: absolute;
      left: 5px;
      right: 5px;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform .25s ease-in-out;
    }
    &__hide-checkbox {
      position: absolute;
      left: -9999px;
      opacity: 0;
    }
    /* toggle the checked styles here */
    &__hide-checkbox:checked + .signup__section__form__switch-button {
      background: linear-gradient(to bottom right, transparentize($orange, 0.05), transparentize($red-orange, 0.05));
    }
    &__hide-checkbox:checked + .signup__section__form__switch-button:before {
      transform: translate3d(calc(100% + 10px),0,0);
    }
    /* end button toggles */

    &__input{
      color: $gray-dark;
      box-sizing: border-box;
      border: solid 1px $gray-border;
      border-radius: $border-radius;
      height: 60px;
      margin: 1rem 0;
      padding: 1rem;
      width: 100%;
    }
    &--half{
      width: 100%;
      @include breakpoint(phone){
        width: calc(50% - 1rem);
      }
    }
    &--full{
      width: 100%;
    }
  }
  &__button{
    margin-top: 1rem;
    align-self: flex-end;
    color: $white;
    font-size: 0.9rem;
    padding: 1rem 2rem;
    border-radius: $round-radius;
    box-shadow: $box-shadow;
    background: $blue;
    transition: all 0.25s ease-in-out;
    text-decoration: none;
    cursor: pointer;
    &:hover{
      background: darken($blue, 10%);
    }
  }
}

/* Stripe Specific Styles */
.StripeElement {
  background-color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
