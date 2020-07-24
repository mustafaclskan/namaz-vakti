import { TimesData } from './components/MetaType';

export class SettingService {
  private static QUEUE_LIMIT = 33;
  private static QUEUE_KEY = 'timesQueue';
  private static THEME_KEY = 'theme';
  private static CURR_LOC_KEY = 'currLoc';
  private static CURR_LANG_KEY = 'currLang';
  private static CUR_ZOOM_KEY = 'currZoom';

  static saveTheme(theme: string) {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  static saveLang(theme: string) {
    localStorage.setItem(this.CURR_LANG_KEY, theme);
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

  static setCurrZoom(v: number) {
    localStorage.setItem(this.CUR_ZOOM_KEY, v + '');
  }

  static setCurrLocation(loc: string) {
    localStorage.setItem(this.CURR_LOC_KEY, loc);
  }

  static getCurrTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  // needs change
  static getSavedLocations(): string[] {
    const locs = localStorage.getItem(this.QUEUE_KEY);
    if (locs) {
      const arr = JSON.parse(locs) as any[];
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
  static getData4SavedLocation(loc: string): TimesData | null {
    const locs = localStorage.getItem(this.QUEUE_KEY);
    if (locs != null) {
      const arr = JSON.parse(locs) as any[];
      for (let i = 0; i < arr.length; i++) {
        if (Object.values(arr[i])[0] == loc) {
          const data = localStorage.getItem(Object.keys(arr[i])[0]);
          if (data != null) {
            return JSON.parse(data) as TimesData;
          }
        }
      }
    }
    return null;
  }

  static addTimesData(key: string, data: any, locName: string) {
    localStorage.setItem(key, JSON.stringify(data));
    let d = localStorage.getItem(this.QUEUE_KEY);
    SettingService.setCurrLocation(locName);
    // insert item to the queue
    if (d != null) {
      const arr = JSON.parse(d) as any[];
      for (let i = 0; i < arr.length; i++) {
        // do not add redundant data
        if (Object.keys(arr[i])[0] == key) {
          return;
        }
      }
      const obj = {} as any;
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
    const arr = JSON.parse(d) as any[];
    if (arr.length <= this.QUEUE_LIMIT) {
      return;
    }
    const elem2remove = arr.shift();
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(arr));
    if (elem2remove != undefined) {
      localStorage.removeItem(Object.keys(elem2remove)[0]);
    }
  }

  static getTimes4CurrentLocation(now = 0): TimesData[] | null {

    const keyOfRecent = SettingService.getDataKey4CurrentLocation();
    if (!keyOfRecent) {
      return null;
    }
    const obj = localStorage.getItem(keyOfRecent);
    if (obj == null) {
      return null;
    }
    return JSON.parse(obj) as TimesData[];
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
    const arr = JSON.parse(d) as any[];
    const queueKeys: string[] = [];
    for (let i = arr.length - 1; i > -1; i--) {
      if (Object.values(arr[i])[0] == currLoc) {
        queueKeys.push(Object.keys(arr[i])[0]);
      }
    }
    return SettingService.getRecentQueueKey4Location(queueKeys);
  }

  private static getRecentQueueKey4Location(timesQueueKeys: string[], now = 0): string {
    if (now < 1) {
      now = new Date().getTime();
    }
    let minDiff = now;
    let keyOfMin = '';
    for (const k of timesQueueKeys) {
      const arr = k.split('_');
      const dateStr = arr[arr.length - 1];
      const d = new Date(+(dateStr.substr(6, 4)), +(dateStr.substr(3, 2)) - 1, +(dateStr.substr(0, 2))).getTime();
      const currDiff = now - d;
      if (currDiff < minDiff) {
        minDiff = currDiff;
        keyOfMin = k;
      }
    }
    return keyOfMin;
  }

}