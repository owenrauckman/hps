<template>
  <div class="m__create">
    <h1 class="m__create__heading">Forgot Your Password?</h1>
    <p class="m__create__description">That's okay! Enter your email address below to receieve a password reset link.</p>

    <form class="m__create__account m__login__container">
      <div class="m__create__account--full">
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
        <p class="m__login__error--forgot">Still having issues? <router-link to="/contact" class="m__login__error--forgot">Contact Us</router-link></p>
      </div>
      <button class="m__create__button m__login__button" type="submit" @click="submitEmailAddress">Submit</button>
    </form>

    <!-- snackbar -->
    <v-snackbar
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      :multi-line="true"
      v-model="showSnackbar"
    >
      {{ snackbarText }}
      <v-btn dark flat @click.native="showSnackbar = false">Close</v-btn>
    </v-snackbar>

  </div>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      showError: false,
      emailAddress: '',
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: '',
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
            this.showSnackbar = true;
            if (response.showError === false) {
              this.snackbarColor = 'success';
              this.snackbarText = 'Please check your email address for a password reset link.';
            } else {
              this.snackbarColor = 'pink lighten-1';
              this.snackbarText = 'Whoops, something went wrong. Please try again.';
              this.showError = response.showError;
            }
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
