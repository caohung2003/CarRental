import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {BookingBasicInfo} from '../models/entities/booking.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {displayErrorMessage} from '../shared/messages/errorsMessage';
import {formatDate} from '@angular/common';
import {displaySuccessMessage} from '../shared/messages/successMessage';
import {loading} from '../shared/messages/dialogMessage';
import {BehaviorSubject, Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {HttpService} from "../shared/http.service";
import {Router} from "@angular/router";
import {bookingEndPoints} from '../components/booking/create-booking/store/booking.endpoints';
import {bookingDetailsEnpoints} from "../components/booking/booking-details/store/booking-details.enpoints";
import {endpoints} from "../constants/end-points";
import { STORAGE_TOKEN } from '../constants/STORAGE-CONSTANT';

export interface IBookingRequest {
  id: number | null;
  carId: number;
  renterInfo: BookingBasicInfo;
  driverInfo: BookingBasicInfo;
  pickUpDateTime: Date;
  returnDateTime: Date;
  pickUpWardId: string;
  pickUpStreet: string;
}

export interface IBookingRespBasic {
  id: number;
  userId: number;
  carId: number;
  pickUpDateTime: Date;
  returnDateTime: Date;
  basePrice: number;
  deposit: number;
  total: number;
  status: string;
  createdAt: Date;
  numberOfDays: number;
  message: string;
  paymentType: string;
}

export interface IBookingResp {
  id: number;
  userId?: number;
  carId: number;
  renterFirstName: string;
  renterLastName: string;
  renterEmail: string;
  renterPhone: string;
  renterDob: Date;
  renterNationalId: string;
  renterDriverLicenseImageUrl: string;
  renterMessage: string;
  renterWardId:number;
  renterLocation:string;
  numberOfDays:number;
  paymentType:string;
  driverFirstName: string;
  driverLastName: string;
  driverEmail: string;
  driverPhone: string;
  driverDob: Date;
  driverWardId:number;
  driverLocation:string;
  carOwnerMessage:string;
  pickUpDateTime: Date;
  returnDateTime: Date;
  pickUpWardId: number;
  driverNationalId: string;
  driverLicenseImageImageUrl: string;
  pickUpLocation: string;
  basePrice: number;
  deposit: number;
  total: number;
  status: string;
  createdAt: Date;
  message: string;
}

export interface IEditBookingReq {
  id: number;
  carId: number;
  renterFirstName: string;
  renterLastName: string;
  renterDob: Date;
  renterEmail: string;
  renterPhone: string;
  renterWardId: number;
  renterLocation: string;
  renterNationalId: string;
  renterDriverLicense: FormData;
  driverFirstName: string;
  driverLastName: string;
  driverDob: Date;
  driverEmail: string;
  driverPhone: string;
  driverWardId: number;
  driverLocation: string;
  driverNationalId: string;
  driverDriverLicense: FormData;
  pickUpDateTime: Date;
  returnDateTime: Date;
  pickUpWardId: number;
  pickUpLocation: string;
}

@Injectable({ providedIn: 'root' })

export class BookingService {
  private bookingRespSubject = new BehaviorSubject<any>(null);
  bookingResp$ = this.bookingRespSubject.asObservable();
    private bookingIdSubject = new BehaviorSubject<string>('');
    bookingId$ = this.bookingIdSubject.asObservable();

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    @Inject(LOCALE_ID) private locale: string,
    private route:Router
  ) {}
    setBookingId(bookingId: string) {
        this.bookingIdSubject.next(bookingId);
    }

  setBookingResp(resp: any) {
    this.bookingRespSubject.next(resp);
  }

  changeStep(step: number) {
  //  this.stepSubject.next(step);
  }

  createBooking(bookingRequest: IBookingRequest): any {
    let form = new FormData();
    //no id
    //car id
    form.append('carId', bookingRequest.carId.toString());
    //renter------------------------------------------------------------------
    //firstName
    form.append('renterFirstName', bookingRequest.renterInfo.firstName);
    //lastName
    form.append('renterLastName', bookingRequest.renterInfo.lastName);
    //dob
    // form.append(
    //   'renterDob',
    //   `${bookingRequest.renterInfo.dob.getFullYear()}-${
    //     bookingRequest.renterInfo.dob.getMonth() + 1
    //   }-${bookingRequest.renterInfo.dob.getDay()}`
    // );
    form.append(
      'renterDob',
      formatDate(
        bookingRequest.renterInfo.dob,
        'yyyy-MM-dd',
        this.locale
      ).toString()
    );
    //email
    form.append('renterEmail', bookingRequest.renterInfo.email);
    //phone
    form.append('renterPhone', bookingRequest.renterInfo.phoneNumber);
    //ward Id
    form.append('renterWardId', bookingRequest.renterInfo.ward);
    //renter Location
    form.append('renterLocation', bookingRequest.renterInfo.street);
    //nationalId
    form.append('renterNationalId', bookingRequest.renterInfo.nationalId);
    //renter Driver License
    for (let [
      key,
      value,
    ] of bookingRequest.renterInfo.drivingLicense.entries()) {
      form.append('renterDriverLicense', value);
    }
    //driver-------------------------------------------------------------------
    //firstName
    form.append('driverFirstName', bookingRequest.driverInfo.firstName);
    //lastName
    form.append('driverLastName', bookingRequest.driverInfo.lastName);
    //dob
    // form.append(
    //   'driverDob',
    //   `${bookingRequest.driverInfo.dob.getFullYear()}-${
    //     bookingRequest.driverInfo.dob.getMonth() + 1
    //   }-${bookingRequest.driverInfo.dob.getDay()}`
    // );
    form.append(
      'driverDob',
      formatDate(
        bookingRequest.driverInfo.dob,
        'yyyy-MM-dd',
        this.locale
      ).toString()
    );
    //email
    form.append('driverEmail', bookingRequest.driverInfo.email);
    //phone
    form.append('driverPhone', bookingRequest.driverInfo.phoneNumber);
    //ward Id
    form.append('driverWardId', bookingRequest.renterInfo.ward);
    //location
    form.append('driverLocation', bookingRequest.renterInfo.street);
    //nationalId
    form.append('driverNationalId', bookingRequest.driverInfo.nationalId);
    //driverLicense
    for (let [
      key,
      value,
    ] of bookingRequest.driverInfo.drivingLicense.entries()) {
      form.append('driverDriverLicense', value);
    }
    //pickupDate
    form.append(
      'pickUpDateTime',
      bookingRequest.pickUpDateTime.toISOString().substring(0, 19)
    );
    // form.append('pickUpDateTime', formatDate(bookingRequest.pickUpDateTime, 'yyyy-MM-ddTHH:mm:ss', this.locale))
    //returnDateTime
    form.append(
      'returnDateTime',
      bookingRequest.returnDateTime.toISOString().substring(0, 19)
    );
    //pickupWardId
    form.append('pickUpWardId', bookingRequest.pickUpWardId);
    //pickupLocation
    form.append('pickUpLocation', bookingRequest.pickUpStreet);

    const url = `${bookingEndPoints.baseURL}${bookingEndPoints.createBooking}`;
    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY)}`)
      // .set(
      //   'Content-Type',
      //   'multipart/form-data'
      // )
      .set('Accept', '*/*');
    // .set('Content-Type', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data; boundary=<calculated when request is sent>');
    loading();
    this.http
      .post<IBookingRespBasic>(url, form, { headers: headers })
      .subscribe({
        next: (output: IBookingRespBasic) => {
          Swal.close();
          // localStorage.setItem('createBookingResp', JSON.stringify(output));
          this.setBookingResp(output);
          displaySuccessMessage('New booking created successfully!');
          this.route.navigate(['/booking/finish']);
        },
        error: (error) => {
          // console.log(error);
          Swal.close();
          displayErrorMessage(error.error.errorDetails);
          setTimeout(() =>
          window.location.reload(),3000
          );
        },
      });
  }

  getBookingById(id: number): Observable<IBookingResp> {
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY),
    });
    const url = `${bookingDetailsEnpoints.baseURL}${bookingDetailsEnpoints.getBookingById}/${id}`;
    return this.http.get<IBookingResp>(url, { headers: headers });
  }

  convertStringToDate(dateString: string): Date {
    const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
    const match = regex.exec(dateString);
    if (!match) {
      displayErrorMessage('An error occurred!');
      return new Date();
    }

    const [, year, month, day, hours, minutes, seconds] = match;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );

    if (isNaN(date.getTime())) {
      displayErrorMessage('An error occurred!');
      return new Date();
    }

        return date;
    }

    getNumberOfPendingRequest(carId?: number) {
        var url: string = endpoints.get_number_pending_request;
        carId != null ? url += ("?carId=" + carId) : "";
        return this.httpService.getWithToken(url);
    }

    getNumberOfInprogressRequest(carId: number) {
        var url: string = endpoints.get_number_inprogress_request + "?carId=" + carId;
        return this.httpService.getWithToken(url);
    }

    getOverlapBookingPending(start: string, end: string) {
    return this.httpService.getWithToken(endpoints.get_overlap_booking_pending + "?start=" + start + "&end=" + end);
    }

    getUserBooking(status: string[], carId: string[], paymentType: string[], sort: any[], page: number) {
        var search =
            {
                "pagination": {
                    "page": page,
                    "size": 6
                },
                "filters": [
                    {
                        "field": "status",
                        "operator": "",
                        "value": status
                    },
                    {
                        "field": "car",
                        "operator": "",
                        value: carId
                    },
                    {
                        "field": "payment",
                        "operator": "",
                        value: paymentType
                    }
                ],
                "sort": sort,
                "type": "booking"
            }
            console.log(search);
        return this.httpService.postWithToken(endpoints.get_user_booking, search);
    }


    public confirmPickUp(bookingId: number) {
      return this.httpService.put(endpoints.confirm_pick_up + bookingId, '');
    }

    public confirmBooking(bookingId: number, decision: string) {
      return this.httpService.put(endpoints.confirm_booking + bookingId + "?decision=" + decision, '');
    }

    public confirmReturn(bookingId: number) {
      return this.httpService.put(endpoints.confirm_return + bookingId, '');
    }


  editBooking(bookingRequest: IEditBookingReq): any {
    const url = `${bookingEndPoints.baseURL}${bookingEndPoints.editBooking}`;
    let body: FormData = new FormData();
    //renter info
    body.append('id', bookingRequest.id.toString());
    body.append('carId', bookingRequest.carId.toString());
    body.append('renterFirstName', bookingRequest.renterFirstName);
    body.append('renterLastName', bookingRequest.renterLastName);
    body.append(
      'renterDob',
      formatDate(bookingRequest.renterDob, 'yyyy-MM-dd', this.locale).toString()
    );
    body.append('renterEmail', bookingRequest.renterEmail);
    body.append('renterPhone', bookingRequest.renterPhone);
    body.append('renterWardId', bookingRequest.renterWardId.toString());
    body.append('renterLocation', bookingRequest.renterLocation);
    body.append('renterNationalId', bookingRequest.renterNationalId);

    for (let [key, value] of bookingRequest.renterDriverLicense.entries()) {
      body.append('renterDriverLicense', value);
    }

    //driverInfo
    body.append('driverFirstName', bookingRequest.driverFirstName);
    body.append('driverLastName', bookingRequest.driverLastName);
    body.append(
      'driverDob',
      formatDate(bookingRequest.driverDob, 'yyyy-MM-dd', this.locale).toString()
    );
    body.append('driverEmail', bookingRequest.driverEmail);
    body.append('driverPhone', bookingRequest.driverPhone);
    body.append('driverWardId', bookingRequest.driverWardId.toString());
    body.append('driverLocation', bookingRequest.driverLocation);
    body.append('driverNationalId', bookingRequest.driverNationalId);

    for (let [key, value] of bookingRequest.driverDriverLicense.entries()) {
      body.append('driverDriverLicense', value);
    }

    body.append(
      'pickUpDateTime',
      formatDate(
        bookingRequest.pickUpDateTime,
        'yyyy-MM-ddTHH:mm:ss',
        this.locale
      ).toString()
    );
    body.append(
      'returnDateTime',
      formatDate(
        bookingRequest.returnDateTime,
        'yyyy-MM-ddTHH:mm:ss',
        this.locale
      ).toString()
    );
    body.append('pickUpWardId', bookingRequest.pickUpWardId.toString());
    body.append('pickUpLocation', bookingRequest.pickUpLocation);

    let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY)}`)
      .set('Accept', '*/*');

    return this.http.put<any>(url, body, { headers: headers });
  }

  public getOverlappBookings(bookingId: number, status: string) {
    return this.httpService.getWithToken(endpoints.get_overlap_booking + bookingId + "?status=" + status);
  }

  getDepositInfo(booking_id: any){
    return this.httpService.getWithToken(endpoints.payment_deposit + booking_id);
  }

  getPaymentInfo(booking_id: any){
    return this.httpService.getWithToken(endpoints.payment_payment + booking_id);
  }

  getBookingByIdP(booking_id: any) {
    return this.httpService.getWithToken(endpoints.get_booking_info + booking_id);
  }

  pay_deposit(booking_id: any, method: any){
    return this.httpService.put(endpoints.confirm_pay_deposit + booking_id + "/" + method, null);
  }

  payment(booking_id: any, method: any){
    return this.httpService.put(endpoints.confirm_pay_payment + booking_id + "/" + method, null);
  }
}
