<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="isSideBarOpen" app>
      <SideBarContent v-on:curr-times-updated="currTimes = $event" />
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="isSideBarOpen = !isSideBarOpen"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <div v-if="currTimes && currTimes[currTimeIdx]" class="txt-center">
        <div>
          <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
        </div>
        <div>{{currTimes[currTimeIdx].HicriTarihUzun}}</div>
        <div>
          <h1 class="normal-font">İmsak: {{currTimes[currTimeIdx].Imsak}}</h1>
        </div>
        <div>
          <h1 class="normal-font">Güneş: {{currTimes[currTimeIdx].Gunes}}</h1>
        </div>
        <div>
          <h1 class="normal-font">Öğle: {{currTimes[currTimeIdx].Ogle}}</h1>
        </div>
        <div>
          <h1 class="normal-font">İkindi: {{currTimes[currTimeIdx].Ikindi}}</h1>
        </div>
        <div>
          <h1 class="normal-font">Akşam: {{currTimes[currTimeIdx].Aksam}}</h1>
        </div>
        <div>
          <h1 class="normal-font">Yatsı: {{currTimes[currTimeIdx].Yatsi}}</h1>
        </div>
        <div>
          <h2 class="normal-font">{{currPray}} vaktine kalan süre {{remainingTime}}</h2>
        </div>
      </div>
    </v-content>
    <v-footer color="primary" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./components/SideBarContent.vue";
import { TimesData } from "./components/MetaType";
import { SettingService } from "./SettingService";

@Component({
  components: {
    SideBarContent
  }
})
export default class App extends Vue {
  private isSideBarOpen = false;
  private currTimes: TimesData | null = null;
  private currTimeIdx = 0;
  private currLoc: string | null = "";
  private currPray = "Akşam";
  private remainingTime = "1:38:21";

  created() {
    this.currTimes = SettingService.getTimes4CurrentLocation();
    this.currLoc = SettingService.getCurrLocation();
  }
}
</script>
<style scoped>
.txt-center {
  text-align: center;
}
.normal-font {
  font-weight: normal;
}
</style>