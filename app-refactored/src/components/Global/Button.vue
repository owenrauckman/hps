<template>
  <button
    :class="[
      'g__button',
      `g__button--${color}`,
      `g__button--${size}`,
      `g__button--${textTransform}`
    ]
  ">
    {{content}}
  </button>
</template>



<script>

export default {
  name: 'Button',
  props: [
    'color',
    'size',
    'content',
    'textTransform',
  ],
};
</script>

<style lang="scss">
@import '../../sass/main.scss';

.g__button{
  border-radius: $round-radius;
  transition: $transition-regular;
  margin: 0 0.5rem;
  &:hover{
    cursor: pointer;
  }
  /*
  ------------------------------
  Colors
  ------------------------------
  */
  // Blue
  &--blue{
    background: $blue;
    border: solid 1px $blue;
    color: $white;
    // Inverted
    &-inverted{
      background: transparent;
      border: solid 1px $blue;
      color: $blue;
    }
  }
  // Transparent
  &--transparent{
    background: transparent;
    border: solid 1px $white;
    color: $white;
    // Inverted
    &-inverted{
      background: transparent;
      border: solid 1px transparent;
      color: $white;
    }
  }

  /*
  ------------------------------
  Sizes
  ------------------------------
  */
  &--xl{
    font-size: $text-xl;
    padding: $button-pad-xl;
  }
  &--lg{
    font-size: $text-lg;
    padding: $button-pad-lg;
  }
  &--md{
    font-size: $text-md;
    padding: $button-pad-md;
  }
  &--sm{
    font-size: $text-sm;
    padding: $button-pad-sm;
  }
  &--xs{
    font-size: $text-xs;
    padding: $button-pad-xs;
  }
  /*
  ------------------------------
  Text Transform
  ------------------------------
  */
  &--uppercase{
    text-transform: uppercase;
  }
  &--regular{
    text-transform: none;
  }
}

</style>
