<template>
  <div>
    <Sidebar :visible.sync="visibleLeft" class="p-sidebar-lg">
      <SideBarContent v-on:curr-times-updated="currTimes = $event" />
    </Sidebar>
    <Button icon="pi pi-ellipsis-v" @click="visibleLeft = !visibleLeft" />

    <div>{{currTimes}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./SideBarContent.vue";
import { TimesData } from "./MetaType";

@Component({
  components: {
    SideBarContent
  }
})
export default class AppBody extends Vue {
  public visibleLeft = true;
  public currTimes: TimesData[] = [];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
