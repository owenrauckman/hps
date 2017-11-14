<template>
  <div class="m__create">
    <h1 class="m__create__heading">Login</h1>

    <form class="m__create__account m__login__container">
      <div class="m__create__account--full">
        <v-text-field
          label="Username"
          v-model="credentials.username"
          v-validate="'required'"
          data-vv-name="username"
          data-vv-as="Username"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('username')"
          required
        ></v-text-field>
      </div>

      <div class="m__create__account--full">
        <v-text-field
          label="Password"
          type="password"
          v-model="credentials.password"
          v-validate="'required'"
          data-vv-name="password"
          data-vv-as="Password"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('password')"
          required
        ></v-text-field>
      </div>
      <div v-if="snackbarText.length > 0" class="m__login__error">
        <router-link to="/forgot-password" class="m__login__error--forgot">Forgot your password?</router-link>
      </div>
      <button class="m__create__button m__login__button" type="submit" @click="login">Login</button>
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
  beforeMount() {
    // if the user clicks this and is already logged in, take them to their account
    this.checkAuth().then((response) => {
      if (response.status) {
        this.$router.push('/account');
      }
    });
  },
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: '',
    };
  },
  methods: {
    ...mapActions({ loginUser: 'loginUser', checkAuth: 'checkAuth' }),

    /*
      Log a user in and route or show error message accordingly
    */
    login(e) {
      e.preventDefault();

      this.$validator.validateAll().then((isValidated) => {
        if (isValidated) {
          this.loginUser(this.credentials).then((response) => {
            if (response.status) {
              this.$router.push('/account');
            } else {
              this.showSnackbar = true;
              this.snackbarText = response.errorMessage;
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
