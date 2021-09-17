import { StringDict } from "./MetaType";

export class SettingService {
  private static QUEUE_LIMIT = 33;
  private static QUEUE_KEY = "timesQueue";
  private static YEAR_FMT_KEY = "yearFormat";
  private static MONTH_FMT_KEY = "monthFormat";
  private static WEEKDAY_FMT_KEY = "weekdayFormat";
  private static TIME_FMT_KEY = "timeFormat";
  private static THEME_KEY = "theme";
  private static CURR_LOC_KEY = "currLoc";
  private static CURR_LANG_KEY = "currLang";
  private static CUR_ZOOM_KEY = "currZoom";
  private static IS_SHOW_HIJRI_KEY = "showHijri";

  static setCurrLang(langCode: string): void {
    localStorage.setItem(this.CURR_LANG_KEY, langCode);
  }

  static getCurrLang(): string | null {
    return localStorage.getItem(this.CURR_LANG_KEY);
  }

  static getCurrLocation(): string | null {
    return localStorage.getItem(this.CURR_LOC_KEY);
  }

  static getCurrZoom(): number {
    const v = localStorage.getItem(this.CUR_ZOOM_KEY);
    if (v === null) {
      return 100;
    }
    return +v;
  }

  static setCurrZoom(v: number): void {
    localStorage.setItem(this.CUR_ZOOM_KEY, v + "");
  }

  static getIsShowHijri(): boolean {
    const v = localStorage.getItem(this.IS_SHOW_HIJRI_KEY);
    if (!v) {
      return true;
    }
    if (v === "true") {
      return true;
    }
    return false;
  }

  static setIsShowHijri(v: boolean): void {
    localStorage.setItem(this.IS_SHOW_HIJRI_KEY, v + "");
  }

  static setCurrLocation(loc: string): void {
    localStorage.setItem(this.CURR_LOC_KEY, loc);
  }

  static setCurrTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  static getCurrTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  static setCurrYearFormat(theme: string): void {
    localStorage.setItem(this.YEAR_FMT_KEY, theme);
  }

  static getCurrYearFormat(): string {
    const r = localStorage.getItem(this.YEAR_FMT_KEY);
    if (r) {
      return r;
    }
    return "YYYY";
  }

  static setCurrMonthFormat(theme: string): void {
    localStorage.setItem(this.MONTH_FMT_KEY, theme);
  }

  static getCurrMonthFormat(): string {
    const r = localStorage.getItem(this.MONTH_FMT_KEY);
    if (r) {
      return r;
    }
    return "MMMM";
  }

  static setCurrWeekdayFormat(theme: string): void {
    localStorage.setItem(this.WEEKDAY_FMT_KEY, theme);
  }

  static getCurrWeekdayFormat(): string {
    const r = localStorage.getItem(this.WEEKDAY_FMT_KEY);
    if (r) {
      return r;
    }
    return "DDDD";
  }

  static setCurrTimeFmt(idx: number): void {
    localStorage.setItem(this.TIME_FMT_KEY, idx + "");
  }

  static getCurrTimeFmt(): number {
    const r = localStorage.getItem(this.TIME_FMT_KEY);
    if (!r) {
      return 0;
    }
    return Number(r);
  }

  static getSavedLocations(): string[] {
    const locs = localStorage.getItem(this.QUEUE_KEY);
    if (locs) {
      const arr = JSON.parse(locs) as StringDict[];
      const s: string[] = [];
      // keys are IDS for data, values are human readable location names
      for (let i = 0; i < arr.length; i++) {
        s.push(Object.values(arr[i])[0] as string);
      }
      return s;
    } else {
      return [];
    }
  }

  // needs change
  static getData4SavedLocation(loc: string): string[] | null {
    const locs = localStorage.getItem(this.QUEUE_KEY);
    if (locs != null) {
      const arr = JSON.parse(locs) as StringDict[];
      for (let i = 0; i < arr.length; i++) {
        if (Object.values(arr[i])[0] == loc) {
          const data = localStorage.getItem(Object.keys(arr[i])[0]);
          if (data != null) {
            return JSON.parse(data) as string[];
          }
        }
      }
    }
    return null;
  }

  static addTimesData(key: string, data: string[][], locName: string): void {
    localStorage.setItem(key, JSON.stringify(data));
    let d = localStorage.getItem(this.QUEUE_KEY);
    SettingService.setCurrLocation(locName);
    // insert item to the queue
    if (d != null) {
      const arr = JSON.parse(d) as StringDict[];
      for (let i = 0; i < arr.length; i++) {
        // do not add redundant data
        if (Object.keys(arr[i])[0] == key) {
          return;
        }
      }
      const obj = {} as StringDict;
      obj[key] = locName;
      arr.push(obj);
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(arr));
    } else {
      localStorage.setItem(this.QUEUE_KEY, `[{"${key}":"${locName}"}]`);
    }

    // remove element if queue is full
    d = localStorage.getItem(this.QUEUE_KEY);
    if (d == null) {
      return;
    }
    const arr = JSON.parse(d) as StringDict[];
    if (arr.length <= this.QUEUE_LIMIT) {
      return;
    }
    const elem2remove = arr.shift();
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(arr));
    if (elem2remove != undefined) {
      localStorage.removeItem(Object.keys(elem2remove)[0]);
    }
  }

  static getTimes4CurrentLocation(): string[][] | null {
    const keyOfRecent = SettingService.getDataKey4CurrentLocation();
    if (!keyOfRecent) {
      return null;
    }
    const obj = localStorage.getItem(keyOfRecent);
    if (obj == null) {
      return null;
    }
    return JSON.parse(obj) as string[][];
  }

  static getDataKey4CurrentLocation(): string | null {
    const currLoc = localStorage.getItem(this.CURR_LOC_KEY);
    if (currLoc == null) {
      return null;
    }
    const d = localStorage.getItem(this.QUEUE_KEY);
    if (d == null) {
      return null;
    }
    const arr = JSON.parse(d) as StringDict[];
    const queueKeys: string[] = [];
    for (let i = arr.length - 1; i > -1; i--) {
      if (Object.values(arr[i])[0] == currLoc) {
        queueKeys.push(Object.keys(arr[i])[0]);
      }
    }
    return SettingService.getRecentQueueKey4Location(queueKeys);
  }

  private static getRecentQueueKey4Location(
    timesQueueKeys: string[],
    now = 0
  ): string {
    if (now < 1) {
      now = new Date().getTime();
    }
    let minDiff = now;
    let keyOfMin = "";
    for (const k of timesQueueKeys) {
      const arr = k.split("_");
      const d = Number(arr[arr.length - 1]);
      const currDiff = Math.abs(now - d);
      if (currDiff < minDiff) {
        minDiff = currDiff;
        keyOfMin = k;
      }
    }
    return keyOfMin;
  }
}
