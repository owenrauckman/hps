<template>
  <div class="m__header">
    <HeaderLogo/>
    <AppMenu/>
  </div>
</template>

<script>
import HeaderLogo from '@/components/Svg/HeaderLogo';
import AppMenu from '@/components/Header/AppMenu';

export default {
  components: { HeaderLogo, AppMenu },
  data() {
    return {
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';

.m{
  &__header{
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
  }
}
</style>
