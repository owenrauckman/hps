import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing/Landing';
import Create from '@/components/Create/Create';
import SelectCompanyStates from '@/components/Create/SelectCompanyStates';
import SelectCities from '@/components/Create/SelectCities';
import About from '@/components/Create/About';
import Account from '@/components/Create/Account';
import Premium from '@/components/Create/Premium';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // LANDING PAGE
    { path: '/', component: Landing },

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
      ],
    },
  ],
});
