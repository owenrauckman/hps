<template>
  <div>
    {{content}}
  </div>
</template>

<script>

export default {
  name: 'Navigation',
  data() {
    return {
      content: 'This is the nav',
    };
  },
};
</script>

<style lang="scss">
@import '../../sass/main.scss';

</style>
