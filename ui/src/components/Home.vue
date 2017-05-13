<template>
  <div class="home">
    <div class="home__bg"></div>
    <div class="home__container">
      <p class="home__intro"><span class="home__intro__span">Home Party Shows</span> Find and build your direct sales team today.</p>
      <Search/>
      <Card v-for="card in $store.state.results" :key="card.plan" :options="card"/>
    </div>
  </div>
</template>

<script>
import Card from './home/Card';
import Search from './home/Search';

export default {
  name: 'home',
  components: { Card, Search },
  data() {
    return {
      results: [
        {
          plan: 'premium',
          name: 'Ladannifer Jadanniston',
          image: '../../../static/img/face-1.jpg',
          company: 'Partylite',
          location: 'Overland Park, KS',
        },
        {
          plan: 'pro',
          name: 'Hingle Mcringleberry',
          image: '../../../static/img/face-2.jpg',
          company: 'Partylite',
          location: 'Olathe, KS',
        },
        {
          plan: 'basic',
          name: "D'Squarius Green",
          image: '../../../static/img/face-1.jpg',
          company: 'Partylite',
          location: 'Leawood, KS',
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../sass/main.scss';

.home{
  &__bg{
    z-index: -1;
    position: absolute;
    top: 0;
    min-height: 400px;
    width: 100%;
    background-size:cover;
    background-position: top 50%;
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    &:before{
      z-index: -1;
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      background: linear-gradient(to bottom right, $blue-grad-top-left, $blue-grad-bottom-right);
      opacity: 0.9;
    }
  }
  &__container{
    margin: 1rem;
  }
  &__intro{
    margin: 2rem 0 3rem 0;
    text-align: left;
    color: transparentize($white, 0.2);
    font-size: 1.25rem;
    letter-spacing: 1px;
    font-weight: 300;
    line-height: 2rem;
    max-width: 350px;
    &__span{
      font-weight: 600;
      color: $white;
    }
  }
}
</style>
