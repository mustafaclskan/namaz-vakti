<template>
  <v-app>
    <v-navigation-drawer v-model="isSideBarOpen" app>
      <SideBarContent
        v-on:curr-times-updated="currTimesUpdated($event)"
        v-on:lang-selected="langSelected($event)"
        v-on:zoom-changed="zoomChanged($event)"
      />
    </v-navigation-drawer>

    <v-app-bar app dense v-bind:style="{ zoom: currZoom + '%' }">
      <v-app-bar-nav-icon
        @click.stop="isSideBarOpen = !isSideBarOpen"
        color="primary"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>{{ currLoc }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-on:click="decreaseCurrDay()" icon color="primary">
        <v-icon>mdi-calendar-arrow-left</v-icon>
      </v-btn>
      <v-btn v-on:click="setCurrDayIdx()" icon color="primary">
        <v-icon>mdi-calendar-today</v-icon>
      </v-btn>
      <v-btn v-on:click="increaseCurrDay()" icon color="primary">
        <v-icon>mdi-calendar-arrow-right</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main v-bind:style="{ zoom: currZoom + '%' }">
      <div class="txt-center" v-if="!currTimes || !currTimes[currDayIdx]">
        <h2 class="normal-font">{{ $t("noTimeData") }}</h2>
      </div>
      <div class="txt-center" v-if="currTimes && currTimes[currDayIdx]">
        <h2 class="normal-font">
          {{ substrTranslate.t(substrTranslate.t(currTimes[currDayIdx][0])) }}
        </h2>
      </div>
      <v-divider></v-divider>
      <v-list
        :flat="true"
        disabled
        v-if="currTimes && currTimes[currDayIdx]"
        class="txt-center"
      >
        <v-list-item-group>
          <v-list-item v-for="(item, i) in timeItems" :key="i">
            <v-list-item-content>
              <h2 v-bind:class="{ 'normal-font': i != currPrayIdx - 1 }">
                {{ item }} {{ currTimes[currDayIdx][i + 1] }}
                <v-icon
                  v-if="i == currPrayIdx - 1"
                  style="vertical-align: initial"
                >
                  mdi-clock
                </v-icon>
              </h2>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <h2 class="normal-font" v-if="currLang && currLang == 'tr'">
                {{ timeItems[currPrayIdx - 1].slice(0, -1) }} vakti için kalan
                süre
                {{ remainingTime }}
              </h2>
              <h2 class="normal-font" v-else>
                Remaining time for
                {{ timeItems[currPrayIdx - 1].slice(0, -1) }}
                {{ remainingTime }}
              </h2>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-main>
  </v-app>
</template>

<script lang="ts">
// Bismillahirrahmanirrahim بسم الله الرحمن الرحيم
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./components/SideBarContent.vue";
import { SettingService } from "./SettingService";
import { SubstrTranslator } from "./SubstrTranslator";
import { runAllHijriDateTests } from "./HijriDate-test";
import { HijriDate } from "./HijriDate";

import {
  clearHours,
  date2str,
  decodeHTML,
  seconds2str,
  strTime2TotalSec,
  turkishDateStr2Date,
} from "./helper";
import { ApiClient } from "./ApiClient";

@Component({
  components: {
    SideBarContent,
  },
})
export default class App extends Vue {
  private isSideBarOpen = false;
  // array of array of strings, first is the date the rest 6 are times for prayings
  private currTimes: string[][] | null = null;
  private currDayIdx = 0;
  private currLoc: string | null = "";
  private currPrayIdx = 2;
  private remainingTime = "";
  private timeItems = [
    "İmsak:",
    "Güneş:",
    "Öğle:",
    "İkindi:",
    "Akşam:",
    "Yatsı:",
  ];
  private substrTranslate = SubstrTranslator;
  private currLang = SettingService.getCurrLang();
  private _api: ApiClient = new ApiClient();
  private currZoom = 100;
  private hijri = new HijriDate();

  created(): void {
    this._api = new ApiClient();
    this.currTimes = SettingService.getTimes4CurrentLocation();
    this.decodeCurrTimes();
    this.currLoc = SettingService.getCurrLocation();
    this.currZoom = SettingService.getCurrZoom();
    this.setCurrDayIdx();
    // update remaining time for current pray every second
    setInterval(() => {
      this.updateRemainingTime();
    }, 1000);

    // update current pray index every minute
    this.updateCurrPrayIdx();
    setInterval(() => {
      this.updateCurrPrayIdx();
    }, 60000);

    // runAllHijriDateTests();
    const today = clearHours(new Date());
    console.log("today in hijri: ", this.hijri.toHijri(today).toStr());
    console.log("nearest sabb: ", this.hijri.getNearestSabbatical(today));
    console.log("nearest sabb: ", this.hijri.getAllSabbaticalsNear(today, 30));
  }

  setCurrDayIdx(): void {
    if (!this.currTimes) {
      console.log("times data not exists");
      this.isSideBarOpen = true;
      return;
    }
    const today = new Date();
    let idx = 0;
    for (const d of this.currTimes) {
      if (d[0].toLowerCase().includes(date2str(today).toLowerCase())) {
        this.currDayIdx = idx;
        return;
      }
      idx++;
    }
    console.log("current day not found in current times data");
    this.updateTimes4Current();
  }

  increaseCurrDay(): void {
    if (!this.currTimes) {
      return;
    }
    if (this.currDayIdx < this.currTimes.length - 1) {
      this.currDayIdx++;
    }
  }

  decreaseCurrDay(): void {
    if (this.currDayIdx > 0) {
      this.currDayIdx--;
    }
  }

  currTimesUpdated(data: string[][] | null): void {
    this.currTimes = data;
    this.decodeCurrTimes();
    this.setCurrDayIdx();
    this.currLoc = SettingService.getCurrLocation();
  }

  langSelected(): void {
    for (let i = 0; i < this.timeItems.length; i++) {
      this.timeItems[i] = SubstrTranslator.t(this.timeItems[i]);
    }
    this.currLang = SettingService.getCurrLang();
  }

  zoomChanged(isIncrease: boolean): void {
    if (isIncrease) {
      if (this.currZoom < 400) {
        this.currZoom = this.currZoom + 10;
      }
    } else {
      if (this.currZoom > 20) {
        this.currZoom = this.currZoom - 10;
      }
    }
    SettingService.setCurrZoom(this.currZoom);
  }

  private decodeCurrTimes(): void {
    if (!this.currTimes) {
      return;
    }
    for (let i = 0; i < this.currTimes.length; i++) {
      for (let j = 0; j < this.currTimes[i].length; j++) {
        this.currTimes[i][j] = decodeHTML(this.currTimes[i][j]);
      }
    }
  }

  private updateTimes4Current(): void {
    const k = SettingService.getDataKey4CurrentLocation();
    if (!k) {
      return;
    }
    const arr = k.split("_");

    this._api.getTimes4District(arr[arr.length - 2], (e) => {
      const unix_date = turkishDateStr2Date(e[0][0]);
      const id = arr.slice(0, -1).join("_") + "_" + unix_date;
      const loc = SettingService.getCurrLocation();
      if (loc) {
        SettingService.addTimesData(id, e, loc);
      }
    });
  }

  private updateRemainingTime(): void {
    if (!this.currTimes) {
      return;
    }
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const sec = d.getSeconds();
    const currSeconds = h * 3600 + m * 60 + sec;
    const prayTimeInSeconds = strTime2TotalSec(
      this.currTimes[this.currDayIdx][this.currPrayIdx]
    );
    if (currSeconds > prayTimeInSeconds && this.currPrayIdx != 1) {
      this.updateCurrPrayIdx();
      return;
    }
    let secDiff = prayTimeInSeconds - currSeconds;
    // means we should measure time difference for the next day
    if (secDiff < 0) {
      secDiff = 86400 - currSeconds + prayTimeInSeconds;
    }
    this.remainingTime = seconds2str(secDiff);
  }

  private updateCurrPrayIdx(): void {
    if (!this.currTimes) {
      return;
    }
    const d = new Date();
    this.setCurrDayIdx();
    const h = d.getHours();
    const m = d.getMinutes();
    const totalSec = h * 3600 + m * 60;
    // if not found a greater total seconds it means it is the first
    this.currPrayIdx = 1;
    // first item in `currTimes` is date
    for (let i = 1; i < this.timeItems.length + 1; i++) {
      const curr = this.currTimes[this.currDayIdx][i];
      const totalSec2 = strTime2TotalSec(curr);
      if (totalSec < totalSec2) {
        this.currPrayIdx = i;
        break;
      }
    }
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