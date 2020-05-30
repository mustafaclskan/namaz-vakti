<template>
  <div>
    <v-card class="m-5">
      <v-card-title>Yeni Konum Ekle</v-card-title>
      <v-autocomplete
        class="m-5"
        v-model="selectedCountry"
        :items="countries"
        :filter="filterByTxt"
        item-text="UlkeAdi"
        v-on:input="onCountrySelected"
        label="Select a Country"
        placeholder="Select a Country"
      />
      <br />
      <v-autocomplete
        class="m-5"
        v-model="selectedCity"
        :disabled="selectedCountry == null"
        :items="cities"
        :filter="filterByTxt"
        item-text="sehirAdi"
        v-on:input="onCitySelected"
        label="Select a City"
        placeholder="Select a City"
      />
      <br />
      <v-autocomplete
        class="m-5"
        v-model="selectedDistrict"
        :disabled="selectedCity == null"
        :items="districts"
        :filter="filterByTxt"
        item-text="IlceAdi"
        v-on:input="onDistrictSelected"
        label="Select a District"
        placeholder="Select a District"
      />
    </v-card>
    <v-card class="m-5">
      <v-card-title>Ayarlar</v-card-title>
      <v-autocomplete
        class="m-5"
        v-model="currTheme"
        :items="themes"
        v-on:input="onThemeSelected"
        :filter="filterByTxt"
        label="Select a theme"
        placeholder="Select a theme"
      />
      <br />
      <v-autocomplete
        class="m-5"
        v-model="currLocation"
        :items="savedLocations"
        :filter="filterByTxt"
        v-on:input="onSavedLocationSelected"
        label="Change location"
        placeholder="Change location"
      />
    </v-card>
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

  onCountrySelected(c: string) {
    console.log(" on country selected");
    // Turkey is cached
    if (c == "TURKIYE") {
      this.cities = TR_CITIES;
      this.selectedCity = null;
      this.selectedDistrict = null;
    } else {
      const curr: Country | undefined = this.countries.find(
        x => x.UlkeAdi == c
      );
      if (!curr) {
        console.log("country not found: ", c);
        return;
      }
      this._api.getCities4Country(curr.UlkeID, e => {
        this.cities = e;
        this.selectedCity = null;
        this.selectedDistrict = null;
      });
    }
  }

  onCitySelected(c: string) {
    const curr: City | undefined = this.cities.find(x => x.sehirAdi == c);
    if (!curr) {
      console.log("city not found: ", c);
      return;
    }

    this._api.getDistricts4City(curr.sehirID, e => {
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

  filterByTxt(item: object, queryText: string, itemText: string): boolean {
    return itemText.toLowerCase().includes(queryText.toLowerCase());
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.m-5 {
  margin: 5px;
}
</style>
