<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Personal Information</h2>
    <div class="signup__section__form">
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" type="text" placeholder="*First Name"/>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" type="text" placeholder="*Last Name"/>
      </div>
      <div class="signup__section__form--full">
        <input class="signup__section__form__input" type="text" placeholder="*Username"/>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" type="email" placeholder="*Email Address"/>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" type="tel" placeholder="*Phone Number"/>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" type="password" placeholder="*Password"/>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" type="password" placeholder="*Repeat Password"/>
      </div>
    </div>

    <router-link to="/signup/companies" class="signup__section__button">Continue</router-link>

  </div>
</template>

<script>

export default {
  name: 'personal-info',
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
  &__form{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    &__input{
      color: $gray-dark;
      box-sizing: border-box;
      border: solid 1px $gray-border;
      border-radius: $border-radius;
      height: 50px;
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

</style>
