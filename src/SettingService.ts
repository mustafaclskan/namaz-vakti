
export class SettingService {

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
}