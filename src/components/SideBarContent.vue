<template>
  <div>
    <v-card class="m-5">
      <v-card-title>{{$t('addNewLocation')}}</v-card-title>
      <v-autocomplete
        class="m-5"
        v-model="selectedCountry"
        :items="countries"
        :filter="filterByTxt"
        item-text="UlkeAdi"
        v-on:input="onCountrySelected"
        :placeholder="$t('selectCountry')"
        return-object
      />
      <br />
      <v-autocomplete
        class="m-5"
        v-model="selectedCity"
        v-if="selectedCountry != null"
        :items="cities"
        :filter="filterByTxt"
        item-text="sehirAdi"
        v-on:input="onCitySelected"
        :label="$t('selectCity')"
        :placeholder="$t('selectCity')"
        return-object
      />
      <br />
      <v-autocomplete
        class="m-5"
        v-model="selectedDistrict"
        v-if="selectedCity != null"
        :items="districts"
        :filter="filterByTxt"
        item-text="IlceAdi"
        v-on:input="onDistrictSelected"
        :label="$t('selectDistrict')"
        :placeholder="$t('selectDistrict')"
        return-object
      />
    </v-card>
    <v-card class="m-5">
      <v-card-title>{{$t('settings')}}</v-card-title>
      <v-select
        class="m-5"
        v-model="currLang"
        :items="langs"
        item-text="txt"
        v-on:input="onLangSelected"
        :filter="filterByTxt"
        :label="$t('selectLanguage')"
        :placeholder="$t('selectLanguage')"
        return-object
      />
      <v-select
        class="m-5"
        v-model="currTheme"
        :items="themes"
        v-on:input="onThemeSelected"
        :filter="filterByTxt"
        :label="$t('selectTheme')"
        :placeholder="$t('selectTheme')"
      />
      <v-autocomplete
        class="m-5"
        v-model="currLocation"
        :items="savedLocations"
        :filter="filterByTxt"
        v-on:input="onSavedLocationSelected"
        :label="$t('changeLocation')"
        :placeholder="$t('changeLocation')"
      />
      <div>
        <div v-if="currLang && currLang.code == 'tr'" class="m-5">
          <span>{{$t('changeZoom')}} (%{{currZoom}})</span>
        </div>
        <div v-else class="m-5">
          <span>{{$t('changeZoom')}} ({{currZoom}}%)</span>
        </div>
        <div>
          <v-btn class="m-5" v-on:click="zoomIn()" icon color="primary">
            <v-icon>mdi-magnify-plus</v-icon>
          </v-btn>
          <v-btn class="m-5" v-on:click="zoomOut()" icon color="primary">
            <v-icon>mdi-magnify-minus</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import COUNTRIES from "../assets/countries.json";
import TR_CITIES from "../assets/cities.json";
import { Country, City, District, THEMES, UiLanguage } from "./MetaType";
import { ApiClient } from "../ApiClient";
import { SettingService } from "../SettingService";
import { SubstrTranslator } from "../SubstrTranslator";

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
  private themes = ["Light", "Dark"];
  private langs: UiLanguage[] = [
    { txt: "English", code: "en" },
    { txt: "Türkçe", code: "tr" },
  ];
  private _api: ApiClient = new ApiClient();
  private currLocation: string | null = "";
  private currTheme: string | null = "";
  private currLang: UiLanguage | undefined = undefined;
  private currZoom = 100;

  // special life-cycle hook for vue
  created() {
    this._api = new ApiClient();
    this.savedLocations = SettingService.getSavedLocations();
    this.currLocation = SettingService.getCurrLocation();
    this.currTheme = SettingService.getCurrTheme();
    this.currZoom = SettingService.getCurrZoom();
    if (this.currTheme) {
      this.currTheme = this.$tc(this.currTheme);
    }
    for (let i = 0; i < this.themes.length; i++) {
      this.themes[i] = this.$tc(this.themes[i]);
    }
    this.currLang = this.langs.find(
      (x) => x.code === SettingService.getCurrLang()
    );
    if (!this.currLang) {
      this.currLang = this.langs[0];
    }
    this.onLangSelected(this.currLang);
    this.$vuetify.theme.dark =
      this.currTheme === "Dark" || this.currTheme === "Koyu";
  }

  onThemeSelected(e: string) {
    if (e) {
      // for (const i in THEMES[e]) {
      //   this.$vuetify.theme.themes.dark[i] = THEMES[e][i];
      //   this.$vuetify.theme.themes.light[i] = THEMES[e][i];
      // }
      SettingService.saveTheme(e);
      this.$vuetify.theme.dark = e === "Dark" || e === "Koyu";
    }
  }

  onLangSelected(e: { txt: string; code: string }) {
    if (e) {
      SettingService.saveLang(e.code);
      this.$i18n.locale = e.code;
      for (let i = 0; i < this.themes.length; i++) {
        this.themes[i] = this.$tc(this.themes[i]);
      }
      this.$emit("lang-selected", e.code);
    }
  }

  onCountrySelected(c: Country) {
    console.log(" on country selected: ", c);
    // Turkey is cached
    if (c.UlkeAdi == "TURKIYE") {
      this.cities = TR_CITIES;
      this.selectedCity = null;
      this.selectedDistrict = null;
    } else {
      this._api.getCities4Country(c.UlkeID, (e) => {
        this.cities = e;
        this.selectedCity = null;
        this.selectedDistrict = null;
      });
    }
  }

  onCitySelected(c: City) {
    this._api.getDistricts4City(c.sehirID, (e) => {
      this.districts = e;
    });
  }

  onDistrictSelected(d: District) {
    this._api.getTimes4District(d.IlceID, (e) => {
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
        if (this.currLocation) {
          this.$emit("curr-times-updated", e);
        }
      }
    });
  }

  onSavedLocationSelected(e: string) {
    SettingService.setCurrLocation(e);
    console.log(
      " on saved location selected: ",
      SettingService.getData4SavedLocation(e)
    );
    this.$emit("curr-times-updated", SettingService.getData4SavedLocation(e));
  }

  filterByTxt(item: object, queryText: string, itemText: string): boolean {
    return itemText.toLowerCase().includes(queryText.toLowerCase());
  }

  zoomIn() {
    this.$emit("zoom-changed", true);
    this.currZoom = SettingService.getCurrZoom();
  }

  zoomOut() {
    this.$emit("zoom-changed", false);
    this.currZoom = SettingService.getCurrZoom();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.m-5 {
  margin: 5px;
}
</style>
