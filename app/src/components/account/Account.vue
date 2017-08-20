<template>
  <div class="temp">
  {{data}}
  </div>
</template>

<script>
import axios from 'axios';

const config = require('../../../config/appConfig.json');

export default {
  name: 'login',
  data() {
    return {
      data: '',
    };
  },
  beforeMount() {
    this.getData();
  },
  mounted() {
    document.body.classList.add('g__body__gray');
  },
  methods: {
    getData() {
      // login API
      axios.get(`${config.api}/users/account`, {
        headers: { Authorization: `Bearer ${this.getCookie(config.jwtCookieName)}` },
        withCredentials: true,
      },
      )
        .then((response) => {
          /* eslint-disable */
          if (response.status === 200) {
            this.data = response.data.user;
          } else {
            this.$router.push('/login');
          }
        })
        .catch((error) => {
          if (error) {
            this.$router.push('/login');
          }
        });
    },
    /*
      Gets a cookie from the list of cookies
      @param {string} name of cookie to retrieve
    */
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return false;
    },
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
