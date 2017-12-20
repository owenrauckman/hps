module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Directio | Find and build your direct sales team',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Nuxt loader
  */
  loading: {
    color: '#3d4aa6',
    height: '2px'
  },

  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.module.rules.forEach((rule) => {
        if (rule.test.toString() === '/\\.vue$/') {
          rule.options.loaders.scss[2].options.data = '@import "./assets/sass/main";'
        }
      })
    }
  },

  /*
  ** Modules
  */
  modules: [
    '@nuxtjs/vuetify'
  ],

  /*
  ** Plugins
  */
  plugins: [
    '~/plugins/vue-scrollto',
    '~/plugins/vee-validate',
    '~/plugins/vue-config'
  ]

}
