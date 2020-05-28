<template>
  <!-- App.vue -->

  <v-container>
    <v-row class="text-center">
      <v-btn v-on:click="onClick" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue{
  onClick() {
    console.log('on click fired');
    this.$vuetify.theme.themes.light.primary = '#4caf50'
  }
}
</script>