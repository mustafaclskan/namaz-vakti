<template>
  <v-app>
    <v-navigation-drawer v-model="isSideBarOpen" app>
      <!-- <SideBarContent
        v-on:curr-times-updated="currTimesUpdated($event)"
        v-on:lang-selected="langSelected($event)"
        v-on:zoom-changed="zoomChanged($event)"
      /> -->
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            link
            @click="isSideBarOpen = false"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dense v-bind:style="{ zoom: currZoom + '%' }">
      <v-app-bar-nav-icon
        @click.stop="isSideBarOpen = !isSideBarOpen"
        color="primary"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span v-if="selectedItem == 0">{{ currLoc }}</span>
        <span v-if="selectedItem == 1">{{ $t("addNewLocation") }}</span>
        <span v-if="selectedItem == 2">{{ $t("sabbaticals") }}</span>
        <span v-if="selectedItem == 3">{{ $t("settings") }}</span>
        <span v-if="selectedItem == 4">{{ $t("about") }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="selectedItem == 0">
        <v-btn v-on:click="decreaseCurrDay()" icon color="primary">
          <v-icon>mdi-calendar-arrow-left</v-icon>
        </v-btn>
        <v-btn v-on:click="setCurrDayIdx()" icon color="primary">
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
        <v-btn v-on:click="increaseCurrDay()" icon color="primary">
          <v-icon>mdi-calendar-arrow-right</v-icon>
        </v-btn>
      </span>
    </v-app-bar>

    <v-main v-bind:style="{ zoom: currZoom + '%' }" class="m5">
      <div v-bind:class="{ h0: isLoading }">
        <div v-if="selectedItem == 0">
          <div class="txt-center" v-if="!currTimes || !currTimes[currDayIdx]">
            <h2 class="normal-font">{{ $t("noTimeData") }}</h2>
          </div>
          <div class="txt-center" v-if="currTimes && currTimes[currDayIdx]">
            <h2 class="normal-font">
              {{ substrTranslate.t(substrTranslate.t(currTimes[currDayIdx][0])) }}
            </h2>
            <h4 class="normal-font">
              {{ currHijriDate }}
            </h4>
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
                    <v-icon v-if="i == currPrayIdx - 1" style="vertical-align: initial">
                      mdi-clock
                    </v-icon>
                  </h2>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item v-if="isShowingToday">
                <v-list-item-content>
                  <span class="normal-font" v-if="currLang && currLang == 'tr'">
                    {{ timeItems[currPrayIdx - 1].slice(0, -1) }} vakti için kalan süre
                  </span>
                  <span class="normal-font" v-else>
                    Remaining time for
                    {{ timeItems[currPrayIdx - 1].slice(0, -1) }}
                  </span>
                  <h2>{{ remainingTime }}</h2>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <div class="txt-center" v-if="nearSabbaticalStr">
            <h4 class="normal-font glow">{{ nearSabbaticalStr }}</h4>
          </div>
        </div>
        <AddLocation
          v-if="selectedItem == 1"
          v-on:curr-times-updated="currTimesUpdated($event)"
        />
        <Sabbaticals v-if="selectedItem == 2" />
        <Settings
          v-if="selectedItem == 3"
          v-on:curr-times-updated="currTimesUpdated($event)"
          v-on:lang-selected="langSelected($event)"
          v-on:zoom-changed="zoomChanged($event)"
        />
        <About v-if="selectedItem == 4" />
      </div>

      <div class="spinner-container" v-if="isLoading">
        <v-progress-circular
          color="primary"
          :size="319"
          :width="19"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
// Bismillahirrahmanirrahim بسم الله الرحمن الرحيم
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./components/SideBarContent.vue";
import AddLocation from "./components/AddLocation.vue";
import Settings from "./components/Settings.vue";
import Sabbaticals from "./components/Sabbaticals.vue";
import About from "./components/About.vue";
import { SettingService } from "./SettingService";
import { StateService } from "./StateService";
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
    AddLocation,
    Settings,
    Sabbaticals,
    About,
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
  private timeItems = ["İmsak:", "Güneş:", "Öğle:", "İkindi:", "Akşam:", "Yatsı:"];
  private substrTranslate = SubstrTranslator;
  private currLang = SettingService.getCurrLang();
  private _api: ApiClient = new ApiClient();
  private currZoom = 100;
  private hijri = new HijriDate();
  private currHijriDate = "";
  private isShowingToday = true;
  private menuItems: { icon: string; title: string; idx: number }[] = [
    { icon: "mdi-clock-time-four-outline", title: "times", idx: 0 },
    { icon: "mdi-map-marker-plus", title: "addNewLocation", idx: 1 },
    { icon: "mdi-calendar-month-outline", title: "sabbaticals", idx: 2 },
    { icon: "mdi-cog-outline", title: "settings", idx: 3 },
    { icon: "mdi-information-outline", title: "about", idx: 4 },
  ];
  private selectedItem = 0;
  private isLoading = false;
  private nearSabbaticalStr: string | null = null;
  private readonly PRE_SABB_LIMIT = 4;

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

    const today = clearHours(new Date());

    StateService.addListener((x: boolean) => {
      this.isLoading = x;
    });
    const currLang = SettingService.getCurrLang();
    if (currLang) {
      this.$i18n.locale = currLang;
    }

    const currTheme = SettingService.getCurrTheme();
    this.$vuetify.theme.dark = currTheme === "Dark";
  }

  setCurrDayIdx(): void {
    if (!this.currTimes) {
      console.log("times data not exists");
      this.isSideBarOpen = true;
      this.selectedItem = 1;
      return;
    }
    const today = new Date();
    let idx = 0;
    for (const d of this.currTimes) {
      if (d[0].toLowerCase().includes(date2str(today).toLowerCase())) {
        this.currDayIdx = idx;
        this.setHijriDateStr();
        this.setIsShowingToday();
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
      this.setHijriDateStr();
      this.setIsShowingToday();
    }
  }

  decreaseCurrDay(): void {
    if (this.currDayIdx > 0) {
      this.currDayIdx--;
      this.setHijriDateStr();
      this.setIsShowingToday();
    }
  }

  currTimesUpdated(data: string[][] | null): void {
    this.selectedItem = 0;
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

  setHijriDateStr() {
    console.log("set hijri date str");
    setTimeout(() => {
      if (!this.currTimes || !this.currTimes[this.currDayIdx]) {
        return;
      }
      const date = new Date(turkishDateStr2Date(this.currTimes[this.currDayIdx][0]));
      const hij = this.hijri.toHijri(date);
      this.currHijriDate = this.hijri2str(hij);
      this.setNearestSabbatical(date);
    }, 0);
  }

  setNearestSabbatical(date: Date) {
    const sabb = this.hijri.getNearestSabbatical(date);
    if (sabb.cnt < this.PRE_SABB_LIMIT) {
      if (sabb.sabb?.name) {
        if (sabb.cnt === 1) {
          this.nearSabbaticalStr = this.$tc("tomorrow") + " " + this.$tc(sabb.sabb?.name);
        } else {
          this.nearSabbaticalStr =
            sabb.cnt + " " + this.$tc("daysLater") + " " + this.$tc(sabb.sabb?.name);
        }
      }
    } else {
      this.nearSabbaticalStr = null;
    }
    console.log("sabb: ", this.nearSabbaticalStr);
  }

  setIsShowingToday() {
    if (!this.currTimes || !this.currTimes[this.currDayIdx]) {
      return;
    }
    const t = new Date();
    const d = new Date(turkishDateStr2Date(this.currTimes[this.currDayIdx][0]));
    this.isShowingToday =
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear() &&
      d.getDate() == t.getDate();
  }

  private hijri2str(h: HijriDate): string {
    return h.getDay() + " " + this.$t("hijriMonth" + h.getMonth()) + " " + h.getYear();
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
.m5 {
  margin: 5px;
}
.h0 {
  display: none;
}
.spinner-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

.glow {
  text-align: center;
  -webkit-animation: glow 1s ease-in-out 4 alternate;
  -moz-animation: glow 1s ease-in-out 4 alternate;
  animation: glow 1s ease-in-out 4 alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 0px primary;
  }

  to {
    text-shadow: 0 0 2px #1976d2;
  }
}
</style>
