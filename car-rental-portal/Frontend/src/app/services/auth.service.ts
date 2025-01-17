import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  Observable,
  Subscription,
  catchError,
  map,
  of,
  pipe,
  switchMap,
  take,
} from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { displaySuccessMessage } from '../shared/messages/successMessage';
import { displayErrorMessage } from '../shared/messages/errorsMessage';
import { ErrorDTO } from '../models/interfaces/errors.interface';
import { ILocalStorage } from '../models/interfaces/storage.interface';
import { environment } from '../../environments/environment';
import { HttpService } from '../shared/http.service';
import { endpoints } from '../constants/end-points';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { constants } from "os";
import { StorageService } from './storage.service';
import { Console, error } from 'console';
import { loading } from '../shared/messages/dialogMessage';
import Swal from 'sweetalert2';
import { STORAGE_TOKEN } from '../constants/STORAGE-CONSTANT';

export interface IChangePasswordRequestDTO {
  key: string;
  newPassword: string;
}

export interface IAccessRefreshTokenPairDTO {
  access_token: string;
  refresh_token: string;
}

export interface IEmailResetRequestDTO {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private userSubscription: Subscription;

  constructor(
    private readonly http: HttpClient,
    private readonly httpService: HttpService,
    private router: Router,
    private stateStore: Store<ILocalStorage>,
    private storageService: StorageService,
  ) { }

  resetPassword(key: string, newPassword: string): Observable<boolean> {
    const url = `${environment[`apiBaseUrl`]}/auth/reset-password/finish`;
    const body: IChangePasswordRequestDTO = {
      key,
      newPassword,
    };

    //Change password function
    return this.http.post<any>(url, body).pipe(
      switchMap((resp: HttpResponse<any>) => {
        return of(true);
      }),
      catchError(() => of(false))
    );
  }

  sendOTPToUserEmail(email: string) {
    const url = `${environment[`apiBaseUrl`]}/auth/reset-password/init`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    try {
      const body = { email: email };
      this.http.post<any>(url, body, { headers: headers }).subscribe({
        next: () => {
          displaySuccessMessage('A verification link has been sent to your email!');
        },
        error: (error: HttpErrorResponse) => {
          let errorDTO: ErrorDTO = error.error;
          displayErrorMessage(errorDTO.errorMessage);
        },
      });
    } catch (e) {
      displayErrorMessage('An error occurred: ' + e);
    }
  }

  checkVerificationKey(key: string): Observable<boolean> {
    const url = `${environment.apiBaseUrl}/auth/reset-password/check-key`;
    return this.http.post<any>(url, {}, { params: { key: key } }).pipe(
      map(() => true),
      catchError(() => {
        // displayErrorMessage('The link is not valid!');
        return of(false);
      })
    );
  }

  getUsers(data: any): any {
    return this.httpService.postNoToken(endpoints.users_list_post, data);
  }

  save(user: any) {
    return this.httpService.postNoToken(endpoints.user_save, user);
  }
  authenticateLogin(user: any) {
    return this.httpService.postNoToken(endpoints.users_login, user);
  }
  verifyUser(user: any) {
    return this.httpService.postNoToken(endpoints.users_verify, user);
  }

  activate(user: any) {
    return this.httpService.getNoTokenNew(endpoints.activate + '?key=' + user);
  }

  getUserByToken(token: any) {
    return this.httpService.postNoToken(endpoints.remember_user, token);
  }

  getUserInfo() {
    return this.httpService.getWithToken(endpoints.get_user);
  }

  forgetPwd(user: any) {
    return this.httpService.postNoToken(endpoints.forgotPwd, user);
  }

  logoutProcess() {
    return this.httpService.postWithRefreshToken(endpoints.logout, {});
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);
  }

  logout(isGo: boolean, message?: string, returnUrl?: string) {
    this.logoutProcess().subscribe(
      () => {
        console.log('Logout process completed.');
      }
    );
    this.storageService.remove(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY);
    this.storageService.remove(STORAGE_TOKEN.LOCAL_STORAGE_REFRESH_KEY);
    this.storageService.remove('userInfo');
    if (isGo) {
      if (returnUrl) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
      }
      else if (message) {
        this.router.navigate(['/login', message]);
      } else
        this.router.navigate(['/login']);
    }
  }

  getNewToken() {
    return this.httpService
      .postWithRefreshToken(endpoints.refreshToken, {})
      .pipe(
        map((response: any) => {
          localStorage.setItem(STORAGE_TOKEN.LOCAL_STORAGE_ACCESS_KEY, response.access_token);
          localStorage.setItem(STORAGE_TOKEN.LOCAL_STORAGE_REFRESH_KEY, response.refresh_token);
        })
      );
  }

  changePassword(oldPassword: string, newPassword: string) {
    const url = `${environment.apiBaseUrl}/user/change-password`;
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    loading();

    this.http.put<any>(url, body).subscribe({
      next: (resp) => {
        Swal.close();
        displaySuccessMessage('Password changed successfully!');
        this.logout(true);
      },
      error: (error) => {
        displayErrorMessage(error.error.errorMessage);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
