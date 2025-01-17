import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {endpoints} from "../constants/end-points";
import {HttpService} from "../shared/http.service";

type JsonPrimitive = string | number | boolean | null

interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> {
}

interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> {
}

type Json = JSON;

@Injectable({
  providedIn: 'root'
})
export class SearchcarService {


  private serverUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient, private httpService: HttpService) {
  }

  public search(distance: number, city: string, district: string, ward: string, plus: boolean, lat:number, lng: number, pick: Date, drop: Date, size: number, page: number, sort: string, brand: string, transmission: string, fuel: string, seats: string, fromPrice: any, toPrice: any): Observable<any> {
    var a = (pick.getFullYear()  < 10 ? ('0' + (pick.getFullYear())) : pick.getFullYear()) + '-' + (pick.getUTCMonth() + 1 < 10 ? ('0' + (pick.getUTCMonth() + 1)) : pick.getUTCMonth() + 1) + '-' + (pick.getDate() < 10 ? ('0' + (pick.getDate())) : pick.getDate()) + 'T' + (pick.getHours() < 10 ? ("0" + pick.getHours()) : (pick.getHours())) + ':' +(pick.getMinutes() < 10 ? ("0" + pick.getMinutes()) : (pick.getMinutes())) + ":00";
    var b = (drop.getFullYear()  < 10 ? ('0' + (drop.getFullYear())) : drop.getFullYear()) + '-' + (drop.getUTCMonth() + 1 < 10 ? ('0' + (drop.getUTCMonth() + 1)) : drop.getUTCMonth() + 1) + '-' + (drop.getDate() < 10 ? ('0' + (drop.getDate())) : drop.getDate()) + 'T' + (drop.getHours() < 10 ? ("0" + drop.getHours()) : (drop.getHours())) + ':' +(drop.getMinutes() < 10 ? ("0" + drop.getMinutes()) : (drop.getMinutes())) + ":00";
    console.log("e "  + a + " " + b);
    type Json = JsonPrimitive | JsonMap | JsonArray
    var srt: Array<Json> = [];
    var arr:string[] = sort.split(',');
    for (let i = 0; i < arr.length; i++) {
      if(arr[i] == 'ratings(asc)') {
        var order:Json = {
          "name": "ratings",
          "order": "asc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'ratings(desc)') {
        var order:Json = {
          "name": "ratings",
          "order": "desc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'rides(asc)') {
        var order:Json = {
          "name": "rides",
          "order": "asc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'rides(desc)') {
        var order:Json = {
          "name": "rides",
          "order": "desc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'price(asc)') {
        var order:Json = {
          "name": "price",
          "order": "asc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'price(desc)') {
        var order:Json = {
          "name": "price",
          "order": "desc"
        }
        srt.push(order);
      }

      else if(arr[i] == 'production(asc)') {
        var order:Json = {
          "name": "production",
          "order": "asc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'production(desc)') {
        var order:Json = {
          "name": "production",
          "order": "desc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'distance(asc)') {
        var order:Json = {
          "name": "distance",
          "order": "asc"
        }
        srt.push(order);
      }
      else if(arr[i] == 'distance(desc)') {
        var order:Json = {
          "name": "distance",
          "order": "desc"
        }
        srt.push(order);
      }
    }
    var search: Json = {};
    var brandArr: any = [];
    if(brand != null) {
      brandArr.push(brand);
    }
    else {
      brandArr = null;
    }
    var fromPriceArr: any = [];
    console.log("d " + fromPrice + " " + toPrice);
    if(fromPrice !== null && fromPrice !== 'undefined' && fromPrice != undefined) {
      fromPriceArr.push(fromPrice);
    }
    else {
      fromPriceArr = null;
    }
    var toPriceArr:any = [];
    if(toPrice !== null && toPrice !== 'undefined' && toPrice != undefined) {
      toPriceArr.push(toPrice);
    }
    else {
      toPriceArr = null;
    }
    var transmissionArr:any = [];
    if(transmission != null) {
      transmissionArr.push(transmission);
    }
    else {
      transmissionArr = null;
    }
    var fuelArr:any = [];
    if(fuel != null) {
      fuelArr.push(fuel);
    }
    else {
      fuelArr = null;
    }
    var seatArr:any = [];
    if(seats != null) {
      seatArr.push(seats);
    }
    else {
      seatArr = null;
    }
    if (sort.length > 0) {
      search =
        {
          "pagination": {
            "page": page,
            "size": size
          },
          "filters": [
            {
              "field": "distance",
              "operator": "",
              "value": [
                distance * 1000
              ]
            },
            {
              "field": "city",
              "operator": "",
              "value": [
                city
              ]
            },
            {
              "field": "district",
              "operator": "",
              "value": [
                district
              ]
            },
            {
              "field": "ward",
              "operator": "",
              "value": [
                ward
              ]
            },
            {
              "field": "lat",
              "operator": "",
              "value": [
                lat
              ]
            },
            {
              "field": "lng",
              "operator": "",
              "value": [
                lng
              ]
            },
            {
              "field": "price",
              "operator": "greater",
              "value": fromPriceArr

            },
            {
              "field": "price",
              "operator": "less",
              "value": toPriceArr
            },
            {
              "field": "brand",
              "operator": "",
              "value": brandArr
            },
            {
              "field": "transmission",
              "operator": "",
              "value": transmissionArr
            },
            {
              "field": "fuel",
              "operator": "",
              "value": fuelArr
            },
            {
              "field": "seat",
              "operator": plus ? ("greater") : (""),
              "value": seatArr
            },
            {
              "field": "time",
              "operator": "pick",
              "value": [
                a
              ]
            },
            {
              "field": "time",
              "operator": "drop",
              "value": [
                b
              ]
            }
          ],
          "sort": srt,
          "type": "car"
        };
    } else {

      search =
        {
          "pagination": {
            "page": page,
            "size": size
          },
          "filters": [
            {
              "field": "distance",
              "operator": "",
              "value": [
                distance * 1000
              ]
            },
            {
              "field": "city",
              "operator": "",
              "value": [
                city
              ]
            },
            {
              "field": "district",
              "operator": "",
              "value": [
                district
              ]
            },
            {
              "field": "ward",
              "operator": "",
              "value": [
                ward
              ]
            },
            {
              "field": "lat",
              "operator": "",
              "value": [
                lat
              ]
            },
            {
              "field": "lng",
              "operator": "",
              "value": [
                lng
              ]
            },
            {
              "field": "price",
              "operator": "greater",
              "value": fromPriceArr

            },
            {
              "field": "price",
              "operator": "less",
              "value": toPriceArr
            },
            {
              "field": "brand",
              "operator": "",
              "value": brandArr
            },
            {
              "field": "transmission",
              "operator": "",
              "value": transmissionArr
            },
            {
              "field": "fuel",
              "operator": "",
              "value": fuelArr
            },
            {
              "field": "seat",
              "operator": plus ? ("greater") : (""),
              "value": seatArr
            },
            {
              "field": "time",
              "operator": "pick",
              "value": [
                a
              ]
            },
            {
              "field": "time",
              "operator": "drop",
              "value": [
                b
              ]
            }
          ],
          "sort": null,
          "type": "car"
        }


    }
    return this.httpService.postNoTokenReturnBody(endpoints.search, search);

  }

  public brandModel(): Observable<any> {

    return this.httpService.getNoTokenNew(endpoints.brand);
  }

  public allCarLocation(): Observable<any> {
    return this.httpService.getNoTokenNew(endpoints.all_car);
  }
}
