export default {
  env: {
    oidcClientId: process.env.NODE_ENV !== "production" ? "DSEU.UI" : "DSEU.UI-prod",
    // SERVER_URL: "https://dseu.agency.local/",
    SERVER_URL: "https://192.168.101.173",
  },

  loading: {
    color: "white"
  },

  ssr: false,

  head: {
    title: 'DSEU',
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || ""
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  css: [{
    src: "devextreme/dist/css/dx.common.css",
    lang: "css"
  },
  {
    src: 'devextreme/dist/css/dx.custom-theme.css',
    lang: "css"
  },
  {
    src: "vue-awesome-notifications/dist/styles/style.scss",
    lang: "css"
  },
  {
    src: "~/assets/themes/index.scss",
    lang: "scss"
  },
  ],
  styleResources: {
    scss: [
      '~/assets/themes/dx.variables.scss',
      '~/assets/themes/variables.scss',
      '~/assets/themes/custom-variables.scss',
      '~/assets/themes/index.scss',
    ],
  },
  plugins: [
    "~/plugins/axios",
    "~/plugins/data-api",
    "~/plugins/device-screen-width",
    "~/plugins/customStore",
    "~/plugins/awesome-notifications",
    "~/plugins/nuxt-client-init",
    "~/plugins/signalR",
  ],

  router: {
    middleware: ["authorization", "authorization-callback"]
  },

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    [
      "nuxt-i18n",
      {
        locales: [{
          name: "Turkmen",
          code: "tk-TM",
          iso: "tk-TM",
          file: "tk-TM.ts"
        }],
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: "locale",
          alwaysRedirect: true,
          fallbackLocale: "tk-TM"
        },
        strategy: "no_prefix",
        lazy: true,
        langDir: "lang/",
        defaultLocale: "tk-TM",
        vuex: {
          moduleName: "i18n",
          syncLocale: true,
          syncMessages: true,
          syncRouteParams: true
        }
      }
    ],
  ],

  axios: {},

  pwa: {
    manifest: {
      lang: 'tk',
      background_color: "#fff",
      theme_color: "#009a40"
    }
  },

  build: {}
}
