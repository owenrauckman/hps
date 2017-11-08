<template>
  <div class="m__create">
    <h1 class="m__create__heading">Forgot Your Password?</h1>
    <p class="m__create__description">That's okay! Enter your email address below to receieve a password reset link.</p>

    <form class="m__create__account m__login__container">
      <div class="m__create__account--half">
        <v-text-field
          label="Email Address"
          type="email"
          v-model="emailAddress"
          v-validate="'required'"
          data-vv-name="emailAddress"
          data-vv-as="Email Address"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('emailAddress')"
          required
        ></v-text-field>
      </div>
      <div v-if="showError" class="m__login__error">
        <p class="m__login__error--message">Something went wrong. Please try again.</p>
        <p class="m__login__error--forgot">Still having issues? <router-link to="/contact" class="m__login__error--forgot">Contact Us</router-link></p>
      </div>
      <div v-if="showCheckEmailMessage" class="m__login__error">
        <p class="m__login__error--message">Please check your email address for a password reset link.</p>
      </div>
      <button class="m__create__button m__login__button" type="submit" @click="submitEmailAddress">Submit</button>
    </form>
  </div>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      showError: false,
      showCheckEmailMessage: false,
      emailAddress: '',
    };
  },
  methods: {
    ...mapActions({ sendResetPasswordLink: 'sendResetPasswordLink' }),

    /*
      Submits an email address for password reset and adjusts UI state as necessary
    */
    submitEmailAddress(e) {
      e.preventDefault();
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated) {
          this.sendResetPasswordLink(this.emailAddress).then((response) => {
            this.showError = response.showError;
            this.showCheckEmailMessage = response.showCheckEmailMessage;
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
