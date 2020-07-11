<template>
  <v-app>
    <v-navigation-drawer v-model="isSideBarOpen" app>
      <SideBarContent
        v-on:curr-times-updated="currTimesUpdated($event)"
        v-on:lang-selected="langSelected($event)"
      />
    </v-navigation-drawer>

    <v-app-bar app dense>
      <v-app-bar-nav-icon @click.stop="isSideBarOpen = !isSideBarOpen" color="primary"></v-app-bar-nav-icon>
      <v-toolbar-title>{{currLoc}}</v-toolbar-title>
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

    <v-content>
      <div class="txt-center" v-if="!currTimes || !currTimes[currDayIdx]">
        <h2 class="normal-font">{{$t('noTimeData')}}</h2>
      </div>
      <div class="txt-center" v-if="currTimes && currTimes[currDayIdx]">
        <h2
          class="normal-font"
        >{{ substrTranslate.t(substrTranslate.t(currTimes[currDayIdx]['MiladiTarihUzun']))}}</h2>
        <h4 class="normal-font">{{currTimes[currDayIdx]['HicriTarihUzun']}}</h4>
      </div>
      <v-divider></v-divider>
      <v-list :flat="true" disabled v-if="currTimes && currTimes[currDayIdx]" class="txt-center">
        <v-list-item-group>
          <v-list-item v-for="(item, i) in timeItems" :key="i">
            <v-list-item-content>
              <h2 v-bind:class="{ 'normal-font': i != currPrayIdx }">
                {{item.pre}} {{currTimes[currDayIdx][item.key]}}
                <v-icon v-if="i == currPrayIdx" style="vertical-align: initial">mdi-clock</v-icon>
              </h2>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <h2
                class="normal-font"
                v-if="currLang && currLang == 'tr'"
              >{{ timeItems[currPrayIdx].pre.slice(0,-1) }} vakti için kalan süre {{remainingTime}}</h2>
              <h2
                class="normal-font"
                v-else
              >Remaining time for {{ timeItems[currPrayIdx].pre.slice(0,-1) }} {{remainingTime}}</h2>
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
import { SubstrTranslator } from "./SubstrTranslator";
import { ApiClient } from "./ApiClient";

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
  private remainingTime = "";
  private timeItems = [
    { pre: "İmsak:", key: "Imsak" },
    { pre: "Güneş:", key: "Gunes" },
    { pre: "Öğle:", key: "Ogle" },
    { pre: "İkindi:", key: "Ikindi" },
    { pre: "Akşam:", key: "Aksam" },
    { pre: "Yatsı:", key: "Yatsi" }
  ];
  private substrTranslate = SubstrTranslator;
  private currLang = SettingService.getCurrLang();
  private _api: ApiClient = new ApiClient();

  created() {
    this._api = new ApiClient();
    this.currTimes = SettingService.getTimes4CurrentLocation();
    this.currLoc = SettingService.getCurrLocation();
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
    this.langSelected();
  }

  setCurrDayIdx() {
    if (!this.currTimes) {
      console.log("times data not exists");
      this.isSideBarOpen = true;
      return;
    }
    const today = new Date();
    let idx = 0;
    for (const d of this.currTimes) {
      if (this.date2str(today) == d.MiladiTarihKisa) {
        this.currDayIdx = idx;
        return;
      }
      idx++;
    }
    console.log("current day not found in current times data");
    this.updateTimes4Current();
  }

  increaseCurrDay() {
    if (!this.currTimes) {
      return;
    }
    if (this.currDayIdx < this.currTimes.length - 1) {
      this.currDayIdx++;
    }
  }

  decreaseCurrDay() {
    if (this.currDayIdx > 0) {
      this.currDayIdx--;
    }
  }

  currTimesUpdated(data: TimesData[] | null) {
    this.currTimes = data;
    this.setCurrDayIdx();
  }

  langSelected() {
    for (let i = 0; i < this.timeItems.length; i++) {
      this.timeItems[i].pre = SubstrTranslator.t(this.timeItems[i].pre);
    }
    this.currLang = SettingService.getCurrLang();
  }

  private updateTimes4Current() {
    const k = SettingService.getDataKey4CurrentLocation();
    if (!k) {
      return;
    }
    const arr = k.split("_");

    this._api.getTimes4District(arr[arr.length - 2], e => {
      const id = arr.slice(0, -1).join("_") + "_" + e[0].MiladiTarihKisa;
      const loc = SettingService.getCurrLocation();
      if (loc) {
        SettingService.addTimesData(id, e, loc);
      }
    });
  }

  private updateRemainingTime() {
    if (!this.currTimes) {
      return;
    }
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const sec = d.getSeconds();
    const currSeconds = h * 3600 + m * 60 + sec;
    const prayTimeInSeconds = this.strTime2TotalSec(
      (this.currTimes as any)[this.currDayIdx][
        this.timeItems[this.currPrayIdx].key
      ] as string
    );
    if (currSeconds > prayTimeInSeconds && this.currPrayIdx != 0) {
      this.updateCurrPrayIdx();
      return;
    }
    let secDiff = prayTimeInSeconds - currSeconds;
    // means we should measure time difference for the next day
    if (secDiff < 0) {
      secDiff = 86400 - currSeconds + prayTimeInSeconds;
    }
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
    this.setCurrDayIdx();
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
    if (h > 0) {
      if (h < 10) {
        s += "0" + h;
      } else {
        s += h;
      }
      s += ":";
    }
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

  private date2str(d: Date | null = null): string {
    if (!d) {
      d = new Date();
    }
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [day, month, year].join(".");
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