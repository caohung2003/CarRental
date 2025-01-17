import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { STORAGE_TOKEN } from '../../../constants/STORAGE-CONSTANT';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private baseUrl = environment.apiBaseUrl;
    private listAllow = [
        // "/auth/register",
        // "/auth/activate",
        // "/auth/authenticate",
        // "/auth/remember",
        // "/auth/logout",
        // "/auth/refresh-token",
        // "/test",
        // "/user/car-owner-profile/",
        // "/rating/get-renter/by/user/",
        // "/car-location/get/owner-car/",
        // "/car-location/search",
        // "/car-location/get/all",
        // "/brand/brand-name/all",
        // "/brand/brand-model/",
        // "/location/cities/all",
        // "/location/districts",
        // "/location/wards",
        // "/car-basic/get/",
        // "/car-location/get/related-car/",
        // "/rating/get-renter/by/car/",
        // "/car-busy/check/time-rent/",
        // "/car-basic/get/detail-response/",
        // "/feature/get/by/feature-type",
        // "/feature/get/by/feature-name",
        "/car-basic/feature-cars/",
        "/car-basic/get/",
        "/car-busy/check/time-rent/",
        "/auth/",
        "/image/",
        "/register/",
        "/location/",
        "/brand/",
        //"/feature/",
        "/car-location/",
        "/rating/get-renter/",
        "/rating/get-owner/",
        "/rating/get/all/by/",
        "/user/profile/",
    ]

    constructor(
        private authService: AuthService,
        private storageService: StorageService,
        private router: Router,
    ) { }

    private isUrlAllowed(url: string): boolean {
        if (!url.startsWith(environment.apiBaseUrl)) return true;
        let urlx = url.split(this.baseUrl)[1];
        return this.listAllow.some(allowedPath => urlx.includes(allowedPath));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isUrlAllowed(request.url)) {
            console.log('IN', request.url);
            const token = this.storageService.get(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);
            if (token) {
                request = this.addToken(request, token);
            }
            return next.handle(request).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 && error.error.errorMessage === 'Invalid token') {
                        return this.handleError(request, next);
                    } else {
                        return throwError(() => error);
                    }
                })
            );
        } else {
            // If the request URL doesn't match the specific endpoint, simply pass the original request
            return next.handle(request);
        }
    }


    private addToken(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handleError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Handling');
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.getNewToken().pipe(
                switchMap(() => {
                    this.isRefreshing = false;
                    const newAccessToken = localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);
                    this.refreshTokenSubject.next(newAccessToken);
                    return next.handle(this.addToken(request, newAccessToken));
                }),
                catchError((error) => {
                    this.isRefreshing = false;
                    if (this.router.url == '/home'
                        || this.router.url.startsWith('/login')
                        || this.router.url.startsWith('/car/detail/')
                        || this.router.url.startsWith('/profile/')
                        || this.router.url == '/search'
                    ) {
                        this.authService.logout(false);
                    } else {
                        this.authService.logout(true, undefined, this.router.url.substring(1));
                    }

                    return throwError(() => error);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                })
            );
        } else {
            // If refreshing is already in progress, wait for the new token
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(request, token));
                })
            );
        }
    }

}
