<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Personal Information</h2>
    <div class="signup__section__form">
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('first_name') },'signup__section__form__input']" v-model="$store.state.signUpInfo.firstName" v-validate="{ rules: { required: true} }" type="text" name="first_name" placeholder="*First Name"/>
        <span v-show="errors.has('first_name')" class="signup__section__form__error">Please enter your first name.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('last_name') },'signup__section__form__input']" v-model="$store.state.signUpInfo.lastName" v-validate="{ rules: { required: true} }" type="text" name="last_name" placeholder="*Last Name"/>
        <span v-show="errors.has('last_name')" class="signup__section__form__error">Please enter your last name.</span>
      </div>
      <div class="signup__section__form--full">
        <input :class="[{ 'signup__section__form__input--error': errors.has('username') },'signup__section__form__input']" v-model="$store.state.signUpInfo.username" v-validate="{ rules: { required: true} }" type="text" name="username" placeholder="*Username"/>
        <span v-show="errors.has('username')" class="signup__section__form__error">Please enter a username.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('email') },'signup__section__form__input']" v-model="$store.state.signUpInfo.emailAddress" v-validate="{ rules: { required: true, email: true } }" type="email" name="email" placeholder="*Email Address"/>
        <span v-show="errors.has('email')" class="signup__section__form__error">Please enter a valid email address.</span>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" v-model="$store.state.signUpInfo.phoneNumber" type="tel" placeholder="Phone Number"/>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('password') },'signup__section__form__input']" v-model="$store.state.signUpInfo.password" v-validate="{ rules: { required: true } }" type="password" name="password" placeholder="*Password"/>
        <span v-show="errors.has('password')" class="signup__section__form__error">Please enter a password.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('password_confirmation') },'signup__section__form__input']"  v-model="repeatPassword" type="password" v-validate="'required|confirmed:password'" name="password_confirmation" data-vv-as="password" placeholder="*Repeat Password"/>
        <span v-show="errors.has('password_confirmation')" class="signup__section__form__error">Your password confirmation does not match</span>
      </div>
    </div>

    <!-- link to next page in process -->
    <a @click="validateForm" class="signup__section__button">Continue</a>

  </div>
</template>

<script>

export default {
  name: 'personal-info',
  data() {
    return {
      repeatPassword: '',
    };
  },
  methods: {
    validateForm() {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          this.$router.push('/signup/companies');
        }
      });
    },
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
    &__error{
      font-size: 0.8rem;
      color: $red-orange;
      display: block;
    }
    &__input{
      color: $gray-dark;
      box-sizing: border-box;
      border: solid 1px $gray-border;
      border-radius: $border-radius;
      height: 50px;
      margin: 1rem 0;
      padding: 1rem;
      width: 100%;
      &--error{
        border: solid 1px $red-orange;
      }
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
