module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  pwa: {
    name: "namaz-vakti",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    // configure the workbox plugin
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      exclude: [/.well-known/]
    },
    start_url: "https://canbax.github.io/namaz-vakti/",
    scope: "."
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/namaz-vakti/'
    : '/'
}
