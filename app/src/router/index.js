import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import Signup from '@/components/Signup';
import PersonalInfo from '@/components/signup/PersonalInfo';
import Companies from '@/components/signup/Companies';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/signup',
      component: Signup,
      children: [
        {
          path: '',
          component: PersonalInfo,
        },
        {
          name: 'personal-info',
          path: 'personal-info',
          component: PersonalInfo,
        },
        {
          name: 'companies',
          path: 'companies',
          component: Companies,
        },
      ],
    },
    {
      path: '/:username',
      name: 'profile',
      component: Profile,
    },
  ],
});
