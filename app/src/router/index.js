import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import Signup from '@/components/Signup';
import PersonalInfo from '@/components/signup/PersonalInfo';
import Companies from '@/components/signup/Companies';
import States from '@/components/signup/States';
import Cities from '@/components/signup/Cities';
import Premium from '@/components/signup/Premium';
import Pay from '@/components/signup/Pay';
import Success from '@/components/signup/Success';

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
        {
          name: 'states',
          path: 'states',
          component: States,
        },
        {
          name: 'cities',
          path: 'cities',
          component: Cities,
        },
        {
          name: 'premium',
          path: 'premium',
          component: Premium,
        },
        {
          name: 'pay',
          path: 'pay',
          component: Pay,
        },
        {
          name: 'success',
          path: 'success',
          component: Success,
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
