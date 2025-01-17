import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Observable } from "rxjs";
import {endpoints} from "../constants/end-points";
import {HttpService} from "../shared/http.service";

export interface ILocationResp {
  cityCode:string;
  cityName:string;
  districtCode:string;
  districtName:string;
  wardCode:string;
  wardId:string;
  wardName:string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService{
  private serverUrl = environment.apiBaseUrl + '/location';


  constructor(private http:HttpClient, private httpService: HttpService) {
  }

  public getAllCities():Observable<any> {
    return this.httpService.getNoTokenNew(endpoints.all_city);
  }

  public getAllDistrictsByCityCode(cityCode:String):Observable<any> {
    return this.httpService.getNoTokenNew(`${endpoints.district_by_city}/${cityCode}`);
  }

  public getAllWardsByCityCodeAndDistrictCode(cityCode:String, districtCode:String):Observable<any> {
    return this.httpService.getNoTokenNew(`${endpoints.ward_by_district}/${cityCode}/${districtCode}`);
  }

  public getWardsById(id:number):Observable<any> {
    return this.httpService.getNoTokenNew(`${endpoints.ward_by_district}/${id}`);
  }

  public getLocationByWardId(wardId:string):Observable<ILocationResp>{
    return this.http.get<ILocationResp>(`${this.serverUrl}/get-location/${wardId}`);
  }

}
