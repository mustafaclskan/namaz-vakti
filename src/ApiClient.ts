
export class ApiClient {
  private _url: string;
  constructor() {
    this._url = 'https://canbax.herokuapp.com/'
  }

  getCities4Country(countryID: string, cb: (e: any) => void) {
    this.httpGet(this._url + 'sehirler?ulke=' + countryID, cb);
  }

  getDistricts4City(cityID: string, cb: (e: any) => void) {
    this.httpGet(this._url + 'ilceler?sehir=' + cityID, cb);
  }

  getTimes4District(districtID: string, cb: (e: any) => void) {
    this.httpGet(this._url + 'vakitler?ilce=' + districtID, cb);
  }

  private httpGet(url: string, cb: (e: any) => void) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      console.log(xmlhttp.getAllResponseHeaders());
      if (this.readyState == 4 && this.status == 200) {
        cb(JSON.parse(this.responseText));
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }
}