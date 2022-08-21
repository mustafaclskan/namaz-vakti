import { SettingService } from "./SettingService";

export function month2Turkish(m: number): string {
  switch (m) {
    case 0:
      return "Ocak";
    case 1:
      return "Şubat";
    case 2:
      return "Mart";
    case 3:
      return "Nisan";
    case 4:
      return "Mayıs";
    case 5:
      return "Haziran";
    case 6:
      return "Temmuz";
    case 7:
      return "Ağustos";
    case 8:
      return "Eylül";
    case 9:
      return "Ekim";
    case 10:
      return "Kasım";
    case 11:
      return "Aralık";
  }
  return "NO MONTH";
}

export function turkishMonth2Idx(s: string): number {
  s = s.toLowerCase();
  switch (s) {
    case "ocak":
      return 0;
    case "şubat":
      return 1;
    case "mart":
      return 2;
    case "nisan":
      return 3;
    case "mayıs":
      return 4;
    case "haziran":
      return 5;
    case "temmuz":
      return 6;
    case "ağustos":
      return 7;
    case "eylül":
      return 8;
    case "ekim":
      return 9;
    case "kasım":
      return 10;
    case "aralık":
      return 11;
  }
  return -1;
}

// '05 Aralık 2020 Cumartesi' => unix timestamp
export function turkishDateStr2Date(s: string): number {
  const arr = s.split(" ");
  const day = Number(arr[0]);
  const month = turkishMonth2Idx(arr[1]);
  const year = Number(arr[2]);
  return new Date(year, month, day).getTime();
}

// seconds to human readable string
export function seconds2str(i: number, hourStr: string, minStr: string, secStr: string): string {
  const pref = SettingService.getCurrTimeFmt();
  let s = "";
  const h = Math.floor(i / 3600);
  if (h > 0) {
    if (h < 10 && pref < 2) {
      s += "0" + h;
    } else {
      s += h;
    }
    if (pref < 2) {
      s += ":";
    } else {
      s += " " + hourStr + " ";
    }

  }
  const m = Math.floor((i - 3600 * h) / 60);
  if (m < 10 && pref < 2) {
    s += "0" + m;
  } else {
    s += m;
  }
  if (pref === 0) {
    s += ":";
  } else if (pref > 1) {
    s += " " + minStr + " ";
  }
  if (pref === 1 || pref === 3) {
    return s;
  }
  const sec = i - 3600 * h - 60 * m;
  if (sec < 10 && pref < 2) {
    s += "0" + sec;
  } else {
    s += sec;
  }
  if (pref === 2) {
    s += " " + secStr;
  }
  return s;
}

// from date to string '03 Aralık 2020'
export function date2TurkishStr(d: Date | null = null): string {
  if (!d) {
    d = new Date();
  }
  const month = month2Turkish(d.getMonth());
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (day.length < 2) {
    day = "0" + day;
  }

  return [day, month, year].join(" ");
}

// from a string with format 22:21, return total number of seconds
export function strTime2TotalSec(s: string): number {
  return 3600 * +s.slice(0, 2) + 60 * +s.slice(3, 5);
}

export function decodeHTML(str: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

/** zero hour, minute, second and ms
 * @param  {Date} d
 */
export function clearHours(d: Date): Date {
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

export function gre2str(d: Date, monthStr: string, weekdayStr: string, weekdayShortStr: string): string {
  const monthFmt = SettingService.getCurrMonthFormat();
  const yearFmt = SettingService.getCurrYearFormat();
  const wdFmt = SettingService.getCurrWeekdayFormat();
  if (monthFmt === "MMM") {
    monthStr = monthStr.substr(0, 3);
  } else if (monthFmt === "MM") {
    monthStr = d.getMonth() + "";
  }
  let y = d.getFullYear() + " ";
  if (yearFmt === "YY") {
    y = y.substr(0, 2);
  } else if (yearFmt === "-") {
    y = "";
  }
  if (wdFmt === "DDD") {
    weekdayStr = weekdayShortStr;
  } else if (wdFmt === "-") {
    weekdayStr = "";
  }
  return d.getDate() + " " + monthStr + " " + y + " " + weekdayStr;
}