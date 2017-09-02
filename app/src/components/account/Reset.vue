<template>
  <div class="temp">
    <h1>RESET PASSWORD</h1>

    <form>
      <input type="password" v-model="credentials.password">
      <button type="submit" @click="submitPasswordReset">Log In</button>
    </form>

    <div v-if="showError">Something went wrong</div>

  </div>
</template>

<script>
import axios from 'axios';

const config = require('../../../config/appConfig.json');

export default {
  name: 'reset',
  data() {
    return {
      showError: false,
      credentials: {
        token: this.$route.query.token,
        password: '',
      },
    };
  },
  mounted() {
    document.body.classList.add('g__body__gray');
  },
  methods: {
    submitPasswordReset(e) {
      e.preventDefault();

      // Reset password API
      // todo: double check password confirmation
      axios.post(`${config.api}/users/resetPassword`, this.credentials, { withCredentials: true })
        .then((response) => {
          /* eslint-disable */
          if (response.data.success === true) {
            this.showError = false;
            this.$router.push('/login');
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';

.temp{
  margin-top: 120px;
}

</style>
