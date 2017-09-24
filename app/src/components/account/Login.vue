<template>
  <div class="temp">
  <h1>LOGIN</h1>
  <form>
    <input type="text" v-model="credentials.username">
    <input type="password" v-model="credentials.password">
    <button type="submit" @click="login">Log In</button>
  </form>
  <div v-if="showError">Something went wrong, will be more specific later </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      showError: false,
    };
  },
  mounted() {
    document.body.classList.add('g__body__gray');
  },
  methods: {
    login(e) {
      e.preventDefault();

      // login API
      this.axios.post(`${this.$config.default.api}/users/login`, this.credentials, { withCredentials: true })
        .then((response) => {
          /* eslint-disable */
          if (response.data.success === true) {
            this.$store.state.temp.isLoggedIn = true;
            this.$router.push('/account');
          } else {
            this.showError = true;
          }
        })
        .catch((error) => {
          if (error) {
            this.showError = true;
          }
        });

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';

.temp{
  margin-top: 120px;
}

</style>
