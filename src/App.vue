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
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./components/SideBarContent.vue";
import { SettingService } from "./SettingService";
import { SubstrTranslator } from "./SubstrTranslator";
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

  created() {
    this._api = new ApiClient();
    console.log('get times for data on created');
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
      if (d[0].toLowerCase().includes(this.date2str(today).toLowerCase())) {
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

  currTimesUpdated(data: string[][] | null) {
    console.log("curr times updated");
    this.currTimes = data;
    this.decodeCurrTimes();
    this.setCurrDayIdx();
  }

  langSelected() {
    for (let i = 0; i < this.timeItems.length; i++) {
      this.timeItems[i] = SubstrTranslator.t(this.timeItems[i]);
    }
    this.currLang = SettingService.getCurrLang();
  }

  zoomChanged(isIncrease: boolean) {
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

  private decodeCurrTimes() {
    if (!this.currTimes) {
      return;
    }
    for (let i = 0; i < this.currTimes.length; i++) {
      for (let j = 0; j < this.currTimes[i].length; j++) {
        this.currTimes[i][j] = this.decodeHTML(this.currTimes[i][j]);
      }
    }
  }

  private decodeHTML(str: string): string {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  private updateTimes4Current() {
    const k = SettingService.getDataKey4CurrentLocation();
    if (!k) {
      return;
    }
    const arr = k.split("_");

    this._api.getTimes4District(arr[arr.length - 2], (e) => {
      const id = arr.slice(0, -1).join("_") + "_" + e[0][0].replace(/\s/g, '');
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
    // if not found a greater total seconds it means it is the first
    this.currPrayIdx = 1;
    // first item in `currTimes` is date
    for (let i = 1; i < this.timeItems.length + 1; i++) {
      const curr = this.currTimes[this.currDayIdx][i];
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
    let month = this.month2Turkish(d.getMonth());
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (day.length < 2) {
      day = "0" + day;
    }

    return [day, month, year].join(" ");
  }

  private month2Turkish(m: number) {
    switch (m) {
      case 0:
        return "Ocak";
      case 1:
        return "Şubat";
      case 2:
        return "Mart";
      case 3:
        return "Nisan";
      case 4:
        return "Mayıs";
      case 5:
        return "Haziran";
      case 6:
        return "Temmuz";
      case 7:
        return "Ağustos";
      case 8:
        return "Eylül";
      case 9:
        return "Ekim";
      case 10:
        return "Kasım";
      case 11:
        return "Aralık";
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