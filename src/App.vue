<template>
  <v-app>
    <v-navigation-drawer v-model="isSideBarOpen" app>
      <SideBarContent v-on:curr-times-updated="currTimes = $event" />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="isSideBarOpen = !isSideBarOpen"></v-app-bar-nav-icon>
      <v-toolbar-title>Namaz vakti</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-list :flat="true" v-if="currTimes && currTimes[currTimeIdx]" class>
        <v-list-item-group v-model="currPrayIdx">
          <v-list-item>
            <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
          </v-list-item>
          <v-list-item>
            <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
          </v-list-item>
          <v-list-item>
            <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
          </v-list-item>
          <v-list-item>
            <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
          </v-list-item>
          <v-list-item>
            <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
          </v-list-item>
          <v-list-item>
            <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
          </v-list-item>

          <!-- <v-list-item-content>{{currTimes[currTimeIdx].HicriTarihUzun}}</v-list-item-content>
            <v-list-item-content>
              <h1 class="normal-font primary--text">İmsak: {{currTimes[currTimeIdx].Imsak}}</h1>
            </v-list-item-content>
            <v-list-item-content>
              <h1 class="normal-font">Güneş: {{currTimes[currTimeIdx].Gunes}}</h1>
            </v-list-item-content>
            <v-list-item-content></v-list-item-content>
            <v-list-item-content></v-list-item-content>
          <v-list-item-content></v-list-item-content>-->
        </v-list-item-group>
      </v-list>
      <!-- <v-card v-if="currTimes && currTimes[currTimeIdx]" class="txt-center m-5">
        <div>
          <h2 class="normal-font">{{currTimes[currTimeIdx].MiladiTarihUzun}}</h2>
        </div>
        <div>{{currTimes[currTimeIdx].HicriTarihUzun}}</div>
        <v-divider></v-divider>
        <div color="primary">
          <h1 class="normal-font primary--text">İmsak: {{currTimes[currTimeIdx].Imsak}}</h1>
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
        <v-divider></v-divider>
        <div>
          <h2 class="normal-font">{{currPray}} vaktine kalan süre {{remainingTime}}</h2>
        </div>
      </v-card>-->
    </v-content>
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
  private currPrayIdx = 3;
  private remainingTime = "1:38:21";
  private timeItems = [""];

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