const path = require('path')

module.exports = {
  env: {
    baseURL: process.env.BASE_URL || 'http://localhost',
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
    API_HOST: process.env.API_HOST || 'localhost',
    API_PORT: process.env.API_PORT || 3030
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Human Connection',
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'link', reql: 'stylesheet', href: '//fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  },
  /*
   ** Loader / Progress Bar
   */
  loading: {
    color: '#86b31e',
    height: '2px'
  },
  /*
   ** Global CSS
   *
   *  NOTE: Needed to add fonr-awesome and mapbox-gl here as otherwise
   *        we get issues with the styleguide after the nuxt update as they
   *        now use "~" alias for the srcDir instead of the node_modules
   *        like it would be the standard :-/
   */
  css: [
    'font-awesome/css/font-awesome.min.css',
    'mapbox-gl/dist/mapbox-gl.css',
    'assets/styles/main.scss',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
   ** Add axios globally
   */
  build: {
    presets: ['vue-app'],
    vendor: [
      'axios',
      'moment',
      'lodash',
      'bricks.js',
      // Feathers
      'feathers/client',
      'feathers-socketio/client',
      'socket.io-client',
      'feathers-hooks',
      'feathers-authentication-client'
    ],
    extend (config, ctx) {
      /*
       ** Run ESLINT on save
       */
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Add aliases
      const aliases = Object.assign(config.resolve.alias, {
        '~/helpers': path.resolve(__dirname, 'helpers')
      })
      config.resolve.alias = aliases // eslint-disable-line no-param-reassign
    }
  },
  plugins: [
    {src: '~/plugins/buefy.js'},
    {src: '~/plugins/client-auth.js', ssr: false},
    {src: '~/plugins/init-store-subscriptions.js', ssr: false},
    {src: '~/plugins/global-components.js', injectAs: 'globalComponents'},
    {src: '~/plugins/vue-clip.js', ssr: false},
    {src: '~/plugins/quill-editor.js'},
    {src: '~/plugins/feathers.js'}
  ],
  modules: [],
  router: {
    middleware: ['check-auth'],
    linkActiveClass: 'active-link'
  },
  manifest: {
    name: 'Human Connection',
    description: 'Human Connection Portal',
    theme_color: '#ffffff',
    lang: 'de'
  }
}
