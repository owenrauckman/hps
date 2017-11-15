<template>
  <div id="app">
    <v-app class="m__app">
      <AppHeader/>
      <router-view class="m__app__main"></router-view>
      <AppFooter/>
    </v-app>
  </div>
</template>

<script>
import AppHeader from '@/components/Header/AppHeader';
import AppFooter from '@/components/Footer/AppFooter';

export default {
  name: 'app',
  components: { AppHeader, AppFooter },
};
</script>

<style lang="scss">
@import './sass/main.scss';
.m__app{
  background: $white !important; // vuetify override
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  &__main{
    flex: 1 0 auto;
  }
}

</style>
