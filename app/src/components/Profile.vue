<template>
  <div>
    <div class="profile__bg" id="js__profile__bg"></div>
    <div class="profile">
      <div class="profile__main">
        <div class="profile__container g__container">
          <!-- info -->
          <div class="profile__main__info" id="js__profile__main__info">
            <div class="profile__main__info__image-container">
              <img class="profile__main__info__image" :src="user.profilePicture"/>
            </div>

            <h1 class="profile__main__info__name">{{user.firstName}} {{user.lastName}}</h1>
            <div class="profile__main__info__companies__container">
              <ul class="profile__main__info__companies">
                <li v-for="company in user.companies" @click="selectCompany(company)" :class="[{ 'profile__main__info__company--active': company.name.active },'profile__main__info__company']">
                  {{company.name.name}}
                </li>
              </ul>
            </div>
          </div>
          <!-- end info -->
          <!-- details -->
          <div class="profile__main__details">
            <div class="profile__main__details__box profile__main__details__box--blue" v-for="company in user.companies" v-if="company.name.name === activeCompany">
              <h2 class="profile__main__details__heading profile__main__details__heading--light">Contact {{user.firstName}}</h2>

              <div class="profile__main__details__link-container">
                <a class="profile__main__details__link" v-if="user.phoneNumber" :href="'tel:'+user.phoneNumber">{{user.phoneNumber}}</a>
                <a class="profile__main__details__link" v-if="user.emailAddress" :href="'mailto:'+user.emailAddress">{{user.emailAddress}}</a>
              </div>
            </div>

            <div class="profile__main__details__box profile__main__details__box--blue" v-for="company in user.companies" v-if="company.name.name === activeCompany">
              <h2 class="profile__main__details__heading profile__main__details__heading--light">Connect With {{user.firstName}}</h2>

              <div class="profile__main__details__social">
                <a v-if="company.links.facebook.url.length > 1" class="profile__main__details__social__icon" :href="company.links.facebook.url">
                  <img src="../../static/svg/facebook.svg"/>
                </a>
                <a v-if="company.links.instagram.url.length > 1" class="profile__main__details__social__icon" :href="company.links.instagram.url">
                  <img src="../../static/svg/instagram.svg"/>
                </a>
                <a v-if="company.links.twitter.url.length > 1" class="profile__main__details__social__icon" :href="company.links.twitter.url">
                  <img src="../../static/svg/twitter.svg"/>
                </a>
                <a v-if="company.links.pinterest.url.length > 1" class="profile__main__details__social__icon" :href="company.links.pinterest.url">
                  <img src="../../static/svg/pinterest.svg"/>
                </a>
                <a v-if="company.links.youtube.url.length > 1" class="profile__main__details__social__icon" :href="company.links.youtube.url">
                  <img src="../../static/svg/youtube.svg"/>
                </a>
                <a v-if="company.links.website.url.length > 1" class="profile__main__details__social__icon" :href="company.links.website.url">
                  <img src="../../static/svg/website.svg"/>
                </a>
              </div>
            </div>

            <div class="profile__main__details__box" v-for="company in user.companies" v-if="company.name.name === activeCompany">
              <h2 class="profile__main__details__heading">About {{user.firstName}}</h2>
              <p class="profile__main__details__copy">{{company.aboutMe}}</p>
            </div>

            <div class="profile__main__details__box" v-for="company in user.companies" v-if="company.name.name === activeCompany">
              <h2 class="profile__main__details__heading">About {{activeCompany}}</h2>
              <p class="profile__main__details__copy">{{company.aboutCompany}}</p>
            </div>

            <div class="profile__main__details__box" v-for="company in user.companies" v-if="company.name.name === activeCompany">
              <h2 class="profile__main__details__heading">Areas Served</h2>
              <div v-for="area in company.areasServed">
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
      activeCompany: '',
    };
  },
  beforeMount() {
    this.getUser(this.$route.params.username);
    this.$store.state.menuType = 'transparent';
  },
  mounted() {
    this.adjustBackground();
    document.body.classList.add('g__body__gray');
    window.onresize = this.adjustBackground;
  },
  methods: {
    getUser(username) {
      fetch(
        `${config.api}/users/u/${username}`,
      ).then((data) => {
        data.json().then((userInfo) => {
          if (userInfo.status === false) {
            /* todo redirect this to a 404 page */
            window.location.href = '/';
          } else {
            this.user = userInfo.user;

            /* set the title of the page to the user's name */
            document.title = `Home Party Shows | ${this.user.firstName} ${this.user.lastName}`;

            /*
              pull out each company name and add an active class
              by default, make first instance active unless it
              has been selected in the query
            */
            this.user.companies.forEach((company, index) => {
              /* eslint-disable */
              /* set this by default, but change the active class as needed */
              company.name = { name: company.name, active: false };

              if(this.$store.state.results.length !== 0 && this.$store.state.results.query.company !== ''&& this.$store.state.results.query.company !== undefined){
                alert('still here');
                if(this.$store.state.results.query.company === company.name.name){
                  company.name = { name: company.name.name, active: true };
                  this.activeCompany = company.name.name;
                }
              } else if(index === 0){
                company.name = { name: company.name.name, active: true };
                this.activeCompany = company.name.name;
              }
              /* eslint-enable */
            });
          }
        });
      });
    },
    /*
      Selects a company from the user's company list
      @param {object} - the selected company
    */
    selectCompany(company) {
      /* eslint-disable */
      this.user.companies.forEach((company) => {
        company.name.active = false;
      });
      company.name.active = true;
      this.activeCompany = company.name.name;
      /* eslint-enable */
    },
    /*
      Dynamically sets the half(ish)-page background height on resize
    */
    adjustBackground() {
      const height = document.getElementById('js__profile__main__info').offsetHeight;
      const offset = document.getElementById('js__profile__main__info').parentElement.offsetTop;
      document.getElementById('js__profile__bg').style.height = `${height + offset}px`;
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
        &:hover{
          cursor: pointer;
          background: transparentize($white, 0.1);
          color: $blue;
        }
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
