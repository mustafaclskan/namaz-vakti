import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

import vuetify from './plugins/vuetify';

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
