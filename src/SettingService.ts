import { TimesData } from './components/MetaType';

export class SettingService {
  private static QUEUE_LIMIT = 3;
  private static QUEUE_KEY = 'timesQueue';
  private static THEME_KEY = 'theme';
  private static CURR_LOC_KEY = 'currLoc';

  static setInitialTheme() {
    const t = SettingService.getCurrTheme();
    if (t) {
      SettingService.setTheme(t);
    }
  }

  static setTheme(theme: string) {
    const file = document.getElementById('theme-link') as HTMLLinkElement;
    file.href = `https://primefaces.org/primevue/showcase/themes/${theme}/theme.css`;
    localStorage.setItem(this.THEME_KEY, theme);
  }

  static getCurrLocation(): string | null {
    return localStorage.getItem(this.CURR_LOC_KEY)
  }

  static setCurrLocation(loc: string) {
    localStorage.setItem(this.CURR_LOC_KEY, loc)
  }

  static getCurrTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY)
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

  static getTimes4CurrentLocation(): TimesData | null {
    const currLoc = localStorage.getItem(this.CURR_LOC_KEY);
    if (currLoc == null) {
      return null;
    }
    const d = localStorage.getItem(this.QUEUE_KEY);
    if (d == null) {
      return null;
    }
    const arr = JSON.parse(d) as any[];
    for (let i = arr.length - 1; i > -1; i--) {
      if (Object.values(arr[i])[0] == currLoc) {
        const obj = localStorage.getItem(Object.keys(arr[i])[0])
        if (obj == null) {
          return null;
        }
        return JSON.parse(obj) as TimesData;
      }
    }
    return null;
  }

}