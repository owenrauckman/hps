<template>
  <div class="home">
    <div class="home__bg"></div>
    <div class="home__container">
      <p class="home__intro">{{intro}}</p>
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
      intro: 'Build your direct sales team. Get found or find consultants today.',
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
    min-height: 300px;
    width: 100%;
    background: url('../../static/img/hero.png') no-repeat;
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
    margin: 1rem auto 2rem auto;
    text-align: center;
    color: $white;
    font-size: 0.8rem;
    font-weight: 300;
    font-style: italic;
    max-width: 250px;
  }
}
</style>
