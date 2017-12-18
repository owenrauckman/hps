<template>
  <svg class="h__hamburger" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M3.642 23.66h92.716M3.642 50h92.716M3.642 76.338h92.716" fill="none" stroke="#fff" stroke-width="3.86316"/></svg>
</template>
<style scoped lang="scss">

.h{
  &__hamburger{
    height: 35px;
    width: auto;
    display: flex;
    @include breakpoint('tablet'){
      display: none;
    }
    path{
      stroke: $dark-grey;
    }
    &:hover{
      cursor: pointer;
    }
  }
}
</style>
