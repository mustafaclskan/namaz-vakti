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
        v-model="currTheme"
        :options="themes"
        v-on:input="onThemeSelected"
        :filter="true"
        placeholder="Select a theme"
      >
        <template #value="slotProps">
          <div class="p-dropdown-imaged-option">
            <img :alt="slotProps.value" :src="'img/theme-icon/' + slotProps.value + '.png'" />
            <span>{{slotProps.value}}</span>
          </div>
        </template>
        <template #option="slotProps">
          <div class="p-dropdown-imaged-option">
            <img :alt="slotProps.option" :src="'img/theme-icon/' + slotProps.option + '.png'" />
            <span>{{slotProps.option}}</span>
          </div>
        </template>
      </Dropdown>
      <br />
      <Dropdown
        class="m-5"
        v-model="currLocation"
        :options="savedLocations"
        :filter="true"
        v-on:input="onSavedLocationSelected"
        placeholder="Change location"
      />
    </Fieldset>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import COUNTRIES from "../assets/countries.json";
import TR_CITIES from "../assets/cities.json";
import { Country, City, District } from "./MetaType";
import { ApiClient } from "../ApiClient";
import { SettingService } from "../SettingService";

@Component
export default class SideBarContent extends Vue {
  private visibleLeft = false;
  private selectedCountry: Country | null = null;
  private selectedCity: City | null = null;
  private selectedDistrict: District | null = null;
  private savedLocations: string[] = [];
  private countries = COUNTRIES;
  private cities: City[] = [];
  private districts: District[] = [];
  private themes = [
    "luna-amber",
    "luna-blue",
    "luna-green",
    "luna-pink",
    "nova-colored",
    "nova-dark",
    "nova-light",
    "nova-vue",
    "rhea",
    "saga-blue",
    "saga-cyan",
    "saga-deeppurple",
    "saga-green",
    "saga-indigo",
    "saga-orange",
    "saga-purple",
    "saga-teal",
    "vela-blue",
    "vela-cyan",
    "vela-deeppurple",
    "vela-green",
    "vela-indigo",
    "vela-orange",
    "vela-purple",
    "vela-teal"
  ];
  private _api: ApiClient = new ApiClient();
  private currLocation: string | null = "";
  private currTheme: string | null = "";

  // special life-cycle hook for vue
  created() {
    this._api = new ApiClient();
    this.savedLocations = SettingService.getSavedLocations();
    this.currLocation = SettingService.getCurrLocation();
    this.currTheme = SettingService.getCurrTheme();
  }

  onThemeSelected(e: string) {
    if (e) {
      SettingService.setTheme(e);
    }
  }

  onCountrySelected(c: Country) {
    // Turkey is cached
    if (c.UlkeAdi == "TURKIYE") {
      this.cities = TR_CITIES;
      this.selectedCity = null;
      this.selectedDistrict = null;
    } else {
      // this._api = new ApiClient();
      this._api.getCities4Country(c.UlkeID, e => {
        this.cities = e;
        this.selectedCity = null;
        this.selectedDistrict = null;
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
      if (
        this.selectedCountry != null &&
        this.selectedCity != null &&
        this.selectedDistrict != null
      ) {
        const id =
          this.selectedCountry.UlkeID +
          "_" +
          this.selectedCity.sehirID +
          "_" +
          this.selectedDistrict.IlceID +
          "_" +
          e[0].MiladiTarihKisa;
        SettingService.addTimesData(id, e, d.IlceAdi);
        this.savedLocations = SettingService.getSavedLocations();
        this.currLocation = SettingService.getCurrLocation();
      }

      this.$emit("curr-times-updated", e[0]);
    });
  }

  onSavedLocationSelected(e: string) {
    SettingService.setCurrLocation(e);
    this.$emit("curr-times-updated", SettingService.getData4SavedLocation(e));
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
