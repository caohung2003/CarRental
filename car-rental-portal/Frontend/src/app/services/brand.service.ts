import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../shared/http.service";
import {endpoints} from "../constants/end-points";

@Injectable({
  providedIn: 'root',
})

export class BrandService {
  constructor(private http:HttpClient, private httpService: HttpService) {
  }

  public getAllBrandName() {
    return this.httpService.getNoTokenNew(endpoints.brand);
  }

  public getAllBrandModelBasedOnBrandId(brandId: number) {
    return this.httpService.getNoTokenNew(endpoints.brand_model + brandId);
  }
}
