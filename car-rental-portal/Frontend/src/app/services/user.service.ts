import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from '../shared/http.service';
import { User } from "../models/entities/user.model";
import { formatDate } from '@angular/common';
import { STORAGE_TOKEN } from '../constants/STORAGE-CONSTANT';

export interface IEditProfileReq {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    dob: Date,
    phone: string,
    avatar: FormData,
    role: string,
    rating: number,
    noBooking: number,
    nationalId: string,
    address: string,
    wardId: number,
    driverLicenseImage: FormData,
}

@Injectable({
    providedIn: 'root',
})

export class UserService {
    private userId = new BehaviorSubject<string>('');
    userId$ = this.userId.asObservable();

    constructor(
        private http: HttpClient,
        private readonly httpService: HttpService,
        @Inject(LOCALE_ID) private locale: string,
    ) { }

    gerUserInfo_basic(id: any): Observable<any> {
        return this.httpService.getNoTokenNew(endpoints.get_user_basic + id);
    }

    getUserInfo(accessToken: string): Observable<User> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers.set('Authorization', `Bearer ${accessToken}`)
        const url = `${environment.apiBaseUrl}/user`
        return this.http.get<User>(url, { headers: headers });
    }

    getUserRating(id: any, size?: number, page?: number) {
        return this.httpService.getNoTokenNew(endpoints.get_user_rating + id + '?page=' + page + '&size=' + size);
    }

    getOwnerRating(id: any, size?: number, page?: number) {
        return this.httpService.getNoTokenNew(endpoints.get_owner_rating + id + '?page=' + page + '&size=' + size);
    }

    getCarOwner(id: any) {
        return this.httpService.getNoTokenNew(endpoints.get_car_owner + id);
    }

    getBookingList(status: string, sortBy?: string, page?: number, size?: number, sortOrder?: string) {
        let sortByStr: string = sortBy != null ? '&sortBy=' + sortBy : '';
        let pageStr: string = page != null ? '&page=' + page : '';
        let sizeStr: string = size != null ? '&size=' + size : '';
        let sortOrderStr: string = sortOrder != null ? '&sortOrder=' + sortOrder : '';

        return this.httpService.getWithToken(endpoints.get_booking_list + '?statuses=' + status + sortByStr + pageStr + sizeStr + sortOrderStr);
    }

    cancelBooking(id: any) {
        return this.httpService.put(endpoints.cancel_booking + id, null);
    }

    getUserInfoX(): Observable<any> {
        return this.httpService.getWithToken(endpoints.get_user);
    }

    getUserRequest() {
        return this.httpService.getWithToken(endpoints.get_number_pending_request);
    }

    editProfile(profileReq: IEditProfileReq): any {
        const url = `${environment.apiBaseUrl}${endpoints.edit_profile}`;
        let body: FormData = new FormData();

        body.append('id', profileReq.id.toString());
        body.append('firstName', profileReq.firstName);
        body.append('lastName', profileReq.lastName);
        body.append('dob', formatDate(profileReq.dob, 'yyyy-MM-dd', this.locale).toString());
        body.append('email', profileReq.email);
        body.append('phone', profileReq.phone);
        body.append('noBooking', profileReq.noBooking.toString());
        body.append('rating', profileReq.rating.toString());
        body.append('role', profileReq.role);
        for (let [key, value] of profileReq.avatar.entries()) {
            body.append('avatarImage', value);
        }
        body.append('nationalId', profileReq.nationalId),
            body.append('address', profileReq.address);
        body.append('wardId', profileReq.wardId.toString());
        for (let [key, value] of profileReq.driverLicenseImage.entries()) {
            body.append('driverLicenseImage', value);
        }

        let headers = new HttpHeaders()
            .set('Authorization', `Bearer ${localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY)}`)
            .set('Accept', '*/*');

        return this.http.put<any>(url, body, { headers: headers });
    }

}
