import { SettingService } from './SettingService';

export class SubstrTranslator {
  private static _months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  // match longer first
  private static _days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cumartesi', 'Cuma', 'Pazar'];

  private static _prays = ['İmsak', 'Güneş', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'];

  private static _toEn = {
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
  } as any;

  public static translateDayName(s: string): string {
    const lang = SettingService.getCurrLang();
    if (!lang || lang == 'tr') {
      return s;
    }
    for (const d of this._days) {
      if (s.includes(d)) {
        return s.replace(d, this._toEn[d]);
      }
    }
    return s;
  }

  public static translatePrayName(s: string): string {
    const lang = SettingService.getCurrLang();
    if (!lang || lang == 'tr') {
      return s;
    }
    for (const d of this._prays) {
      if (s.includes(d)) {
        return s.replace(d, this._toEn[d]);
      }
    }
    return s;
  }

  public static translateMonthName(s: string): string {
    const lang = SettingService.getCurrLang();
    if (!lang || lang == 'tr') {
      return s;
    }
    for (const d of this._months) {
      if (s.includes(d)) {
        return s.replace(d, this._toEn[d]);
      }
    }
    return s;
  }

}