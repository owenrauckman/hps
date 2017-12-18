<template>
  <div class="m__create">
    <h1 class="m__create__heading">Success</h1>
    <p class="m__create__description">Thanks for signing up! Welcome to the community!</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      progressBar: 'progressBar'
    })
  }
}
</script>


<style scoped lang="scss">

.m{
  &__progress-bar{
    background: $pink;
    border-radius: 0px 5px 5px 0px;
    height: 5px;
    width: 100%;
    transition: width 0.25s ease-in-out;
  }
}

</style>
