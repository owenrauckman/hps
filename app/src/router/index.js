import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import Signup from '@/components/Signup';
import PersonalInfo from '@/components/signup/PersonalInfo';
import Companies from '@/components/signup/Companies';
import States from '@/components/signup/States';

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
      ],
    },
    {
      path: '/:username',
      name: 'profile',
      component: Profile,
    },
  ],
});
