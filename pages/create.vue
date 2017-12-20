<template>
  <div>
    <div class="m__progress-bar" :style="`width: ${this.progressBar}%`"></div>
    <nuxt/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  fetch ({ params, redirect }) {
    redirect(301, '/create/select-company-and-states')
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
