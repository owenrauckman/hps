<template>
  <router-link :to="options.username" :class="['card', { 'card--purple': ownsPremiumState }]">
    <div class="card__image" :style="{ 'background-image': `url('${options.profilePicture}')` }"></div>
    <div class="card__info">
      <h2 class="card__info__name">{{options.firstName}} {{options.lastName}}</h2>
      <h3 class="card__info__company">{{options.company.name}}</h3>
    </div>
    <div v-if="ownsPremiumState || ownsPremiumCity" class="card__verified"></div>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'card',
  data () {
    return {
      ownsPremiumState: false,
      ownsPremiumCity: false
    }
  },
  props: ['options'],
  computed: {
    ...mapGetters(['loadingResults', 'results', 'isResults', 'hideBasicCards'])
  },
  methods: {
    /*
      Checks for premium/premium type before mount and sets accordingly.
    */
    checkForPremium () {
      this.options.company.areasServed.forEach((area) => {
        /*
          checks for premium states
          (checks for === '' for the home page since only premium shows)
        */
        if ((this.results.data.query.state === area.state && area.ownsPremium) || (this.results.data.query.state === '')) {
          this.ownsPremiumState = true
        }
        /* checks for premium cities */
        area.cities.forEach((city) => {
          if (this.results.data.query.city === city.city &&
            this.results.data.query.state === area.state &&
            city.ownsPremium) {
            this.ownsPremiumCity = true
          } else if (city.ownsPremium && this.results.data.query.city === '' && area.state === this.results.data.query.state) {
            /* if they only search for state, we at least want the badge ^^ and city in state? */
            this.ownsPremiumCity = true
          }
        })
      })
    }
  },
  beforeMount () {
    this.checkForPremium()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $card-image-width: 75px;

  .card{
    display: flex;
    flex-direction: column;
    padding: 2rem;
    margin: 1rem;
    border-radius: $border-radius;
    position: relative;
    flex: 1 0 calc(100% - 4rem);
    box-shadow: none;
    transform: scale(1);
    transition: transform 0.2s ease-in-out;

    @include breakpoint('phone'){
      flex: 1 0 calc((100% / 2) - 2rem);
      max-width: calc((100% / 2) - 2rem);
    }
    @include breakpoint('desktop'){
       flex: 1 0 calc((100% / 3) - 2rem);
       max-width: calc((100% / 3) - 2rem);
     }
     &:link, &:active, &:visited{
       text-decoration: none;
     }
     &:hover{
       transform: scale(0.975);
     }
     // VARIATIONS
     &--purple{
       border: solid 1px $purple !important;
     }
     &__verified{
       position: absolute;
       top: 1.25rem;
       right: 1.25rem;
       background: url('../../static/svg/check.svg');
       height: 1.25rem;
       width: 1.25rem;
     }

     // OTHER ELEMENTS IN CARD
     &__image{
       display: block;
       margin: 0 auto;
       width: $card-image-width;
       height: $card-image-width;
       border-radius: $circle-radius !important;
       background-size: cover;
       background-position: center;
     }
     &__info{
       margin: 1rem 0 0 0;
       text-align: center;
       line-height: 2rem;
       &__name{
         font-family: $montserrat;
         color: $purple;
         font-size: 1.25rem;
       }
       &__company{
         font-family: $rubik;
         font-weight: 400;
         color: $medium-grey;
         text-transform: uppercase;
         font-size: 0.9rem;
       }
     }
  }
</style>
