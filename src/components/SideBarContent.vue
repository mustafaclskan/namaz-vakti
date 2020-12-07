<template>
  <div v-bind:style="{ zoom: currZoom + '%' }">
    <v-expansion-panels multiple v-model="openPanels">
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t("addNewLocation") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
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
            :disabled="selectedCountry == null"
            :items="cities"
            :filter="filterByTxt"
            item-text="SehirAdi"
            v-on:input="onCitySelected"
            :label="$t('selectCity')"
            :placeholder="$t('selectCity')"
            return-object
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
            :label="$t('selectDistrict')"
            :placeholder="$t('selectDistrict')"
            return-object
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t("settings") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-select
            class="m-5"
            v-model="currLang"
            :items="langs"
            item-text="txt"
            v-on:input="onLangSelected"
            :label="$t('selectLanguage')"
            :placeholder="$t('selectLanguage')"
            return-object
          />
          <v-select
            class="m-5"
            v-model="currTheme"
            :items="themes"
            v-on:input="onThemeSelected"
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
              <span>{{ $t("changeZoom") }} (%{{ currZoom }})</span>
            </div>
            <div v-else class="m-5">
              <span>{{ $t("changeZoom") }} ({{ currZoom }}%)</span>
            </div>
            <div style="heigth: 100px">
              <v-btn class="m-5" v-on:click="zoomIn()" icon color="primary">
                <v-icon>mdi-magnify-plus</v-icon>
              </v-btn>
              <v-btn class="m-5" v-on:click="zoomOut()" icon color="primary">
                <v-icon>mdi-magnify-minus</v-icon>
              </v-btn>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t("about") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ $t("aboutTxt") }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import COUNTRIES from "../assets/countries.json";
import TR_CITIES from "../assets/cities.json";
import { Country, City, District, UiLanguage } from "../MetaType";
import { ApiClient } from "../ApiClient";
import { SettingService } from "../SettingService";
import { turkishDateStr2Date } from "@/helper";

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
  private openPanels = [];

  // special life-cycle hook for vue
  created(): void {
    this._api = new ApiClient();
    this.savedLocations = SettingService.getSavedLocations();
    this.currLocation = SettingService.getCurrLocation();
    this.currTheme = SettingService.getCurrTheme();
    this.currZoom = SettingService.getCurrZoom();

    this.currLang = this.langs.find(
      (x) => x.code === SettingService.getCurrLang()
    );
    if (!this.currLang) {
      this.currLang = this.langs[0];
    }
    this.onLangSelected(this.currLang);
    this.$vuetify.theme.dark = this.currTheme === "Dark";
    console.log("on side bar created");
    if (!SettingService.getCurrLocation()) {
      this.openPanels = [0];
    }
  }

  onThemeSelected(e: string): void {
    if (e) {
      SettingService.saveTheme(e);
      this.$vuetify.theme.dark = e === "Dark";
    }
  }

  onLangSelected(e: { txt: string; code: string }): void {
    if (e) {
      SettingService.saveLang(e.code);
      this.$i18n.locale = e.code;
      for (let i = 0; i < this.themes.length; i++) {
        this.themes[i] = this.$tc(this.themes[i]);
      }
      SettingService.saveTheme(this.currTheme || "Light");
      this.$emit("lang-selected", e.code);
    }
  }

  onCountrySelected(c: Country): void {
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

  onCitySelected(c: City): void {
    const country = this.selectedCountry ? this.selectedCountry.UlkeID : "";
    this._api.getDistricts4City(country, c.SehirID, (e) => {
      this.districts = e;
    });
  }

  onDistrictSelected(d: District): void {
    this._api.getTimes4District(d.IlceID, (e) => {
      if (
        this.selectedCountry != null &&
        this.selectedCity != null &&
        this.selectedDistrict != null
      ) {
        const unix_date = turkishDateStr2Date(e[0][0]);
        const id =
          this.selectedCountry.UlkeID +
          "_" +
          this.selectedCity.SehirID +
          "_" +
          this.selectedDistrict.IlceID +
          "_" +
          unix_date;
        SettingService.addTimesData(id, e, d.IlceAdi);
        this.savedLocations = SettingService.getSavedLocations();
        this.currLocation = SettingService.getCurrLocation();
        if (this.currLocation) {
          this.$emit("curr-times-updated", e);
        }
      }
    });
  }

  onSavedLocationSelected(e: string): void {
    SettingService.setCurrLocation(e);
    this.$emit("curr-times-updated", SettingService.getData4SavedLocation(e));
  }

  filterByTxt(item: Country, queryText: string, itemText: string): boolean {
    return itemText.toLowerCase().includes(queryText.toLowerCase());
  }

  zoomIn(): void {
    this.$emit("zoom-changed", true);
    this.currZoom = SettingService.getCurrZoom();
  }

  zoomOut(): void {
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
