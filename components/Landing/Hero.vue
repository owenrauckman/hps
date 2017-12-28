<template>
  <h1 class="m__hero">
    Find and build your<br class="m__hero__line-break"> Direct sales team today
  </h1>
</template>

<script>

export default {
  mounted () {
  }
}
</script>

<style scoped lang="scss">
.m__hero{
  font-family: $montserrat;
  font-weight: 500;
  text-align: right;
  letter-spacing: 0.1rem;
  color: $dark-grey;
  line-height: 2rem;
  font-size: 2.5rem;
  margin: 2rem 0;
  @include breakpoint('tablet'){
    font-size: 3.5rem;
    line-height: 4rem;
    margin: 4rem 0;
  }
  &__line-break{
    display: none;
    @include breakpoint('phone'){
      display: block;
    }
  }
}
</style>
