import Vue from 'vue'
import VueConfig from 'vue-config'
import config from '../config/'

/* init config files */
const configs = {
  default: config
}

Vue.use(VueConfig, configs)
