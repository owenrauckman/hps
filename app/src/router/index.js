import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing/Landing';
import Create from '@/components/Create/Create';
import SelectCompanyStates from '@/components/Create/SelectCompanyStates';
import SelectCities from '@/components/Create/SelectCities';
import About from '@/components/Create/About';
import Account from '@/components/Create/Account';
import Premium from '@/components/Create/Premium';
import Pay from '@/components/Create/Pay';
import Success from '@/components/Create/Success';
import Profile from '@/components/Profile/Profile';
import Login from '@/components/Account/Login';
import Dashboard from '@/components/Account/Dashboard';
import ForgotPassword from '@/components/Account/ForgotPassword';
import ResetPassword from '@/components/Account/ResetPassword';


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // LANDING PAGE
    { path: '/', component: Landing },

    // ACCOUNT PAGES
    { path: '/login', component: Login },
    { path: '/account', component: Dashboard },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password', component: ResetPassword },


    // CREATE ACCOUNT
    { path: '/create',
      component: Create,
      // STEPS TO CREATE ACCOUNT
      children: [
        { path: 'select-company-and-states', component: SelectCompanyStates, alias: '/create' },
        { path: 'select-cities', component: SelectCities, alias: '/create' },
        { path: 'about', component: About, alias: '/create' },
        { path: 'account', component: Account, alias: '/create' },
        { path: 'premium', component: Premium, alias: '/create' },
        { path: 'pay', component: Pay, alias: '/create' },
        { path: 'success', component: Success, alias: '/create' },
      ],
    },

    // PROFILE PAGE
    { path: '/:username', component: Profile },
  ],
});
