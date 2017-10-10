<template>
  <div id="app">
    <v-app class="m__app">
      <AppHeader/>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import AppHeader from '@/components/Header/AppHeader';

export default {
  name: 'app',
  components: { AppHeader },
};
</script>

<style lang="scss">
@import './sass/main.scss';
.m__app{
  background: $white !important; // vuetify override
}

</style>
