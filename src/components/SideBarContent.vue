<template>
  <div>
    side bar content component
    <AutoComplete
      v-model="brand"
      :suggestions="filteredBrands"
      @complete="searchBrand($event)"
      placeholder="Hint: type 'v' or 'f'"
      :dropdown="true"
    >
      <template #item="slotProps">
        <div class="p-autocomplete-brand-item">
          <div>{{slotProps.item}}</div>
        </div>
      </template>
    </AutoComplete>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SideBarContent extends Vue {
  public visibleLeft = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
