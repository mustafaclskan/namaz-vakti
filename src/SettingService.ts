import { TimesData } from './components/MetaType';

export class SettingService {
  private static QUEUE_LIMIT = 3;
  private static QUEUE_KEY = 'timesQueue';
  private static THEME_KEY = 'theme';
  private static CURR_LOC_KEY = 'currLoc';
  private static LOCATIONS_KEY = 'locations';

  static setTheme(theme: string) {
    const file = document.getElementById('theme-link') as HTMLLinkElement;
    file.href = `https://primefaces.org/primevue/showcase/themes/${theme}/theme.css`
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

  static getSavedLocations(): string[] {
    const locs = localStorage.getItem(this.LOCATIONS_KEY);
    if (locs) {
      return locs.split(',');
    } else {
      return [];
    }
  }

  static getData4SavedLocation(loc: string): TimesData | null {
    const locs = localStorage.getItem(this.LOCATIONS_KEY);
    let idx = -1;
    if (locs != null) {
      const arr = locs.split(',');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == loc) {
          idx = i;
          break;
        }
      }
    }
    const ids = localStorage.getItem(this.QUEUE_KEY);
    if (idx > -1 && ids != null) {
      const arr2 = ids.split(',');
      const data = localStorage.getItem(arr2[idx]);
      if (data != null) {
        return JSON.parse(data) as TimesData;
      }
    }
    return null;
  }

  static addLocation(loc: string): void {
    let locs = localStorage.getItem(this.LOCATIONS_KEY);
    SettingService.setCurrLocation(loc);
    // set locations
    if (locs) {
      const arr = locs.split(',');
      for (let i = 0; i < arr.length; i++) {
        // do not add existing location
        if (arr[i] == loc) {
          return;
        }
      }
      localStorage.setItem(this.LOCATIONS_KEY, locs + ',' + loc);
    } else {
      localStorage.setItem(this.LOCATIONS_KEY, loc);
    }

    locs = localStorage.getItem(this.LOCATIONS_KEY);
    // check the queue size
    if (locs) {
      const arr = locs.split(',');
      if (arr.length > this.QUEUE_LIMIT) {
        arr.shift();
        localStorage.setItem(this.LOCATIONS_KEY, arr.join(','));
      }
    }
  }

  static addTimesData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
    let d = localStorage.getItem(this.QUEUE_KEY);
    // update queue of items
    if (d != null) {
      const arr = d.split(',');
      arr.push(key);
      localStorage.setItem(this.QUEUE_KEY, arr.join(','));
    } else {
      localStorage.setItem(this.QUEUE_KEY, key);
    }

    d = localStorage.getItem(this.QUEUE_KEY);
    if (d != null) {
      const arr = d.split(',');
      if (arr.length > this.QUEUE_LIMIT) {
        const elem2remove = arr.shift();
        localStorage.setItem(this.QUEUE_KEY, arr.join(','));
        if (elem2remove != undefined) {
          localStorage.removeItem(elem2remove);
        }
      }
    }
  }


}