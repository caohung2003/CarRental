import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MapService{
  private serverUrl = 'https://revgeocode.search.hereapi.com/v1/revgeocode'
  private geoApiKey:string = '2c1fda95ba3048abaad13c2a5f0e77b6';
  private headers = new HttpHeaders().set('apikey', 'mtvsNnj2xt_6mkIo2Loi9ulS8UW9t1lX_tiiDaYgNFw');

  constructor(private http:HttpClient) {
  }

  public getLocationByLatAndLng(lat:number, lng:number) {

    //const params = new HttpParams().set('apiKey', 'BaXsJAOd9g0nBq1UFsCTvMhJuEsMHPt4DFVsfZ-4ykI');
     //const params = new HttpParams().set('apiKey', 'qYdAfo_wypNjKOteJdB0LzFBh-3oKBwiLoKuZLPYzz0');
     const params = new HttpParams().set('apiKey', 'mtvsNnj2xt_6mkIo2Loi9ulS8UW9t1lX_tiiDaYgNFw');

    return this.http.get<any>(`${this.serverUrl}?at=${lat},${lng}`, {params});
  }

  public autocomplete(text:string) {
    return this.http.get<any>(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${this.geoApiKey}`);
  }


}
