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
import axios from 'axios';

const config = require('../../../config/appConfig.json');

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
      axios.post(`${config.api}/users/login`, this.credentials)
        .then((response) => {
          /* eslint-disable */
          console.log(response.data.success);
          if (response.data.success === true) {
            this.$router.push('/signup/success');
          } else {
            alert('nawh');
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
