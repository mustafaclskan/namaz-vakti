import { TimesData } from './components/MetaType';

export class ApiClient {
  private _url: string;
  constructor() {
    this._url = 'https://namaz-vakti-api.herokuapp.com/';
    // this._url = 'http://localhost:3000/';
  }

  getCities4Country(countryID: string, cb: (e: any) => void) {
    this.httpGet(this._url + 'cities?country=' + countryID, cb);
  }

  getDistricts4City(countryID: string, cityID: string, cb: (e: any) => void) {
    this.httpGet(this._url + 'regions?city=' + cityID + '&country=' + countryID, cb);
  }

  getTimes4District(districtID: string, cb: (e: TimesData[]) => void) {
    this.httpGet(this._url + 'data?region=' + districtID, cb);
  }

  private httpGet(url: string, cb: (e: any) => void) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        cb(JSON.parse(this.responseText));
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }
}