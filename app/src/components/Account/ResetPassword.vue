<template>
  <div class="m__create">
    <h1 class="m__create__heading">Reset Password</h1>
    <p class="m__create__description">Type in your new password below.</p>

    <form class="m__create__account m__login__container">
      <div class="m__create__account--half">
        <v-text-field
          label="Password"
          type="password"
          v-model="credentials.password"
          v-validate="'required'"
          data-vv-name="passowrd"
          data-vv-as="Password"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('password')"
          required
          id="password"
        ></v-text-field>
      </div>
      <div class="m__create__account--half">
        <v-text-field
          label="Confirm Password"
          type="password"
          v-model="passwordConfirm"
          v-validate="'required|confirmed:#password'"
          data-vv-name="passwordConfirm"
          data-vv-as="Password Confirmation"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('passwordConfirm')"
          required
        ></v-text-field>
      </div>
      <div v-if="showError" class="m__login__error">
        <p class="m__login__error--message">Something went wrong. Please try again.</p>
        <p class="m__login__error--forgot">Still having issues? <router-link to="/contact" class="m__login__error--forgot">Contact Us</router-link></p>
      </div>
      <button class="m__create__button m__login__button" type="submit" @click="submitPasswordReset">Submit</button>
    </form>
  </div>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      showError: false,
      passwordConfirm: '',
      credentials: {
        token: this.$route.query.token,
        password: '',
      },
    };
  },
  methods: {
    ...mapActions({ resetPassword: 'resetPassword' }),

    /*
      Validates the two passwords, updates password, routes, or displays error message
    */
    submitPasswordReset(e) {
      e.preventDefault();
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated) {
          this.resetPassword(this.credentials).then((response) => {
            if (response.status === true) {
              this.showError = false;
              this.$router.push('/login');
            } else {
              this.showError = true;
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
