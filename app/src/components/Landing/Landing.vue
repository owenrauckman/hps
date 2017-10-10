<template>
  <div>
    <div class="m__landing-top">
      <Hero/>
      <Search/>
    </div>
    <Results/>
  </div>
</template>

<script>
import Search from '@/components/Landing/Search';
import Hero from '@/components/Landing/Hero';
import Results from '@/components/Landing/Results';

export default {
  components: { Search, Hero, Results },
  mounted() {

  },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';
.m{
  &__landing-top{
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 1200px;
  }
}

</style>
