<template>
  <div>
    side bar content component
    <Dropdown
      v-model="selectedTheme"
      :options="themes"
      v-on:input="onInput"
      optionLabel="name"
      :filter="true"
      placeholder="Select a theme"
      :showClear="true"
    >
      <!-- <template #value="slotProps">
        <div class="p-dropdown-car-value" v-if="slotProps.value">
          <img
            :src="'img/theme-icon/' + slotProps.value.name + '.png'"
            :alt="slotProps.option.name"
          />
          <span>{{slotProps.value.name}}</span>
        </div>
        <span v-else>{{slotProps.placeholder}}</span>
      </template>-->
      <template #option="slotProps">
        <div class="p-dropdown-car-option">
          <img
            :alt="slotProps.option.name"
            :src="'img/theme-icon/' + slotProps.option.name + '.png'"
          />
          <span>{{slotProps.option.name}}</span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SideBarContent extends Vue {
  public visibleLeft = false;
  public selectedTheme = null;

  public themes = [
    { name: "luna-amber" },
    { name: "luna-blue" },
    { name: "luna-green" },
    { name: "luna-pink" },
    { name: "nova-colored" },
    { name: "nova-dark" },
    { name: "nova-light" },
    { name: "nova-vue" },
    { name: "rhea" },
    { name: "saga-blue" },
    { name: "saga-cyan" },
    { name: "saga-deeppurple" },
    { name: "saga-green" },
    { name: "saga-indigo" },
    { name: "saga-orange" },
    { name: "saga-purple" },
    { name: "saga-teal" },
    { name: "vela-blue" },
    { name: "vela-cyan" },
    { name: "vela-deeppurple" },
    { name: "vela-green" },
    { name: "vela-indigo" },
    { name: "vela-orange" },
    { name: "vela-purple" },
    { name: "vela-teal" }
  ];

  onInput(e: { name: string }) {
    if (e) {
      const file = document.getElementById("theme-link") as HTMLLinkElement;
      file.href = `css/${e.name}/theme.css`;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.p-dropdown {
  width: 12rem;
}
.p-dropdown-car-option,
.p-dropdown-car-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    margin-right: 0.5rem;
    width: 24px;
  }
  span {
    line-height: 1;
  }
}
.p-dropdown-car-value {
  justify-content: flex-start;
  img {
    width: 17px;
  }
}
</style>
