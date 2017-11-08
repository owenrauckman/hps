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
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      data: {},
    };
  },
  beforeMount() {
    this.checkAuth().then((response) => {
      if (response.status) {
        this.data = response.data;
      } else {
        this.$router.push('/login');
      }
    });
  },
  methods: {
    ...mapActions({ checkAuth: 'checkAuth' }),
  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';

</style>
