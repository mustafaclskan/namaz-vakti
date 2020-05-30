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
      <v-list :flat="true" disabled v-if="currTimes && currTimes[currTimeIdx]" class="txt-center">
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in timeItems"
            :key="i"
            v-bind:class="{ accent: i == currPrayIdx + 2 }"
          >
            <v-list-item-content>
              <h1 class="normal-font">{{item.pre}} {{currTimes[currTimeIdx][item.key]}}</h1>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
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
  private currPrayIdx = 2;
  private remainingTime = "1:38:21";
  private timeItems = [
    { pre: "", key: "MiladiTarihUzun" },
    { pre: "", key: "HicriTarihUzun" },
    { pre: "İmsak:", key: "Imsak" },
    { pre: "Güneş:", key: "Gunes" },
    { pre: "Öğle:", key: "Ogle" },
    { pre: "İkindi:", key: "Ikindi" },
    { pre: "Akşam:", key: "Aksam" },
    { pre: "Yatsı:", key: "Yatsi" }
  ];

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