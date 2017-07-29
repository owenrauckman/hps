<template>
  <router-link :to="options.username" :class="[{ 'card--white': ownsPremiumCity && !ownsPremiumState }, { 'card--blue': ownsPremiumState }, { 'card--white': !ownsPremiumState }, 'card']">
    <div class="card__image" :style="{ 'background-image': `url('${options.profilePicture}')` }"></div>
    <div class="card__info">
      <h2 class="card__info__name">{{options.firstName}} {{options.lastName}}</h2>
      <h3 class="card__info__company">{{options.company.name}}</h3>

      <h4 class="card__info__location">
        <span v-if="$store.state.filterQueries.city.name.length > 0">{{$store.state.filterQueries.city.name}},</span>
        {{$store.state.filterQueries.state.name}}
      </h4>
    </div>
    <a class="card__button" href=""></a>
    <div v-if="ownsPremiumState" class="card__verified--light"></div>
    <div v-else-if="ownsPremiumCity" class="card__verified--dark"></div>
  </router-link>
</template>

<script>
export default {
  name: 'card',
  data() {
    return {
      ownsPremiumState: false,
      ownsPremiumCity: false,
    };
  },
  props: ['options'],
  methods: {
    /*
      Checks for premium/premium type before mount and sets accordingly.
    */
    checkForPremium() {
      this.options.company.areasServed.forEach((area) => {
        /*
          checks for premium states
          (checks for === '' for the home page since only premium shows)
        */
        if ((this.$store.state.results.query.state === area.state && area.ownsPremium) || (this.$store.state.results.query.state === '')) {
          this.ownsPremiumState = true;
        }
        /* checks for premium cities */
        area.cities.forEach((city) => {
          if (this.$store.state.results.query.city === city.city
            && this.$store.state.results.query.state === area.state
            && city.ownsPremium) {
            this.ownsPremiumCity = true;
          } else if (city.ownsPremium && this.$store.state.results.query.city === '' && area.state === this.$store.state.results.query.state) {
            /* if they only search for state, we at least want the badge ^^ and city in state? */
            this.ownsPremiumCity = true;
          }
        });
      });
    },
  },
  beforeMount() {
    this.checkForPremium();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../../sass/main.scss';
  /* Component Specific Settings */
  $card-image-width: 75px;

  /* Component Styles */
  .card{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 2rem 1rem;
    margin: 1rem;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    position: relative;
    transform: scale(1);
    /* flex info for card. 4rem is extra padding, must have max-width and flex */
    flex: 1 0 calc(100% - 4rem);
    max-width: calc(100% - 4rem);
    transition: flex 0.25s ease-in, max-width 0.25s ease-out, transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
    @include breakpoint(phone){
       flex: 1 0 calc((100% / 2) - 4rem);
       max-width: calc((100% / 2) - 4rem);
     }
    @include breakpoint(desktop){
       flex: 1 0 calc((100% / 3) - 4rem);
       max-width: calc((100% / 3) - 4rem);
     }
     /* end flex info for card */
    &:link, &:active, &:visited{
      text-decoration: none;
    }
    &:hover{
      cursor: pointer;
      text-decoration: none;
      transform: scale(1.01);
      box-shadow: 0px 5px 20px transparentize($black, 0.9);

    }
    &--white{
      background: $white;
      .card__image{
        border: solid 1px $gray-medium;
      }
      .card__info__name{
        color: $gray-medium;
      }
      .card__info__company, .card__info__location{
        color: $gray-light;
      }
    }
    &--blue{
      background: $blue;
      .card__image{
        border: solid 1px $white;
      }
      .card__info__name{
        color: $white;
      }
      .card__info__company, .card__info__location{
        color: $white-80;
      }
    }
    /* Card Contents */
    &__image{
      width: $card-image-width;
      height: $card-image-width;
      border-radius: $circle-radius;
      background-size: cover;
      background-position: center;
    }
    &__info{
      margin: 1rem;
      width: calc(100% - #{$card-image-width} - 2.5rem);
      &__name{
        letter-spacing: 0.5px;
        font-weight: 400;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
      }
      &__company{
        letter-spacing: 1.5px;
        font-weight: 400;
        font-size: 0.6rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }
      &__location{
        letter-spacing: 0.5px;
        font-weight: 300;
        font-style: italic;
        font-size: 0.75rem;
      }
    }
    &__verified--dark{
      position: absolute;
      top: 0.5rem;
      right: 1rem;
      background: url('../../../static/svg/verified-dark.svg');
      height: 25px;
      width: 25px;
    }
    &__verified--light{
      position: absolute;
      top: 0.5rem;
      right: 1rem;
      background: url('../../../static/svg/verified-light.svg');
      height: 25px;
      width: 25px;
    }
    /* Button CTA */
    &__button{
      position: absolute;
      right: 1.5rem;
      content: '';
      height: 10px;
      width: 10px;
      top: 50%;
      transform: translateX(0px) rotate(-90deg);
      background: url('../../../static/svg/arrow-white.svg');
    }
  }
</style>
