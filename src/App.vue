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
      <v-list :flat="true" disabled v-if="currTimes && currTimes[currDayIdx]" class="txt-center">
        <v-list-item-group>
          <v-list-item>
            <v-list-item-content>
              <h1 class="normal-font">{{currTimes[currDayIdx]['MiladiTarihUzun']}}</h1>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <h2 class="normal-font">{{currTimes[currDayIdx]['HicriTarihUzun']}}</h2>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-for="(item, i) in timeItems" :key="i">
            <v-list-item-content>
              <h1
                v-bind:class="{ 'normal-font': i != currPrayIdx }"
              >{{item.pre}} {{currTimes[currDayIdx][item.key]}}</h1>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <h1
                class="normal-font"
              >{{ timeItems[currPrayIdx].pre.slice(0,-1) }} vakti için kalan süre {{remainingTime}}</h1>
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
  private currTimes: TimesData[] | null = null;
  private currDayIdx = 0;
  private currLoc: string | null = "";
  private currPrayIdx = 2;
  private remainingTime = "1:38:21";
  private timeItems = [
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
    // update remaining time for current pray every second
    setInterval(() => {
      this.updateRemainingTime();
    }, 1000);

    // update current pray index every minute
    this.updateCurrPrayIdx();
    setInterval(() => {
      this.updateCurrPrayIdx();
    }, 60000);
  }

  private updateRemainingTime() {
    if (!this.currTimes) {
      return;
    }
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const sec = d.getSeconds();
    const totalSec = h * 3600 + m * 60 + sec;
    const totalSec2 = this.strTime2TotalSec(
      (this.currTimes as any)[this.currDayIdx][
        this.timeItems[this.currPrayIdx].key
      ] as string
    );
    if (totalSec < totalSec2) {
      this.updateCurrPrayIdx();
      return;
    }
    const secDiff = totalSec - totalSec2;
    this.remainingTime = this.seconds2str(secDiff);
  }

  // from a string with format 22:21, return total number of seconds
  private strTime2TotalSec(s: string): number {
    return 3600 * +s.slice(0, 2) + 60 * +s.slice(3, 5);
  }

  private updateCurrPrayIdx() {
    if (!this.currTimes) {
      return;
    }
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const totalSec = h * 3600 + m * 60;
    this.currPrayIdx = 0;
    for (let i = 0; i < this.timeItems.length; i++) {
      const curr = (this.currTimes as any)[this.currDayIdx][
        this.timeItems[i].key
      ] as string;
      const totalSec2 = this.strTime2TotalSec(curr);
      if (totalSec < totalSec2) {
        this.currPrayIdx = i;
        break;
      }
    }
  }

  private seconds2str(i: number): string {
    let s = "";
    const h = Math.floor(i / 3600);
    if (h < 10) {
      s += "0" + h;
    } else {
      s += h;
    }
    s += ":";
    const m = Math.floor((i - 3600 * h) / 60);
    if (m < 10) {
      s += "0" + m;
    } else {
      s += m;
    }
    s += ":";
    const sec = i - 3600 * h - 60 * m;
    if (sec < 10) {
      s += "0" + sec;
    } else {
      s += sec;
    }
    return s;
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
.bold-font {
  font-weight: bold;
}
</style>