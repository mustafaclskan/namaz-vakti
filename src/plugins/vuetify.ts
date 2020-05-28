import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#ffff00',
        secondary: '#ff0000',
        accent: '#ff0000',
        error: '#ff0000',
      },
    },
  },
})