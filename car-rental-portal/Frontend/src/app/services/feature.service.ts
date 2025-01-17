import {Injectable} from "@angular/core";
import {HttpService} from "../shared/http.service";
import {endpoints} from "../constants/end-points";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })

export class FeatureService {
  constructor(private httpService: HttpService) {
  }

  getAllFeatureByFeatureType(type: string): Observable<any> {
    return this.httpService.getWithToken(endpoints.get_feature_by_type + "?type=" + type);
  }

  getAllFeatureByFeatureName(name: string): Observable<any> {
    return this.httpService.getWithToken(endpoints.get_feature_by_name + "?name=" + name);
  }
}
