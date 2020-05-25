<template>
  <div>
    <h1 style="fontWeight:normal">Namaz Vakti 0.0.0</h1>

    <Fieldset legend="Add location" :toggleable="true" class="m-5">
      <Dropdown
        class="m-5"
        v-model="selectedCountry"
        :options="countries"
        :filter="true"
        optionLabel="UlkeAdi"
        v-on:input="onCountrySelected"
        placeholder="Select a Country"
      />
      <br />
      <Dropdown
        class="m-5"
        v-model="selectedCity"
        :disabled="selectedCountry == null"
        :options="cities"
        :filter="true"
        optionLabel="sehirAdi"
        v-on:input="onCitySelected"
        placeholder="Select a City"
      />
      <br />
      <Dropdown
        class="m-5"
        v-model="selectedDistrict"
        :disabled="selectedCity == null"
        :options="districts"
        :filter="true"
        optionLabel="IlceAdi"
        v-on:input="onDistrictSelected"
        placeholder="Select a District"
      />
    </Fieldset>

    <Fieldset legend="Settings" :toggleable="true" class="m-5">
      <Dropdown
        class="m-5"
        v-model="selectedTheme"
        :options="themes"
        v-on:input="onThemeSelected"
        optionLabel="name"
        :filter="true"
        placeholder="Select a theme"
        :showClear="true"
      >
        <template #option="slotProps">
          <div class="p-dropdown-imaged-option">
            <img
              :alt="slotProps.option.name"
              :src="'img/theme-icon/' + slotProps.option.name + '.png'"
            />
            <span>{{slotProps.option.name}}</span>
          </div>
        </template>
      </Dropdown>
      <br />
      <Dropdown
        class="m-5"
        v-model="selectedCountry"
        :options="countries"
        :filter="true"
        optionLabel="UlkeAdi"
        v-on:input="onCountrySelected"
        placeholder="Change location"
      />
    </Fieldset>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import COUNTRIES from "../assets/countries.json";
import TR_CITIES from "../assets/cities.json";
import { Country, City, District } from "./MetaType";
import { ApiClient } from "../ApiClient";

@Component
export default class SideBarContent extends Vue {
  public visibleLeft = false;
  public selectedTheme = null;
  public selectedCountry = null;
  public selectedCity = null;
  public selectedDistrict = null;
  public countries = COUNTRIES;
  public cities: City[] = [];
  public districts: District[] = [];
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
  public _api: ApiClient = new ApiClient();

  // special life-cycle hook for vue
  created() {
    this._api = new ApiClient();
  }

  onThemeSelected(e: { name: string }) {
    if (e) {
      const file = document.getElementById("theme-link") as HTMLLinkElement;
      file.href = `css/${e.name}/theme.css`;
    }
  }

  onCountrySelected(c: Country) {
    // Turkey is cached
    if (c.UlkeAdi == "TURKIYE") {
      this.cities = TR_CITIES;
    } else {
      // this._api = new ApiClient();
      this._api.getCities4Country(c.UlkeID, e => {
        this.cities = e;
      });
    }
  }

  onCitySelected(c: City) {
    this._api.getDistricts4City(c.sehirID, e => {
      this.districts = e;
    });
  }

  onDistrictSelected(d: District) {
    this._api.getTimes4District(d.IlceID, e => {
      // this.districts = e;
      console.log("times: ", e);
      this.$emit("curr-times-updated", e);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.p-dropdown-imaged-option {
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
.m-5 {
  margin: 5px;
}
</style>
