<template>
  <Card>
    <template slot="title">Namaz Vakti</template>
    <template slot="content">
      <Sidebar :visible.sync="visibleLeft" :modal="false" class="p-sidebar-lg">
        <SideBarContent />
      </Sidebar>
      <Button icon="pi pi-arrow-right" @click="visibleLeft = !visibleLeft" />
      <div>asd asd ada sdasd</div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideBarContent from "./SideBarContent.vue";

@Component({
  components: {
    SideBarContent
  }
})
export default class AppBody extends Vue {
  public visibleLeft = true;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
