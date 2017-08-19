<template>
  <!-- conditional keeps from console errors from ajax -->
  <div v-if="user.company">
    <div class="profile__bg" id="js__profile__bg"></div>
    <div class="profile">
      <div class="profile__main">
        <div class="profile__container g__container">
          <!-- info -->
          <div class="profile__main__info" id="js__profile__main__info">
            <div class="profile__main__info__image-container">
              <div class="profile__main__info__image" :style="{ 'background-image': `url('${user.profilePicture}')` }"></div>
            </div>
            <span v-if="ownsPremiumState" class="profile__main__info__premium profile__main__info__premium--badge">Premium State Owner</span>
            <span v-else-if="ownsPremiumCity" class="profile__main__info__premium profile__main__info__premium--badge">Premium City Owner</span>

            <h1 class="profile__main__info__name">{{user.firstName}} {{user.lastName}}</h1>
            <div class="profile__main__info__companies__container">
              <ul class="profile__main__info__companies">
                <li class="profile__main__info__company profile__main__info__company--active">{{user.company.name}}</li>
              </ul>
            </div>
          </div>
          <!-- end info -->
          <!-- details -->
          <div class="profile__main__details">
            <div class="profile__main__details__box profile__main__details__box--blue">
              <h2 class="profile__main__details__heading profile__main__details__heading--light">Contact {{user.firstName}}</h2>

              <div class="profile__main__details__link-container">
                <a class="profile__main__details__link" v-if="user.phoneNumber" :href="'tel:'+user.phoneNumber">{{user.phoneNumber}}</a>
                <a class="profile__main__details__link" v-if="user.emailAddress" :href="'mailto:'+user.emailAddress">{{user.emailAddress}}</a>
              </div>
            </div>

            <div class="profile__main__details__box profile__main__details__box--blue"
              v-if="user.company.links.facebook.url || user.company.links.instagram.url || user.company.links.twitter.url || user.company.links.pinterest.url || user.company.links.youtube.url || user.company.links.website.url"
            >
              <h2 class="profile__main__details__heading profile__main__details__heading--light">Connect With {{user.firstName}}</h2>

              <div class="profile__main__details__social">
                <a v-if="user.company.links.facebook.url" class="profile__main__details__social__icon" :href="user.company.links.facebook.url">
                  <img src="../../static/svg/facebook.svg"/>
                </a>
                <a v-if="user.company.links.instagram.url" class="profile__main__details__social__icon" :href="user.company.links.instagram.url">
                  <img src="../../static/svg/instagram.svg"/>
                </a>
                <a v-if="user.company.links.twitter.url" class="profile__main__details__social__icon" :href="user.company.links.twitter.url">
                  <img src="../../static/svg/twitter.svg"/>
                </a>
                <a v-if="user.company.links.pinterest.url" class="profile__main__details__social__icon" :href="user.company.links.pinterest.url">
                  <img src="../../static/svg/pinterest.svg"/>
                </a>
                <a v-if="user.company.links.youtube.url" class="profile__main__details__social__icon" :href="user.company.links.youtube.url">
                  <img src="../../static/svg/youtube.svg"/>
                </a>
                <a v-if="user.company.links.website.url" class="profile__main__details__social__icon" :href="user.company.links.website.url">
                  <img src="../../static/svg/website.svg"/>
                </a>
              </div>
            </div>

            <div class="profile__main__details__box">
              <h2 class="profile__main__details__heading">About {{user.firstName}}</h2>
              <p class="profile__main__details__copy">{{user.company.aboutMe}}</p>
            </div>

            <div class="profile__main__details__box">
              <h2 class="profile__main__details__heading">About {{user.company.name}}</h2>
              <p class="profile__main__details__copy">{{user.company.aboutCompany}}</p>
            </div>

            <div class="profile__main__details__box">
              <h2 class="profile__main__details__heading">Areas Served</h2>
              <div v-for="area in user.company.areasServed">
                <p class="profile__main__details__copy profile__main__details__copy--dark">{{area.state}}</p>
                <p class="profile__main__details__copy--italic" v-for="city in area.cities">{{city.city}}</p>
              </div>
            </div>
          </div>

          </div>
          <!-- end details -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const config = require('../../config/appConfig.json');

