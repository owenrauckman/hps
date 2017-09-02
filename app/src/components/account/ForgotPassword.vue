<template>
  <div class="temp">
    <h1>Forgot Password?</h1>

    <form>
      <input type="text" v-model="emailAddress">
      <button type="submit" @click="submitEmailAddress">Submit</button>
    </form>

    <div v-if="showError">Something went wrong</div>
    <div v-if="showCheckEmailMessage">Please check your email address for a reset link</div>

    Still need help? Contact us...

  </div>
</template>

<script>
import axios from 'axios';

const config = require('../../../config/appConfig.json');

export default {
  name: 'forgotPassword',
  data() {
    return {
      showError: false,
      showCheckEmailMessage: false,
      emailAddress: '',
    };
  },
  mounted() {
    document.body.classList.add('g__body__gray');
  },
  methods: {
    submitEmailAddress(e) {
      e.preventDefault();

      // Forgot password API
      axios.post(`${config.api}/users/forgotPassword`, { emailAddress: this.emailAddress }, { withCredentials: true })
        .then((response) => {
          console.log(response);
          /* eslint-disable */
          if (response.data.success === true) {
            this.showError = false;
            this.showCheckEmailMessage = true;
          } else {
            this.showError = true;
            this.showCheckEmailMessage = false;
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
