<template>
  <div class="temp">
    <h1>{{message}}</h1>
  </div>
</template>

<script>
import axios from 'axios';

const config = require('../../../config/appConfig.json');

export default {
  name: 'login',
  data() {
    return {
      message: '',
    };
  },
  beforeMount() {
    this.checkAuth();
  },
  mounted() {
    document.body.classList.add('g__body__gray');
  },
  methods: {
    checkAuth() {
      // login API
      axios.get(`${config.api}/users/secret`, { withCredentials: true })
        .then((response) => {
          console.log(response);
          if (response.data.success === true) {
            this.$store.state.isLoggedIn = true;
            this.message = 'YOU ARE LOGGED IN';
          } else {
            this.message = 'NOT AUTHORIZED';
          }
        })
        .catch((error) => {
          if (error) {
            this.message = 'SOME ERROR HAPPENED';
          }
        });
    },
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
