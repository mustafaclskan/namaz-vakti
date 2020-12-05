import { StringDict } from './components/MetaType';
import { SettingService } from './SettingService';

export class SubstrTranslator {

  private static _2En: StringDict = {
    "Ocak": "January",
    "Şubat": "February",
    "Mart": "March",
    "Nisan": "April",
    "Mayıs": "May",
    "Haziran": "June",
    "Temmuz": "July",
    "Ağustos": "August",
    "Eylül": "September",
    "Ekim": "October",
    "Kasım": "November",
    "Aralık": "December",
    "Pazartesi": "Monday",
    "Salı": "Tuesday",
    "Çarşamba": "Wednesday",
    "Perşembe": "Thursday",
    "Cumartesi": "Saturday",
    "Cuma": "Friday",
    "Pazar": "Sunday",
    "İmsak": "Fajr",
    "Güneş": "Sunrise",
    "Öğle": "Dhuhr",
    "İkindi": "Asr",
    "Akşam": "Maghrib",
    "Yatsı": "Isha'a"
  };

  public static t(s: string): string {
    const lang = SettingService.getCurrLang();
    if (!lang || lang == 'tr') {
      for (const [k, v] of Object.entries(this._2En)) {
        if (s.includes(v as string)) {
          return s.replace(v as string, k);
        }
      }
    } else {
      for (const [k, v] of Object.entries(this._2En)) {
        if (s.includes(k)) {
          return s.replace(k, v as string);
        }
      }
    }

    return s;
  }

}