<template>
  <div class="m5">
    {{ $t("aboutTxt") }}
    <div>
      <a href="https://github.com/canbax/namaz-vakti" title="Source Codes">
        {{ $t("sourceCodes") }}
      </a>
    </div>
    <div>
      <a href="https://canbax.github.io/" title="Contact">
        {{ $t("contact") }}
      </a>
    </div>
    <br />
    <div>
      Icons made by
      <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
      from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
