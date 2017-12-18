<template>
  <v-app>
    <appHeader/>
    <nuxt/>
    <appFooter/>
  </v-app>
</template>

<script>
import AppHeader from '@/components/Header/AppHeader'
import AppFooter from '@/components/Footer/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style>
.container
{
  margin: 0;
  width: 100%;
  padding: 100px 0;
  text-align: center;
}

.button, .button:visited
{
  display: inline-block;
  color: black;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #000;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover, .button:focus
{
  color: #fff;
  background-color: #000;
}

.title
{
  color: #000;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>
