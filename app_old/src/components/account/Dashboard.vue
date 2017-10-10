<template>
  <div class="temp">
    <h1>DASHBOARD</h1>

    <h2>ID</h2>
    <p>{{data._id}}</p>

    <h2>FIRST NAME</h2>
    <p>{{data.lastName}}</p>

    <h2>LAST NAME</h2>
    <p>{{data.firstName}}</p>

    <h2>USERNAME</h2>
    <p>{{data.username}}</p>

    <h2>PASSWORD</h2>
    <p>{{data.password}}</p>

    <h2>Email</h2>
    <p>{{data.emailAddress}}</p>

    <h2>Subscription Items</h2>
    <p>{{data.subscriptionItems}}</p>

    <h2>Company</h2>
    <p>{{data.company}}</p>

  </div>
</template>

<script>

export default {
  name: 'dashboard',
  data() {
    return {
      message: '',
      data: {},
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
      this.axios.get(`${this.$config.default.api}/users/dashboard`, { withCredentials: true })
        .then((response) => {
          if (response.data.status === true) {
            this.data = response.data.user;
            this.$store.state.search.isLoggedIn = true;
            this.message = 'YOU ARE LOGGED IN';
          } else {
            this.message = 'NOT AUTHORIZED';
            this.$store.state.search.isLoggedIn = false;
            this.$router.push('/login');
          }
        })
        .catch((error) => {
          if (error) {
            // todo 500 page
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
