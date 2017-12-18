<template>
  <div>
    <div class="m__create">
      <!-- toggle menu -->
      <nav class="e__nav">
        <router-link to="/account/info/profile" :class="[{'e__nav__link--active': !isAboutRoute}, 'e__nav__link']">Profile</router-link>
        <router-link to="/account/info/about" :class="[{'e__nav__link--active': isAboutRoute}, 'e__nav__link']">About</router-link>
      </nav>

      <!-- nested views -->
      <nuxt/>
  </div>
  </div>
</template>

<script>
export default{
  computed: {
    isAboutRoute () {
      return this.$route.path.includes('about')
    }
  }
}
</script>
<style lang="scss">

.e{
  &__nav{
    font-family: $montserrat;
    font-weight: 600;
    font-size: 1.5rem;
    letter-spacing: 0.05rem;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    &__link{
      margin: 0 0.5rem;
      &:link, &:visited,&:active{
        color: lighten($medium-grey, 30%);
        text-decoration: none;
      }
      &--active{
        &:link, &:visited,&:active{
          color: $dark-grey;
        }
      }
      &:hover{
        color: $purple;
      }
    }
  }
}

</style>