export default {
  name: 'profile',
  data() {
    return {
      user: {},
      ownsPremiumCity: false,
      ownsPremiumState: false,
    };
  },
  beforeMount() {
    this.getUser(this.$route.params.username);
    this.$store.state.menuType = 'transparent';
  },
  mounted() {
    document.body.classList.add('g__body__gray');
  },
  methods: {
    getUser(username) {
      fetch(
        `${config.api}/users/u/${username}`,
        { credentials: 'include' },
      ).then((data) => {
        data.json().then((userInfo) => {
          if (userInfo.status === false) {
            /* todo redirect this to a 404 page */
            window.location.href = '/';
          } else {
            this.user = userInfo.user;

            /* check to see if user owns premium city or state */
            this.user.company.areasServed.forEach((area) => {
              let isStateQuery = true;
              let isCityQuery = true;
              if (this.$store.state.filterQueries.state.name === '') {
                isStateQuery = false;
              }
              if (this.$store.state.filterQueries.city.name === '') {
                isCityQuery = false;
              }
              if (area.ownsPremium === true &&
                (this.$store.state.filterQueries.state.abbr === area.state
                || isStateQuery === false)) {
                this.ownsPremiumState = true;
              }
              area.cities.forEach((city) => {
                if (city.ownsPremium === true &&
                  (this.$store.state.filterQueries.city.name === city.city
                  || isCityQuery === false)) {
                  this.ownsPremiumCity = true;
                }
              });
            });

            /* set the title of the page to the user's name */
            document.title = `Home Party Shows | ${this.user.firstName} ${this.user.lastName}`;
          }
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.profile{
  &__bg{
    background: linear-gradient(to bottom right, transparentize($orange, 0.05), transparentize($red-orange, 0.05));
    min-height: 500px;
    @include breakpoint(tablet){
      min-height: 420px;
    }
    width: 100%;
    position: absolute;
    top: 0;
  }
  &__container{
    padding: 0 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  &__main{
    width: 100%;
    height: auto;
    position: relative;
    background: transparent;
    padding: calc(100px + 2rem) 0 2rem 0;
    /* info section */
    &__info{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      @include breakpoint(tablet){
        width: 40%;
      }
      justify-content: space-between;
      &__image{
        border-radius: $circle-radius;
        background-size: cover;
        background-position: center;
        background-color: $white;
        height: 100px;
        width: 100px;
      }
      &__premium{
        color: $white;
        letter-spacing: 0.5px;
        font-weight: 300;
        padding: 0 2rem 0 0;
        position: relative;
        font-size: 0.8rem;
        &--badge{
          &:after{
            position: absolute;
            content: '';
            height: 20px;
            width: 20px;
            background: url('../../static/svg/verified-light.svg');
            right: 0;
            top: 0;
          }
        }
      }
      &__name{
        color: $white;
        width: 100%;
        font-family: $rubik;
        font-weight: 500;
        font-size: 1.25rem;
        letter-spacing: 1px;
        margin: 2rem 0;
      }
      &__companies{
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        display: flex;
        margin-top: 0;
        height: 80px;
        &::-webkit-scrollbar {
          width: 0px;  /* remove scrollbar space */
          background: transparent;  /* optional: just make scrollbar invisible */
        }
        &__container{
          width: 100%;
          height: 50px;
          overflow: hidden;
        }
      }
      &__company{
        display: inline-flex;
        list-style: none;
        text-align: center;
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 1px;
        color: $white-50;
        position: relative;
        -webkit-overflow-scrolling: touch;
        padding: 1rem 2rem;
        margin: 0 0.25rem;
        border-radius: $round-radius;
        transition: all 0.2s ease-in-out;
        height: 10px;
        &:first-child{
          margin: 0 0.25rem 0 0;
          padding: 1rem 2rem 1rem 0;
          &:hover{
            padding: 1rem 2rem;
          }
        }
        &--active{
          color: $blue;
          background: $white;
          display: block;
          padding: 1rem 2rem;
          &:first-child{
            padding: 1rem 2rem;
          }
        }
      }
    }
    /* details section */
    &__details{
      width: 100%;
      margin-top: 2rem;
      @include breakpoint(tablet){
        margin-top: 0;
        padding: 0 2rem;
        width: calc(60% - 4rem);
      }
      &__box{
        background: $white;
        box-shadow: $box-shadow;
        border-radius: $border-radius;
        margin: 2rem 0;
        padding: 2rem;
        color: $gray-dark;
        &:first-child{
          margin-top: 0;
        }
        &--blue{
          background: $blue;
          color: $white;
        }
      }
      &__heading{
        color: $gray-dark;
        letter-spacing: 1px;
        font-size: 1rem;
        position: relative;
        &:after{
          position: absolute;
          content: '';
          bottom: -0.5rem;
          left: 0;
          height: 2px;
          width: 20px;
          background: $gray-dark;
        }
        &--light{
          color: $white;
          &:after{
            background: $white;
          }
        }
      }
      &__copy{
        margin: 1.5rem 0 0.25rem 0;
        color: $gray-medium;
        font-size: 0.9rem;
        display: block;
        &--light{
          color: $white;
        }
        &--dark{
          color: $gray-dark;
        }
        &--italic{
          font-style: italic;
          color: $gray-light;
        }
      }
      &__link-container{
        margin: 1.5rem 0 1rem 0;
      }
      &__link{
        color: $white;
        display: block;
        margin: 0.25rem 0;
        &:link, &:active, &:visited, &:hover{
          text-decoration: none;
        }
        &:hover{
          text-decoration: underline;
        }
      }
      &__social{
        display: flex;
        flex-wrap: wrap;
        margin: 2rem 0 0 0;
        &__icon{
          margin: 0.5rem 2rem 0.5rem 0;
          width: 40px;
          width: 40px;
          background: transparent;
        }
      }
    }
  }
}
</style>
