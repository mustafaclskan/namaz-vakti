import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

import vuetify from './plugins/vuetify';
import i18n from './i18n'

new Vue({
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
