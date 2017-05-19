<template>
  <div :class="[{ 'card--purple': ownsPremiumState }, { 'card--white': !ownsPremiumState }, 'card']">
    <img class="card__image" :src="options.profilePicture"/>
    <div class="card__info">
      <h2 class="card__info__name">{{options.firstName}} {{options.lastName}}</h2>
      <h3 class="card__info__company">
        <span v-for="(company, index) in options.companies">
          {{company.name}}
          <span v-if="index+1 < options.companies.length"> / </span>
        </span>
      </h3>

      <h4 class="card__info__location">
        <span v-if="$store.state.filterQueries.city.name.length > 0">{{$store.state.filterQueries.city.name}},</span>
        {{$store.state.filterQueries.state.name}}
      </h4>
    </div>
    <div class="card__button-container">
      <a class="card__button" href="">{{viewProfile}}</a>
    </div>
    <div v-if="ownsPremiumState || ownsPremiumCity " class="card__verified"></div>
  </div>
</template>

<script>
export default {
  name: 'card',
  data() {
    return {
      viewProfile: 'View Profile',
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
      this.options.companies.forEach((company) => {
        company.areasServed.forEach((area) => {
          /*
            checks for premium states
            (checks for === '' for the home page since only premium shows)
          */
          if ((this.$store.state.results.query.state === area.state && area.ownsPremium) || (this.$store.state.results.query.state === '')) {
            this.ownsPremiumState = true;
          }
          /* checks for premium cities */
          area.cities.forEach((city) => {
            console.log(`${this.options.username} : ${city.city} : ${city.ownsPremium}`);
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
    padding: 1rem;
    margin: 1rem 0;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    position: relative;
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
    &--purple{
      background: $neon-purple;
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
    &__verified{
      position: absolute;
      top: 0.5rem;
      right: 1rem;
      background: url('../../../static/svg/verified.svg');
      height: 30px;
      width: 30px;
    }
    /* Button CTA */
    &__button-container{
      display: flex;
      width: 100%;
      justify-content: flex-end;
    }
    &__button{
      padding: 0.5rem 1rem;
      font-size: 0.6rem;
      border-radius: $border-radius;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 300;
      transition: background 0.2s ease-in;
      &:link, &:visited, &:active{
        background: $light-blue;
        box-shadow: $box-shadow;
        text-decoration: none;
        color: $white;
      }
      &:hover{
        background: lighten($light-blue, 5%);
        text-decoration: none;
        &:after{
          transform:translateX(2px) rotate(-90deg);
        }
      }
      &:after{
        position: absolute;
        content: '';
        height: 7px;
        width: 7px;
        transform: rotate(-90deg);
        margin: 2px 5px 0 2px;
        background: url('../../../static/svg/arrow-white.svg');
        transition: transform 0.2s ease-in;
      }
    }
  }
</style>
