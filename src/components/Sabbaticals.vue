<template>
  <div>sabbaticals</div>
</template>

<script lang="ts">
import { clearHours } from "@/helper";
import { HijriDate } from "@/HijriDate";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Sabbaticals extends Vue {
  private hijri = new HijriDate();
  private sabbs = [];
  created(): void {
    const today = clearHours(new Date());
    console.log(
      "all sabbs: ",
      this.hijri
        .getAllSabbaticalsNear(today, 30)
        .map((x) => x.hijri.toStr() + " -> " + x.gre.toDateString() + ": " + x.sabb.name)
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
