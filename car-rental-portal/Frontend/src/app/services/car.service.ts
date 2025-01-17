import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarBasic } from '../models/interfaces/carbasic';
import { environment } from '../../environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from '../shared/http.service';
import { CarBasicInfo } from "../models/entities/car-basic.model";
import { FormCarBasic } from "../models/interfaces/form-carbasic";
import { FormCarDetail } from "../models/interfaces/form-cardetail";
import { FormCarPricing } from "../models/interfaces/form-carpricing";
import { FormCarCalendar } from "../models/interfaces/form-carcalendar";
import { ErrorsService } from "./errors.service";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { FeatureService } from "./feature.service";
import { STORAGE_TOKEN } from '../constants/STORAGE-CONSTANT';

export interface Feature {
  featureName: string,
  featureType: string
}

@Injectable({
  providedIn: 'root'
})

export class CarService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private errorService: ErrorsService,
    private authService: AuthService,
    private route: Router,
    private featureService: FeatureService) {
  }

  getAllCars(): Observable<CarBasic[]> {
    return this.http.get<CarBasic[]>(`${environment.apiBaseUrl}/cars/all-cars`);
  }

  getFeautureCars(): Observable<CarBasic[]> {
    return this.http.get<CarBasic[]>(`${environment.apiBaseUrl}/car-basic/feature-cars`);
  }

  getCarCountByCity(): Observable<Map<String, number>> {
    return this.http.get<Map<String, number>>(`${environment.apiBaseUrl}/car-location/car-count-by-city`);
  }

  getCarDetail(id: any) {
    return this.httpService.getNoTokenNew(endpoints.get_car + id);
  }

  getCarById(id: number): Observable<CarBasicInfo> {
    return this.http.get<CarBasicInfo>(`${environment.apiBaseUrl}/car-basic/get/${id}`);
  }


  getCarRelate(id: any, lat: any, lng: any) {
    return this.httpService.getNoTokenNew(endpoints.get_relate_cars + id + "?lat=" + lat + "&lng=" + lng);
  }

  getCarRating(id: any, page: any, size: any) {
    let pgstr: string = (page != null && page != "") ? "?page=" + page : "";
    let sizess: string = (size != null && size != "") ? (pgstr == "" ? ("?size=" + size) : ("&size=" + size)) : "";
    return this.httpService.getNoTokenNew(endpoints.get_car_rating + id + pgstr + sizess);
  }

  checkBusyTime(id: any, pick: any, drop: any) {
    return this.httpService.getNoTokenNew(endpoints.check_busy_time + id + "?pick=" + pick + "&drop=" + drop);
  }

  getAllWaitForApprovalCars(page: number, size: number, license: string) {
    return this.httpService.getWithToken(endpoints.get_all_approval_cars + "?page=" + page + "&size=" + size + "&licensePlate=" + license);
  }

  approveCar(carId: number, insuranceStatus: boolean) {
    return this.httpService.putWithToken(endpoints.approve_car + carId + "?insuranceStatus=" + insuranceStatus);
  }

  declineCar(carId: number, declinedReason: string) {
    return this.httpService.putWithToken(endpoints.decline_car + carId + "?declinedReason=" + declinedReason);
  }

  enableCar(carId: number) {
    return this.httpService.putWithToken(endpoints.enable_car + carId);
  }

  disabledCar(carId: number) {
    return this.httpService.putWithToken(endpoints.disable_car + carId);
  }

  getCarDetailByOwner(sort: string, order: string, status: string, page: number) {
    var url = endpoints.get_car_detail_owner;
    url += ("?page=" + page + "&size=5&");
    sort != "" ? url += ("sort=" + sort + "&") : "";
    order != "" ? url += ("order=" + order + "&") : "";
    status != "" ? url += ("status=" + status + "&") : "";
    if (url.charAt(url.length - 1) == '&') {
      url = url.substring(0, url.length - 1);
    }
    return this.httpService.getWithToken(url);
  }

  public getCarDetailResponseByOwner(id: number): Observable<any> {
    return this.httpService.getWithToken(endpoints.get_response_detail + id);
  }

  public getCarByOwner(
    formCarBasic: FormCarBasic,
    formCarDetail: FormCarDetail,
    formCarPricing: FormCarPricing,
    formCarCalendar: FormCarCalendar,
    id: number
  ) {
    this.getCarDetailResponseByOwner(id).subscribe(
      (response: any) => {

        formCarBasic.licensePlate = response.licensePlate;
        formCarBasic.modelId = response.brandModel.id;
        formCarBasic.brandId = response.brandModel.brandId;
        formCarBasic.yearProduction = response.yearProduction;
        formCarBasic.seat = response.noSeat;
        formCarBasic.transmission = response.transmission;
        formCarBasic.fuel = response.fuel;
        for (let i = 0; i < response.features; i++) {
          if (response.features[i].featureType == 'Function') {
            formCarBasic.function.push(response.features[i].featureName);
          }
        }
        for (let i = 0; i < response.features; i++) {
          if (response.features[i].featureType == 'Term') {
            formCarPricing.termsString.push(response.features[i].featureName);
          }
        }
        formCarDetail.mileage = response.carDetail.mileage;
        formCarBasic.consumption = response.carDetail.fuelConsumption;
        formCarBasic.description = response.carDetail.description;
        formCarPricing.basePrice = response.carPricing.basePrice;
        formCarPricing.deposit = response.carPricing.deposit;
      }
    )
  }

  addCar(formCarBasic: FormCarBasic,
    formCarDetail: FormCarDetail,
    formCarPricing: FormCarPricing,
    formCarCalendar: FormCarCalendar, message: string) {
    var form: FormData = new FormData();
    var features: Feature[] = [];
    if (formCarBasic.carId != undefined) {
      form.append("id", formCarBasic.carId.toString());
    }
    form.append("licensePlate", formCarBasic.licensePlate);
    form.append("brandModelId", formCarBasic.modelId.toString());
    form.append("yearProduction", formCarBasic.yearProduction.toString());
    form.append("noSeat", formCarBasic.seat.toString());
    form.append("transmission", formCarBasic.transmission.toUpperCase());
    form.append("fuel", formCarBasic.fuel.toUpperCase());
    if (formCarDetail.registrationImgFile != '')
      form.append("registrationImageFile", formCarDetail.registrationImgFile);
    if (formCarDetail.inspectionImgFile != '')
      form.append("inspectionImageFile", formCarDetail.inspectionImgFile);
    if (formCarDetail.insuranceImgFile != undefined && formCarDetail.insuranceImgFile != '') {
      form.append("insuranceImageFile", formCarDetail.insuranceImgFile);
    }
    for (let i = 0; i < formCarBasic.function.length; i++) {
      var feature: Feature = {
        featureName: formCarBasic.function[i],
        featureType: 'Function'
      }
      features.push(feature);
    }
    for (let i = 0; i < formCarPricing.termsString.length; i++) {
      var feature: Feature = {
        featureName: formCarPricing.termsString[i],
        featureType: 'Term'
      }
      features.push(feature);
    }
    if (features.length > 0)
      form.append("features", JSON.stringify(features));
    form.append("start", formCarCalendar.startRent);
    form.append("end", formCarCalendar.endRent);
    form.append("autoCancelHoursAfterPending", formCarDetail.timeCancelPending.toString());
    form.append("autoCancelHoursAfterConfirmation", formCarDetail.timeCancelPendingDeposit.toString());
    form.append("mileage", formCarDetail.mileage.toString());
    form.append("fuelConsumption", formCarBasic.consumption.toString());
    if (formCarBasic.description != null && formCarBasic.description.trim() != '') {
      form.append("description", formCarBasic.description);
    }
    if (formCarDetail.frontImgFile != '')
      form.append("frontImageFile", formCarDetail.frontImgFile);

    if (formCarDetail.backImgFile != '')
      form.append("backImageFile", formCarDetail.backImgFile);

    if (formCarDetail.leftImgFile != '')
      form.append("leftImageFile", formCarDetail.leftImgFile);

    if (formCarDetail.rightImgFile != '')
      form.append("rightImageFile", formCarDetail.rightImgFile);
    form.append("basePrice", formCarPricing.basePrice.toString());
    form.append("requiredDeposit", formCarPricing.deposit.toString())
    form.append("basePriceMethod", "NOT_BONUS_HALF_DAY");
    form.append(`carLocations`, JSON.stringify(formCarDetail.location));
    if (formCarCalendar.carBusys.length > 0)
      form.append(`carBusyCalendars`, JSON.stringify(formCarCalendar.carBusys));
    const url = environment.apiBaseUrl + `/car-basic/add`;
    console.log(url);
    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY)}`)
      .set('Accept', '*/*')
    this.http
      .post(url, form, { headers: headers })
      .subscribe({
        next: () => {
          this.errorService.showSwalToastMessage('success', message, 'top-right', 2000);
          this.route.navigate(['/my-car']);
        },
        error: (error) => {
          if (error.status == 401) {
            this.authService.logout(true, 'Phien dang nhap het han');
          } else if (error.status == 403) {
            this.route.navigate(['/403']);
          } else {
            this.errorService.showSwalToastMessage('error', error.error.errorDetails, 'top-right', 2000);
          }
        },
      });
  }
}
