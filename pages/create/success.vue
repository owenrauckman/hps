<template>
  <div class="m__create">
    <h1 class="m__create__heading">Success</h1>
    <p class="m__create__description">Thanks for signing up! Welcome to the community!</p>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutationTypes'

export default {
  mounted () {
    this.UPDATE_PROGRESS_BAR(100)
  },
  computed: {
    ...mapGetters({
      progressBar: 'progressBar'
    })
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR])
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
