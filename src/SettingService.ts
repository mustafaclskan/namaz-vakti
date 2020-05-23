
export class SettingService {


  static setCSS(theme: string) {
    const file = document.getElementById('theme-link') as HTMLLinkElement;
    file.href = 'css/' + theme + '.css'
  }
}