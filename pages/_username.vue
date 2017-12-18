<template>
  <div class="p__profile" v-if="user.company">
    <div class="p__info">
      <div>
        <h1 class="p__info__name">{{user.firstName}} {{user.lastName}}</h1>
        <h2 class="p__info__company">{{user.company.name}}</h2>
      </div>
      <div class="p__info__image" :style="{ 'background-image': `url('${user.profilePicture}')` }">
        <div class="p__info__image--badge" v-if="ownsPremiumCity || ownsPremiumState">Premium</div>
      </div>
    </div>
    <div class="p__connect">
      <div class="p__connect__social">
        <a v-if="user.company.links.facebook" class="p__connect__social__icon" :href="user.company.links.facebook.startsWith('http') ? user.company.links.facebook : `https://${user.company.links.facebook}`">
          <img src="../static/svg/facebook.svg"/>
        </a>
        <a v-if="user.company.links.instagram" class="p__connect__social__icon" :href="user.company.links.instagram.startsWith('http') ? user.company.links.instagram : `https://${user.company.links.instagram}`">
          <img src="../static/svg/instagram.svg"/>
        </a>
        <a v-if="user.company.links.twitter" class="p__connect__social__icon" :href="user.company.links.twitter.startsWith('http') ? user.company.links.twitter : `https://${user.company.links.twitter}`">
          <img src="../static/svg/twitter.svg"/>
        </a>
        <a v-if="user.company.links.pinterest" class="p__connect__social__icon" :href="user.company.links.pinterest.startsWith('http') ? user.company.links.pinterest : `https://${user.company.links.pinterest}`">
          <img src="../static/svg/pinterest.svg"/>
        </a>
        <a v-if="user.company.links.youtube" class="p__connect__social__icon" :href="user.company.links.youtube.startsWith('http') ? user.company.links.youtube : `https://${user.company.links.youtube}`">
          <img src="../static/svg/youtube.svg"/>
        </a>
        <a v-if="user.company.links.website" class="p__connect__social__icon" :href="user.company.links.website.startsWith('http') ? user.company.links.website : `https://${user.company.links.website}`">
          <img src="../static/svg/website.svg"/>
        </a>
      </div>
      <div class="p__connect__contact">
        <a class="p__connect__contact--link" v-if="user.phoneNumber" :href="'tel:'+user.phoneNumber">{{user.phoneNumber}}</a>
        <a class="p__connect__contact--link" v-if="user.emailAddress" :href="'mailto:'+user.emailAddress">{{user.emailAddress}}</a>
      </div>
    </div>
    <div class="p__about" v-if="user.company.aboutMe">
      <h3 class="p__about__heading">About {{user.firstName}}</h3>
      <p class="p__about__copy">{{user.company.aboutMe}}</p>
    </div>
    <div class="p__about" v-if="user.company.aboutCompany">
      <h3 class="p__about__heading">About {{user.company.name}}</h3>
      <p class="p__about__copy">{{user.company.aboutCompany}}</p>
    </div>
    <div class="p__about" >
      <h3 class="p__about__heading">Areas Served</h3>
      <div class="p__about__areas" v-for="area in user.company.areasServed">
        <v-chip class="p__about__areas__chip">{{area.state}}</v-chip>
        <v-chip v-for="city in area.cities" :key="city.city">{{city.city}}</v-chip>
      </div>
    </div>
  </div>
</template>
<script>
import config from '@/config'

export default {
  data () {
    return {
      user: {},
      ownsPremiumCity: false,
      ownsPremiumState: false
    }
  },
  beforeMount () {
    this.getUser(this.$route.params.username)
  },
  methods: {
    // This stays in the component since it alters the local state
    getUser (username) {
      fetch(
        `${config.api}/users/u/${username}`
      ).then((data) => {
        data.json().then((userInfo) => {
          if (userInfo.status === false) {
            // todo redirect this to a 404 page
            this.$router.push('/')
          } else {
            this.user = userInfo.user
            // check to see if user owns premium city or state
            this.user.company.areasServed.forEach((area) => {
              if (area.ownsPremium === true) {
                this.ownsPremiumState = true
              }
              area.cities.forEach((city) => {
                if (city.ownsPremium === true) {
                  this.ownsPremiumCity = true
                }
              })
            })
            // set the title of the page to the user's name
            document.title = `Home Party Shows | ${this.user.firstName} ${this.user.lastName}`
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">

.p{
  &__profile{
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;
    @include breakpoint('phone'){
      padding: 4rem 2rem;
    }
  }
  &__info{
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
    @include breakpoint('phone'){
      justify-content: space-between;
      flex-direction: row;
      text-align: left;
    }
    &__name{
      font-family: $montserrat;
      color: $dark-grey;
      font-weight: bold;
      font-size: 2rem;
      letter-spacing: 0.01rem;
      margin-top: 2rem;
      @include breakpoint('phone'){
        margin-top: 0;
      }
    }
    &__company{
      font-family: $montserrat;
      color: $medium-dark-grey;
      font-weight: bold;
      font-style: italic;
      font-size: 1.25rem;
      letter-spacing: 0.05rem;
      margin-top: 0.5rem;
      @include breakpoint('phone'){
        margin-top: 1rem;
      }
    }
    &__image{
      border-radius: $circle-radius;
      background-size: cover;
      background-position: center;
      height: 100px;
      width: 100px;
      position: relative;
      &--badge{
        border-radius: 50px;
        padding: 0.5rem calc(0.75rem + 20px) 0.5rem 0.75rem;
        background: white;
        border: solid 1px $purple;
        color: $purple;
        font-family: $rubik;
        position: absolute;
        left: -75px;
        font-size: 0.9rem;
        &:after{
          position: absolute;
          content: '';
          background: url('../static/svg/check.svg');
          height: 15px;
          width: 15px;
          margin-left: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  &__connect{
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include breakpoint('phone'){
      justify-content: space-between;
      flex-direction: row;
      align-items: flex-start;
      margin: 4rem 0 2rem 0;
    }
    &__social{
      display: flex;
      &__icon{
        height: 35px;
        width: 35px;
        margin: 0.5rem;
        &:first-child{
          margin-left: 0;
        }
      }
    }
    &__contact{
      display: flex;
      flex-direction: column;
      text-align: center;
      margin: 2rem 0;
      @include breakpoint('phone'){
        text-align: right;
        margin: 0;
      }
      &--link{
        &:link, &:active, &:hover, &:visited{
          color: $medium-dark-grey;
          text-decoration: none;
        }
      }
    }
  }
  &__about{
    margin: 2rem 0 4rem 0;
    text-align: center;
    @include breakpoint('phone'){
      margin: 4rem 0;
      text-align: left;
    }
    &__heading{
      font-family: $montserrat;
      font-size: 1.5rem;
      line-height: 1.5rem;
      margin-bottom: 1rem;
      color: $dark-grey;
      font-weight: bold;
      letter-spacing: 0.1rem;
    }
    &__copy{
      font-family: $rubik;
      color: $dark-grey;
      line-height: 1.5rem;
    }
    &__areas{
      display: flex;
      justify-content: center;
      @include breakpoint('phone'){
        justify-content: flex-start;
      }
      &__chip{
        background: $purple !important; // vuetify override
        color: $white !important; // vuetify override
      }
    }
  }
}
</style>
