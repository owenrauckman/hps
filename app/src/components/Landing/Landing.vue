<template>
  <div class="m__landing">
    <div class="m__landing-top m__landing--box">
      <Hero/>
      <Search/>
    </div>
    <Results class="m__landing--box"/>
  </div>
</template>

<script>
import Search from '@/components/Landing/Search';
import Hero from '@/components/Landing/Hero';
import Results from '@/components/Landing/Results';

export default {
  components: { Search, Hero, Results },
};
</script>

<style scoped lang="scss">
@import '../../sass/main.scss';
.m{
  &__landing{
    display: flex;
    flex-direction: column;
    flex: 1;
    &-top{
      padding: 0 2rem;
      margin: 0 auto;
      width: 100%;
      max-width: 1200px;
    }
    &--box{
      flex: 1;
    }
  }
}

</style>
