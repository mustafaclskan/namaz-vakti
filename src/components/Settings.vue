<template>
  <v-container fluid>
    <v-autocomplete
      v-model="currLocation"
      :items="savedLocations"
      :filter="filterByTxt"
      v-on:input="onSavedLocationSelected"
      :label="$t('changeLocation')"
      :placeholder="$t('changeLocation')"
    />
    <v-select
      v-model="currLang"
      :items="langs"
      item-text="txt"
      v-on:input="onLangSelected"
      :label="$t('selectLanguage')"
      :placeholder="$t('selectLanguage')"
      return-object
    />
    <v-select
      v-model="currTheme"
      :items="themes"
      v-on:input="onThemeSelected"
      :label="$t('selectTheme')"
      :placeholder="$t('selectTheme')"
    />
    <v-checkbox
      v-model="isShowHijriDate"
      @click="isShowHijriClicked()"
      :label="$t('isShowHijriDate')"
    />
    <v-row align="center">
      <v-col class="d-flex" cols="4">
        <v-select
          v-model="currTheme"
          :items="yearFormats"
          v-on:input="onThemeSelected"
          :label="$t('yearFormat')"
          :placeholder="$t('yearFormat')"
        />
      </v-col>
      <v-col class="d-flex" cols="4">
        <v-select
          v-model="currTheme"
          :items="monthFormats"
          v-on:input="onThemeSelected"
          :label="$t('monthFormat')"
          :placeholder="$t('monthFormat')"
        />
      </v-col>
      <v-col class="d-flex" cols="4">
        <v-select
          v-model="currTheme"
          :items="weekDayFormats"
          v-on:input="onThemeSelected"
          :label="$t('weekDayFormat')"
          :placeholder="$t('weekDayFormat')"
        />
      </v-col>
    </v-row>
    <div>
      <div v-if="currLang && currLang.code == 'tr'">
        <span>{{ $t("changeZoom") }} (%{{ currZoom }})</span>
      </div>
      <div v-else>
        <span>{{ $t("changeZoom") }} ({{ currZoom }}%)</span>
      </div>
      <div style="heigth: 100px">
        <v-btn v-on:click="zoomIn()" icon color="primary">
          <v-icon>mdi-magnify-plus</v-icon>
        </v-btn>
        <v-btn v-on:click="zoomOut()" icon color="primary">
          <v-icon>mdi-magnify-minus</v-icon>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Country, UiLanguage } from "../MetaType";
import { ApiClient } from "../ApiClient";
import { SettingService } from "../SettingService";

@Component
export default class Settings extends Vue {
  private savedLocations: string[] = [];
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
  private isShowHijriDate = true;
  private yearFormats: string[] = ["YYYY", "YY", "-"];
  private monthFormats: string[] = ["MMMM", "MMM", "MM"];
  private weekDayFormats: string[] = ["DDDD", "DDD", "-"];

  // special life-cycle hook for vue
  created(): void {
    this._api = new ApiClient();
    this.savedLocations = SettingService.getSavedLocations();
    this.currLocation = SettingService.getCurrLocation();
    this.currTheme = SettingService.getCurrTheme();
    this.currZoom = SettingService.getCurrZoom();

    this.isShowHijriDate = SettingService.getIsShowHijri();

    this.currLang = this.langs.find((x) => x.code === SettingService.getCurrLang());
    if (!this.currLang) {
      this.currLang = this.langs[1]; // default is turkish
    }
    if (!this.currTheme) {
      this.currTheme = "Light";
    }
    this.onLangSelected(this.currLang);
    this.$vuetify.theme.dark = this.currTheme === "Dark";
  }

  onThemeSelected(e: string): void {
    if (e) {
      SettingService.setCurrTheme(e);
      this.$vuetify.theme.dark = e === "Dark";
    }
  }

  onLangSelected(e: { txt: string; code: string }): void {
    if (e) {
      SettingService.setCurrLang(e.code);
      this.$i18n.locale = e.code;
      for (let i = 0; i < this.themes.length; i++) {
        this.themes[i] = this.$tc(this.themes[i]);
      }
      SettingService.setCurrTheme(this.currTheme || "Light");
      this.$emit("lang-selected", e.code);
    }
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

  isShowHijriClicked(): void {
    SettingService.setIsShowHijri(this.isShowHijriDate);
    this.$emit("is-show-hijri-changed", this.isShowHijriDate);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.m5 {
  margin: 5px;
}
</style>
