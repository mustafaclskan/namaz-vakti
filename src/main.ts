import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { SettingService } from './SettingService';

import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import Fieldset from 'primevue/fieldset';

Vue.component('Sidebar', Sidebar);
Vue.component('Button', Button);
Vue.component('Dropdown', Dropdown);
Vue.component('Card', Card);
Vue.component('Fieldset', Fieldset);

Vue.config.productionTip = false

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
SettingService.setTheme('saga-blue');

new Vue({
  render: h => h(App),
}).$mount('#app')
