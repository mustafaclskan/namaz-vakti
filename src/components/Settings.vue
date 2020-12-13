<template>
  <div>
    <v-select
      class="m5"
      v-model="currLang"
      :items="langs"
      item-text="txt"
      v-on:input="onLangSelected"
      :label="$t('selectLanguage')"
      :placeholder="$t('selectLanguage')"
      return-object
    />
    <v-select
      class="m5"
      v-model="currTheme"
      :items="themes"
      v-on:input="onThemeSelected"
      :label="$t('selectTheme')"
      :placeholder="$t('selectTheme')"
    />
    <v-autocomplete
      class="m5"
      v-model="currLocation"
      :items="savedLocations"
      :filter="filterByTxt"
      v-on:input="onSavedLocationSelected"
      :label="$t('changeLocation')"
      :placeholder="$t('changeLocation')"
    />
    <div>
      <div v-if="currLang && currLang.code == 'tr'" class="m5">
        <span>{{ $t("changeZoom") }} (%{{ currZoom }})</span>
      </div>
      <div v-else class="m5">
        <span>{{ $t("changeZoom") }} ({{ currZoom }}%)</span>
      </div>
      <div style="heigth: 100px">
        <v-btn class="m5" v-on:click="zoomIn()" icon color="primary">
          <v-icon>mdi-magnify-plus</v-icon>
        </v-btn>
        <v-btn class="m5" v-on:click="zoomOut()" icon color="primary">
          <v-icon>mdi-magnify-minus</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
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

  // special life-cycle hook for vue
  created(): void {
    this._api = new ApiClient();
    this.savedLocations = SettingService.getSavedLocations();
    this.currLocation = SettingService.getCurrLocation();
    this.currTheme = SettingService.getCurrTheme();
    this.currZoom = SettingService.getCurrZoom();

    this.currLang = this.langs.find((x) => x.code === SettingService.getCurrLang());
    if (!this.currLang) {
      this.currLang = this.langs[0];
    }
    this.onLangSelected(this.currLang);
    this.$vuetify.theme.dark = this.currTheme === "Dark";
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
.m5 {
  margin: 5px;
}
</style>
