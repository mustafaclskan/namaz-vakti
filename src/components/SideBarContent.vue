<template>
  <div>
    side bar content component
    <Dropdown
      v-model="selectedCar"
      :options="cars"
      optionLabel="brand"
      v-on:input="onInput"
      :filter="true"
      placeholder="Select a Car"
      :showClear="true"
    >
      <template #value="slotProps">
        <div class="p-dropdown-car-value" v-if="slotProps.value">
          <img
            :alt="slotProps.value.brand"
            :src="'demo/images/car/' + slotProps.value.brand + '.png'"
          />
          <span>{{slotProps.value.brand}}</span>
        </div>
        <span v-else>{{slotProps.placeholder}}</span>
      </template>
      <template #option="slotProps">
        <div class="p-dropdown-car-option">
          <img
            :alt="slotProps.option.brand"
            :src="'demo/images/car/' + slotProps.option.brand + '.png'"
          />
          <span>{{slotProps.option.brand}}</span>
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
  public selectedCar = null;
  public cars = [
    { brand: "Audi", value: "Audi" },
    { brand: "BMW", value: "BMW" },
    { brand: "Fiat", value: "Fiat" },
    { brand: "Honda", value: "Honda" },
    { brand: "Jaguar", value: "Jaguar" },
    { brand: "Mercedes", value: "Mercedes" },
    { brand: "Renault", value: "Renault" },
    { brand: "Volkswagen", value: "Volkswagen" },
    { brand: "Volvo", value: "Volvo" }
  ];

  onInput(e: Event) {
    if (e) {
      const file = document.getElementById('theme-link') as HTMLLinkElement;
      file.href = 'css/vela-blue.css'
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
