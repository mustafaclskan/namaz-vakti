<template>
  <Panel>
    <template #header>
      <Button icon="pi pi-ellipsis-v" @click="visibleLeft = !visibleLeft" />
      <h3 class="main-container">{{currLoc}}</h3>
    </template>
    <Sidebar :visible.sync="visibleLeft">
      <SideBarContent v-on:curr-times-updated="currTimes = $event" />
    </Sidebar>

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
  </Panel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./SideBarContent.vue";
import { TimesData } from "./MetaType";
import { SettingService } from "../SettingService";

@Component({
  components: {
    SideBarContent
  }
})
export default class AppBody extends Vue {
  private visibleLeft = false;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.txt-center {
  text-align: center;
}
.normal-font {
  font-weight: normal;
}
</style>
