
export class SettingService {
  static QUEUE_LIMIT = 3;

  static setCSS(theme: string) {
    const file = document.getElementById('theme-link') as HTMLLinkElement;
    file.href = 'css/' + theme + '/theme.css'
  }

  static getLocations(): any[] {
    const locs = localStorage.getItem('locations');
    if (locs) {
      return JSON.parse(locs);
    } else {
      return [];
    }
  }

  static addTimesData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
    const d = localStorage.getItem('timesQueue');
    if (d != null) {
      let size = localStorage.getItem('timesQueueSize') ?? 0;
      size = +size; // convert to number
      if (size > this.QUEUE_LIMIT) {
        const idOfFirst = localStorage.getItem('timesQueueFirst');
        if (idOfFirst != null) {
          localStorage.removeItem(idOfFirst);
        }
      }
    }

  }
}